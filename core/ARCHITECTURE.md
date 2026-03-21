# Core Service Architecture

This document provides a technical overview of the `core` service (backend), which serves as the API and business logic layer for the application.

## Technology Stack

- **Language**: PHP 8.5
- **Framework**: Symfony 7.4
- **API Framework**: API Platform 4
- **ORM**: Doctrine ORM 3
- **Database**: MySQL (via `pdo_mysql`)
- **Authentication**: JWT (LexikJWTAuthenticationBundle)
- **Static Analysis**: PHPStan (Level 8 with Symfony container integration), Psalm (Level 3), Deptrac
- **Testing**: PHPUnit 12

## Directory Structure

Standard Symfony Flex structure with specific patterns:

```
core/
├── src/
│   ├── ApiResource/      # Custom API Platform resources (non-entity based)
│   ├── Command/          # Symfony Console commands
│   ├── Controller/       # Custom API actions (e.g., Export/Import) - No UI Controllers
│   ├── Doctrine/         # Doctrine extensions (Filters, etc.)
│   ├── Dto/              # Data Transfer Objects
│   ├── Entity/           # Doctrine Entities & API Platform Resources
│   ├── EventListener/    # Doctrine & Symfony Event Listeners
│   ├── EventSubscriber/  # Symfony Event Subscribers (Audit Log, etc.)
│   ├── Filter/           # Custom API Platform Filters
│   ├── Repository/       # Doctrine Repositories
│   ├── Security/         # Security Voters & Multi-tenancy logic
│   ├── Service/          # Business logic services
│   └── State/            # API Platform State Providers & Processors
└── tests/                # PHPUnit tests (Functional & Unit)
```

## Key Architectural Patterns

### 1. Multi-Tenancy
The application is designed to be multi-tenant, where data is isolated per "Tenant" (User).
- **Interface**: `Ari\Security\TenantAwareInterface` guarantees a `getTenant()` method.
- **Trait**: `Ari\Security\TenantAwareTrait` implements the interface and ensures `onDelete: CASCADE` at the database level for the `tenant_id` foreign key. This guarantees that deleting a user automatically cleans up all their associated multi-tenant data.
- **Enforcement**: `Ari\Doctrine\Filter\TenantFilter` is a Doctrine SQLFilter that automatically appends `AND tenant_id = <current_user_id>` to SQL queries. This ensures users cannot accidentally access other users' data.
- **Bypass**: The filter can be disabled for administrative tasks or internal commands.

> **⚠ Critical invariant — TenantFilter is the only tenant guard on list endpoints.**
>
> Detail endpoints (`GET /api/contacts/{id}`) use `ContactVoter` for defense-in-depth.
> List endpoints (`GET /api/contacts`, etc.) rely **solely** on `TenantFilter`.
> `TenantFilterConfigurator` (priority 1 on `KernelEvents::REQUEST`) enables the filter
> on every HTTP request. **Never disable the filter inside a request context** — doing so
> exposes every list endpoint to cross-tenant data leakage with no other safeguard.
>
> Acceptable disable sites: console commands, internal services called only from CLI
> (e.g. `E2eSeedService`), test fixtures. Always re-enable immediately after the
> query that requires it.

### 2. Security & ACL
Security is handled at the object level using Symfony Voters.
- **Voters**: Located in `src/Security/Voter`, e.g., `ContactVoter`.
- **Permissions**: Defined constants like `CONTACT_VIEW`, `CONTACT_EDIT`, `CONTACT_ADD`.
- **API Integration**: API Platform resources use `security` attributes, e.g., `security: "is_granted('CONTACT_VIEW', object)"`.
- **Brute Force Protection**: Implemented via Symfony's `login_throttling` on the `/api/login` firewall. Limits login attempts to 5 per minute per IP/Username to prevent password guessing attacks. Requires `symfony/rate-limiter` and `symfony/lock`.
- **Account Deletion**: `DELETE /api/profile` allows users to delete their entire account and all associated data. Handled by `CurrentUserProvider`, `UserDeleteProcessor`, and database-level cascades.

#### Security attribute convention for API Platform resources

Two patterns are used — choosing the wrong one for an operation can create a security hole:

| Operation | Pattern | Rationale |
|-----------|---------|-----------|
| **List** (`GetCollection`) | `security: "is_granted('ROLE_USER')"` | TenantFilter isolates results to the current user. No object is available at this point. |
| **Detail / Mutate** (`Get`, `Patch`, `Put`, `Delete`, `Post` on sub-resources) | `security: "is_granted('CONTACT_VIEW', object)"` | Voter receives the concrete entity and performs owner check. Without this, a crafted IRI lets a user access another tenant's record. |

**Rule:** Every operation that exposes or mutates a single entity **must** use a Voter-based security attribute. Using `ROLE_USER`-only on a detail endpoint bypasses the voter check and leaves tenant isolation solely to the (SQL-level) `TenantFilter`, which is not applied on direct `find()` / `findOneBy()` calls made without a QueryBuilder.

PR checklist:
- [ ] New `Get`, `Patch`, `Put`, `Delete` operations use `security: "is_granted('<PERMISSION>', object)"` or `securityPostDenormalize`
- [ ] New `GetCollection` operations rely on TenantFilter (no object available) — `ROLE_USER` is correct there

### 2a. API Key Authentication

In addition to JWT, the API supports scoped, revocable **API keys** that allow AI agents and scripts to access the same `/api/*` endpoints with restricted permissions.

#### Token format

```
Authorization: Bearer ari_<64-hex-chars>
```

The raw secret is `ari_` + `bin2hex(random_bytes(32))`. Only a SHA-256 hash of the secret is stored (`secretHash`). The last four characters of the raw secret (`secretLastFour`) are stored in plaintext for display in the UI (`ari_...ab3f`).

#### Why SHA-256 and not Argon2id

API secrets are 256-bit cryptographically random strings, not user-chosen passwords. Argon2id's deliberate slowness (100–300 ms, high memory) is designed to resist dictionary attacks on weak passwords. Applied to random secrets it provides zero additional security while consuming significant CPU on every API request. SHA-256 + `hash_equals()` takes microseconds and is safe because a 32-byte random value cannot be brute-forced (2²⁵⁶ search space).

#### Authenticator chain

`ApiKeyAuthenticator` is registered on the `api` firewall **before** `jwt`. If the `Authorization` header starts with `Bearer ari_`, `ApiKeyAuthenticator` handles the request; otherwise it falls through to JWT (existing behaviour unchanged).

```
Bearer ari_<token>  →  ApiKeyAuthenticator  →  ApiKeyToken  →  scope-gated voters
Bearer <jwt>        →  JWT authenticator    →  PostAuthenticationToken  →  normal voters
```

Because Symfony's JWT bundle intercepts any `Bearer` token before custom authenticators can run, an `ApiKeyJwtBypassSubscriber` (priority 500) moves `ari_*` tokens from `Authorization` to a private header before the security firewall fires, ensuring clean separation.

#### ApiKeyToken and scope enforcement

On successful authentication, `ApiKeyAuthenticator::createToken()` returns an `ApiKeyToken extends AbstractToken` that carries the user's roles, the key's UUID, name, last-four suffix, and scopes array.

Voters check `$token instanceof ApiKeyToken` at the top of `voteOnAttribute` and deny access if the required scope is missing:

```php
if ($token instanceof ApiKeyToken) {
    $required = match ($attribute) {
        self::VIEW => 'contacts:read',
        self::EDIT => 'contacts:write',
        // ...
    };
    if ($required !== null && !$token->hasScope($required)) {
        return false;
    }
}
```

Scope wildcards are supported: `*` grants everything; `contacts:*` grants all `contacts:` scopes.

#### Rate limiting

API key requests are rate-limited via `symfony/rate-limiter` (sliding window, 1 000 req/hour per key by default). Configurable via the `API_KEY_RATE_LIMIT` env var. Every response from an API key session includes:

```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 743
X-RateLimit-Reset: 1718123456
```

Headers are present even on 401/403 responses. When the limit is exceeded the response is `429 Too Many Requests`.

#### Audit logging

`AuditLogSubscriber` sets `AuditLog.actorLabel` to `"api_key:{uuid} ({name}, ...{lastFour})"` for API key sessions. This label is a plain-text snapshot — the audit trail remains intact even after a key is revoked (hard deleted).

#### `lastUsedAt` / `lastUsedIp`

Updated asynchronously via a `KernelEvents::TERMINATE` subscriber (fires after the response is sent). The update uses a raw SQL statement to avoid EntityManager state issues and lost-update contention on concurrent requests.

#### IP address resolution

`$request->getClientIp()` respects Symfony's `trusted_proxies` configuration. Set the `TRUSTED_PROXIES` env var (e.g. `127.0.0.1,10.0.0.0/8`) when running behind Nginx, Caddy, or Cloudflare to record the real client IP instead of the proxy address.

#### Key management API

```
GET    /api/api_keys          paginated list of the user's keys (metadata only)
POST   /api/api_keys          create a key → returns token ONCE in response
PATCH  /api/api_keys/{id}     rename or update scopes (no secret rotation)
DELETE /api/api_keys/{id}     revoke (hard delete)
```

### 3. API Design
- **Resources**: Primarily entity-based, exposed via `#[ApiResource]`.
- **Serialization**: Controlled via `#[Groups]`.
  - `*:read`: For read operations.
  - `*:create`/`*:update`: For write operations.
  - `export`: Specific groups for data export.
- **Custom Operations**: Implemented using `#[Get]`, `#[Post]`, etc., pointing to custom Controllers or State Processors where standard CRUD is insufficient (e.g., XML Import/Export, vCard Export, Change Password). XML Import is limited (default 70) to prevent memory issues, configurable via `XML_IMPORT_LIMIT`.
- **Change Password**: `PUT /api/profile/change-password` allows users to change their password securely using `ChangePasswordDto` and `UserPasswordChangeProcessor`.
- **Account Deletion**: `DELETE /api/profile` securely removes all user data. Multi-tenant data isolation is reinforced by `onDelete: CASCADE` on the `tenant_id` foreign key in `TenantAwareTrait`.
- **vCard Export**: `GET /api/contacts/{id}/vcard` exports a contact in vCard 4.0 format using `VCardService` (powered by `sabre/vobject`).
- **Statistics**: `GET /api/stats` provides total counts of contacts, audit logs, and sent notifications for the dashboard widget.
- **User Creation**: `POST /api/users` uses `UserInitialSetupProcessor` to automatically generate default notification channels ("web") and policies ("Default") for new users.

### 4. Audit Logging
Changes to critical entities are tracked via `Ari\EventSubscriber\AuditLogSubscriber`.
- **Mechanism**: Listens to Doctrine `onFlush` and `postPersist` events.
- **Storage**: Stores changes as JSON snapshots (`snapshotBefore`, `snapshotAfter`) and change sets in the `AuditLog` entity. For UPDATE operations, `snapshotAfter` contains the full entity state after the change.
- **Scope**: Automatically audits any entity implementing `TenantAwareInterface` (unless explicitly excluded).

#### Contact Point-in-Time Snapshots
The system can reconstruct the complete state of a contact at any point in its history.
- **API**: `GET /api/contacts/{contactId}/snapshot/{logId}` returns the aggregated contact state at the specified audit log entry.
- **Service**: `ContactSnapshotService` uses a forward-replay algorithm — it fetches all timeline logs up to the target log ID and sequentially applies INSERT/UPDATE/REMOVE operations to build the state.
- **Provider**: `ContactSnapshotProvider` (API Platform State Provider) handles the endpoint, returning 404 if the log doesn't exist or doesn't belong to the contact.
- **Backward Compatibility**: Supports both old-format UPDATE logs (with `changes` only) and new-format logs (with full `snapshotAfter`).
- **Collections**: The snapshot includes the contact itself and all child entity collections: `contactNames`, `contactPhoneNumbers`, `contactDates`, `contactEmailAddresses`, `contactAddresses`, `contactOrganizations`, `contactBiographies`, `contactInteractions`, `contactRelations`.

#### Interactions & Cadence
The `ContactInteraction` entity tracks individual communication events between the user and a contact. Each interaction has a user-supplied `timestamp` ("when did this happen?") and a system-generated `createdAt` ("when was this record created?") — both fields are always present.

Extended fields added in the Interactions & Cadence phase:
- `initiator` (`string|null`, enum: `me` / `them`) — who reached out first.
- `tags` (`string[]|null`, JSON column) — free-form labels (max 20 items, each ≤ 64 chars).

`contactInteractions` is included in the `contact:read` serialization group and therefore appears in Point-in-Time Snapshots. The collection is capped at 200 items per contact in the `contact:read` response to bound response size; the full history is always available via `GET /api/contact_interactions?contact={iri}`.

The `Contact` entity carries a `cadenceDays` field (`int|null`) — the user's target interval in days between interactions. `cadenceDays` is patched via `PATCH /api/contacts/{id}` (merge-patch) with validation `Assert\Positive` (must be ≥ 1 or null).

#### NeedsAttentionProvider
`GET /api/contacts/needs-attention` returns contacts whose last interaction is overdue relative to their cadence. The endpoint is implemented as a custom API Platform State Provider (`NeedsAttentionProvider`) backed by `NeedsAttentionRepository`.

Key design decisions:
- **Denormalized field**: `Contact::lastInteractionAt` stores the most recent interaction timestamp, maintained by `ContactInteractionListener`. `NeedsAttentionProvider` reads this field directly — no `GROUP BY` + `JOIN` on `contact_interaction`. See §17 for the maintenance strategy.
- **Route priority**: The literal path segment `needs-attention` takes precedence over the `{id: \d+}` pattern — no route conflict with `GET /api/contacts/{id}`.
- **Response shape**: Returns `NeedsAttentionContactDto` objects that extend the standard `Contact` serialization with two extra fields: `lastInteractionAt` (nullable ISO 8601 string) and `overdueDays` (integer). When `lastInteractionAt` is null (contact was never interacted with), `overdueDays` equals `cadenceDays` — a documented sentinel meaning "maximally overdue regardless of when the contact was added".
- **Sorting**: Results are ordered by `overdueDays DESC` so the most neglected contacts appear first. Contacts never interacted with sort at the top within the same cadence bucket.
- **Tenant isolation**: Relies solely on `TenantFilter` (standard for list endpoints — see §1 critical invariant). No Voter is required because no single entity object is loaded.

### 5. Notification System
Entities: `NotificationRule`, `NotificationQueue`, `NotificationPolicy`, `NotificationChannel`.
- **Logic**: Rules define when notifications are sent.
- **Channels**: Supported delivery channels include `web` (Activity Feed) and `telegram`.
- **Queue**: Pending notifications are stored in `NotificationQueue`.
- **Delivery**: Processed by services implementing `NotificationSenderInterface` (e.g., `ActivityFeedSender`, `TelegramSender`), utilizing Symfony's `AsTaggedItem` for channel-specific logic.
- **Webhook**: `POST /webhook/telegram` receives updates from Telegram. It processes `/start {userId}_{channelId}` commands to link a Telegram chat to a `NotificationChannel` by updating its `chatId` in the configuration. This bypasses the multi-tenancy filter to find the channel by ID and then manually verifies ownership.
- **Cleanup**: `Ari\EventListener\NotificationRuleListener` ensures pending queue items are canceled when a rule is deleted.

### 6. User Preferences
Entity: `UserPref`.
- **Mechanism**: Stores user-specific settings (e.g., language, date format, time format, timezone, sync preferences, dashboard settings).
- **Validation**: Enforced via `#[Assert\Callback]` in the entity to ensure values matches the preference type.
- **API**: Exposed via custom `UserPrefStateProvider` and `UserPrefProcessor` to allow access by preference `type` instead of ID.
  - `contact_table_settings`
  - `theme`
  - `show_logo`
  - `dashboard_settings`
  - `timezone`
  - `ai_context_locale`
- **Dashboard Settings**: The `dashboard_settings` type stores a JSON blob containing the user's dashboard customization (layout preset, widget zone assignments, hidden widgets). Empty JSON `{}` means "use system defaults".

### 7. Google Contacts Integration
Location: `src/Service/Google/`.
- **Import**: `GoogleContactsService` imports contacts from Google People API using an asynchronous architecture (Symfony Messenger).
  - **Group Sync**: Synchronous pre-warm of contact groups.
  - **Contact Sync**: Dispatches `ImportGoogleContactMessage` to the `async` queue for every contact to prevent OOM errors.
  - **Limit**: The number of contacts is limited (default 70, configurable via `GOOGLE_CONTACTS_IMPORT_LIMIT`).
- **Update Sync**: `GoogleContactUpdateService` pushes contact data (phones, emails, names, addresses, bios, orgs, dates) to Google when `UserPref::TYPE_GOOGLE_SYNC_ON_UPDATE` is enabled.
- **Event Subscriber**: `ContactSyncSubscriber` listens to changes in `Contact` and its related entities (phones, names, emails, addresses, bios, orgs, dates) and triggers the sync after flush.
- **OAuth Scope**: Uses `https://www.googleapis.com/auth/contacts` for read/write access.

### 8. Demo Account Generation
- **Service**: `Ari\Service\Demo\DemoAccountService` generates a pre-populated user with 70 contacts and complex relationships (families, colleagues).
- **Command**: `bin/console ari:demo-account:generate` triggers generation via CLI.
- **API**: `POST /api/demo-account` allows triggering via the web client (returns the username).
- **Data Generator**: `Ari\Service\Demo\DemoDataGenerator` provides realistic localized data without external dependencies.

### 9. Code Quality & Standards
The project enforces strict code quality:
- **Deptrac**: Enforces architectural layers:
  - **Controllers**, **Commands**, **ApiResources**: Cannot access **Repositories** directly. Must use **Services**.
  - **Services**: Can access **Repositories**, **Entities**, and other services.
  - **State Providers/Processors**: Can access **Services** and **Entities**.
  - **Entities**: Isolated (no dependencies on other layers).
  - Run `make deptrac` in CI; run `make deptrac-strict` periodically to catch uncovered files.
- **PHPStan/Psalm**: High strictness levels to prevent type errors.
- **CS-Fixer**: Enforces PSR-12 and Symfony coding standards.

- **composer.json**: Describes dependencies and QA scripts.
- **[QA and Testing](docs/qa_and_testing.md)**: Details on the test environment and Makefile commands.

### 10. Console Command Pattern

Console commands (`src/Command/`) are **permitted to use `EntityManagerInterface` directly** rather than going through a service. This is intentional:

- Commands run from the CLI only — they are never invoked as HTTP requests, so Symfony Voters and security firewalls do not apply.
- Audit logging via `AuditLogSubscriber` still fires (it listens to Doctrine events, not HTTP requests), so CLI changes ARE recorded in the audit trail.
- Commands that need to bypass the `TenantFilter` (e.g., admin utilities) may call `$em->getFilters()->disable('tenant')` explicitly, and must document that they do so.

**When to use a service instead:** If the same logic will be triggered both from the CLI *and* from an HTTP request (e.g., a cron job exposed via an API endpoint), extract the logic into a service and call it from both the command and the controller. This ensures Voter checks apply in the HTTP path.

**Current commands that use EntityManager directly (accepted):**
- `UserPromoteCommand` / `UserDemoteCommand` — admin-only, no Voter needed (already requires server access to run)
- `CleanupExpiredTokensCommand` — bulk DELETE, no tenant filter needed (targets expired rows globally)
- `E2eSeedCommand` / `GenerateDemoAccountCommand` — test/demo seeding, intentionally bypasses normal flows

## Development & QA Workflow

The project uses an isolated, SQLite-backed test environment. For the best experience, use the provided `Makefile` in the `core/` directory.

### Essential Commands

```bash
# Run the complete Quality Assurance suite (Tests + Static Analysis)
make qa

# Run only tests
make test

# Generate coverage report
make coverage

# Fix coding standards
make cs-fix
```

For a full list of commands and technical details about the test environment, see [QA and Testing Infrastructure](docs/qa_and_testing.md).

### Legacy / Direct Container Access
If you need to execute commands directly in the development container:
```bash
# Access container
docker exec -it ari-app-1 bash -c "cd /app/core && bash"
```

### Contact Dates Filtering

The `ContactDate` collection (Dashboard Upcoming Anniversaries) supports filtering based on the current user's `NotificationPolicy`.

1.  **Preference**: A `UserPref` of type `dashboard_notification_policy` holds the ID of the active `NotificationPolicy`.
2.  **Filter**: `UpcomingAnniversaryOrderFilter` implements the logic.
    *   It checks the `dashboard_notification_policy` preference.
    *   If a policy is set, it iterates over its `NotificationRule`s.
    *   It dynamically constructs DQL using `OR` between rules, filtering by `contactGroup` (using `EXISTS`), specific `contact`, and `eventType` (case-insensitive text matching).
    *   If no rules are active for a policy, the collection returns empty by default to respect the policy constraints.
### 11. Contact Graph Filtering

The `/api/contact-graph` endpoint supports advanced filtering via `ContactGraphProvider`:

- **Level Filtering**: Using `contactId` and `level` (default 1).
  - `level=1`: Returns the contact and its direct relations.
  - `level=2`: Returns the contact, its relations, and their relations (2nd degree).
- **Group Filtering**: Using `groupId`.
  - Returns all members of the group and all their 1st-degree connections.

These filters are useful for visualizing social circles or group-specific networks.

### 12. File Storage (Avatars)
The application supports contact avatar uploads with abstracted storage.
- **Abstraction**: Uses `league/flysystem-bundle` for storage abstraction.
- **Drivers**: Supports `local` (default) and `s3` (AWS/Minio) drivers, switchable via environment variables.
- **Processing**: Uses `intervention/image` for image resizing and thumbnail generation.
- **Thumbnail Strategy**: Dual strategy for thumbnails (150x150): they can be stored as BLOBs in the database for fast access without disk I/O, or served from storage. Controlled via `APP_STORE_THUMBNAILS_IN_DB`.
- **API**: `POST /api/contacts/{id}/avatar` handles `multipart/form-data` uploads.


### 13. AI Contact Suggestions

The AI suggestions subsystem analyzes `ContactName` entries and proposes locale-aware transliterated alternatives (e.g., Cyrillic → Latvian Latin).

#### Entity: `AiSuggestion`
- Tenant-aware, non-FK reference to any entity via `entityType` + `entityId`
- `status`: `pending` | `accepted` | `dismissed` | `error` | `skipped`
- `sourceHash`: `md5(trim(given) . '|' . trim(family))` — deduplication key
- Unique constraint: `(tenant_id, entity_type, entity_id, suggestion_type, source_hash)`

#### Dispatch Flow
1. `ContactName` saved (INSERT/UPDATE without locale) → `AiSuggestionService::maybeDispatch()`
2. Eligibility check: locale not set, name ≥ 3 chars, no digits/special chars, single script
3. Duplicate check via `sourceHash` in `AiSuggestionRepository::findExisting()`
4. If eligible and not duplicate: dispatch `GenerateAiSuggestionMessage` to `async` queue
5. `GenerateAiSuggestionMessageHandler` calls `LlmClientInterface::suggestLocaleAlternative()`
6. Result validated via `isValidLocale()` against `ALLOWED_LOCALES`
7. `AiSuggestion` persisted with `status=pending` and full payload

#### LLM Client Interface
- `LlmClientInterface::isAvailable()` — checks if provider is configured
- `LlmClientInterface::suggestLocaleAlternative(given, family, allowedLocales)` — returns `SuggestionResult|null`
- Implementations: `AnthropicLlmClient`, `OpenAiLlmClient`; `NullLlmClient` when `AI_API_KEY` is empty
- Configured via `AI_API_KEY`, `AI_PROVIDER`, `AI_MODEL`, `AI_BASE_URL` env vars

#### Resolution (PATCH /api/ai_suggestions/{id})
- `accepted`: original ContactName gets `detectedLocale`, new ContactName created with `suggestedLocale` + transliterated names
- `dismissed`: marks suggestion as dismissed; no new ContactName created
- `AiSuggestionProcessor` (API Platform State Processor) handles both cases
- Voter: `AI_SUGGESTION_RESOLVE` — ensures only the tenant who owns the suggestion can resolve it

#### Batch Trigger
- `POST /api/ai_suggestions/batch` → dispatches `TriggerBatchAiAnalysisMessage`
- Handler iterates all ContactNames for the user without locale and calls `maybeDispatch()` for each

#### Orphan Cleanup
- `AiSuggestionCleanupListener` — registered on `preRemove` for `ContactName`
- Runs DQL `DELETE FROM AiSuggestion WHERE entityType='contact_name' AND entityId=:id`
- Uses `preRemove` (not `postRemove`) because Doctrine ORM 3 nulls the entity ID before `postRemove` fires

#### Architecture Note
The `entityType` + `entityId` pattern (instead of FK) allows the suggestion table to reference future entity types (phone numbers, emails) without schema changes.

### 14. Observability

#### Health endpoint (`GET /api/health`)
- Public endpoint — no authentication required.
- `HealthService` aggregates check results from pluggable `HealthCheckInterface` implementations.
- HTTP 200 when all checks are `ok` or `warn`; HTTP 503 when any check is `error`.
- `APP_VERSION` env var is returned in the response body; allows uptime monitors to detect version mismatches after deploys.
- Route is at `/api/health` — safe to add new checks without firewall conflicts (see "Symfony Firewall Pattern Gotcha" in CLAUDE.md).

#### Metrics endpoint (`GET /metrics`)
- Protected by `X-Metrics-Token` header; value must match the `metrics_secret` kernel parameter (populated from `METRICS_SECRET` env var).
- Returns 404 when `METRICS_SECRET` is empty (feature disabled by default).
- Returns Prometheus text format (`text/plain; version=0.0.4`).
- Route is at `/metrics` — **outside the `/api` prefix** and therefore unaffected by the `^/api/login` firewall rule that would cause 401 errors with a valid JWT token.

#### `MetricsService`
- Single point of access for all business metrics queries.
- Uses DBAL directly (not ORM) to bypass `TenantFilter` — metrics are admin-scope aggregates across all tenants.
- All query methods are wrapped in `try/catch` and return 0 on error, so a failing metric does not break the entire scrape.
- Injected as a service into `MetricsController`; no direct DB access in the controller.

#### Structured logging
- `RequestContextSubscriber` (Kernel event subscriber) injects `tenant_id` (anonymised) and `request_id` into the Monolog context on every request.
- `LOG_TENANT_HASH_KEY` env var: when set, `tenant_id` is hashed with HMAC-SHA256 before logging; when empty, `tenant_id` is omitted entirely and a WARNING is logged at startup.
- Caddy access logs are emitted as JSON (`format json`) — Grafana Alloy collects them via Docker log socket and forwards to Loki.

#### Backup sentinel (textfile collector pattern)
- `backup.sh db` writes `ari_backup_last_success_timestamp_seconds` to `/var/node_exporter_textfiles/ari_backup.prom` after every successful backup.
- Node Exporter's `--collector.textfile.directory` flag exposes the file as a Prometheus metric.
- `BackupMissed` alert fires when `time() - ari_backup_last_success_timestamp_seconds > 93600` (26 hours).
- The sentinel file is written atomically: `printf ... > file.tmp && mv file.tmp file` — no partial reads by Node Exporter.

#### Caddy `/metrics` access restriction
- Default `docker/Caddyfile` routes `/metrics` to PHP — accessible from any IP (safe for development).
- When `compose.monitoring.yaml` is active, `monitoring/caddy/metrics-block.Caddyfile` replaces the image-baked Caddyfile and restricts `/metrics` to RFC-1918 IP ranges (`10.0.0.0/8`, `172.16.0.0/12`, `192.168.0.0/16`) — Prometheus reaches the app over Docker's internal `172.x.x.x` network, external requests get 403.

### 15. Quota Enforcement — Pessimistic Write Lock

Contact creation is guarded by a per-user quota using a pessimistic write lock to prevent concurrent requests from both passing the quota check and exceeding the limit.

#### Pattern

```php
// MySQL/MariaDB — SELECT FOR UPDATE prevents phantom reads
$connection->beginTransaction();
$transactionStarted = true;
try {
    $limit = $entitlementService->getContactsLimit($user); // 0 = unlimited
    if (0 !== $limit) {
        $count = $contactRepository->countByTenantWithLock($user); // PESSIMISTIC_WRITE
        if ($count >= $limit) {
            throw new QuotaExceededException('quota_exceeded');
        }
    }
    $result = $processor->process($data, ...);
    $connection->commit();
    return $result;
} catch (\Throwable $e) {
    if ($transactionStarted && $connection->isTransactionActive()) {
        $connection->rollBack();
    }
    throw $e;
}
```

#### SQLite fallback

SQLite does not support `SELECT FOR UPDATE`. Detect via `instanceof SqlitePlatform` and wrap in a regular transaction (INSERT + compensating check + rollback if over quota). The quota check runs inside the transaction so it sees the just-inserted row.

#### Exception mapping

`QuotaExceededException` is mapped to HTTP 422 in `config/packages/api_platform.yaml`. The message key is `quota_exceeded`.

#### Entitlement resolution

`EntitlementService::getContactsLimit()` returns `0` for unlimited (admin or plans with no cap). Limit values from `%ari_plans%` config can be overridden per-plan via env vars (`APP_CONTACTS_LIMIT_{PLAN_ID_UPPER}`). Env vars are validated: must be non-negative integers or a `\LogicException` is thrown at startup.

---

### 16. Per-User JWT Rate Limiting

Sensitive write endpoints are rate-limited per authenticated user via `JwtUserRateLimiterSubscriber` (priority -10 on `KernelEvents::REQUEST`, after auth). API-key requests have their own rate limiter and are skipped here.

#### Protected routes

| Route name | Limiter | Default limit |
|---|---|---|
| `contact_playbook_post` | `playbook_activation` | 20 / hour |
| `contact_task_patch` | `task_completion` | 200 / hour |
| `api_sms_backup_import` | `sms_import` | 5 / day |

Limits are defined in `config/packages/rate_limiter.yaml` (token bucket). All limiters use `no_limit` policy in the `test` environment.

#### Response on 429

```
HTTP/1.1 429 Too Many Requests
X-RateLimit-Limit: 20
X-RateLimit-Remaining: 0
X-RateLimit-Reset: 1718123456      (Unix timestamp)
Retry-After: 3542                  (seconds — RFC 7231 §7.1.3)
```

#### Adding a new rate-limited route

1. Add a limiter entry in `rate_limiter.yaml` (and `no_limit` in `when@test:`).
2. Add the route name to `JwtUserRateLimiterSubscriber::onRequest()`.
3. If the route name comes from an API Platform operation, ensure the operation has an explicit `name:` attribute (e.g. `#[Patch(name: 'my_route')]`).

---

### 17. Denormalized `Contact::lastInteractionAt`

`Contact` carries a `lastInteractionAt` (`DateTimeImmutable|null`) field that mirrors the maximum `ContactInteraction.timestamp` for that contact. This avoids a `GROUP BY` + `JOIN` on `contact_interaction` in hot read paths such as `NeedsAttentionProvider`.

#### Maintenance — `ContactInteractionListener`

- **`prePersist`**: Collects `(contactId → maxTimestamp)` for each `ContactInteraction` being persisted.
- **`postFlush`**: Issues a DQL `UPDATE` per contact: `SET lastInteractionAt = :ts WHERE (lastInteractionAt IS NULL OR lastInteractionAt < :ts)`. The condition ensures the field only advances (out-of-order imports are safe).
- The pending map is swapped out before iteration to prevent re-entrant loops.
- Implements `ResetInterface` — Symfony Messenger resets the state between messages.

#### Known limitation

If a Messenger worker is killed between `prePersist` and `postFlush`, `lastInteractionAt` may be stale for the affected contacts. It can be repaired by re-running the backfill UPDATE from `Version20260321000000`.

#### Backfill migration

`Version20260321000000` adds the column and backfills it via a correlated subquery (SQLite-compatible). For tables > 100 k rows, use the JOIN form documented in the migration comment.

---

### 18. DQL-Only Repository Queries

All data access uses DQL (Doctrine QueryBuilder or named DQL) rather than raw DBAL SQL. This ensures:

- The Doctrine `TenantFilter` applies automatically to all queries (no accidental cross-tenant leaks).
- Type safety via Doctrine type hydration.
- Testability — queries work against both MySQL and SQLite test environments.

**Exception**: `MetricsService` uses DBAL directly because it queries across all tenants (admin-scope aggregates) and deliberately bypasses the `TenantFilter`. This is documented and intentional.

**Field name injection guard**: Methods that accept a field name as a parameter (e.g. `getDistinctValues(string $field)`) must validate the name before interpolation:

```php
if (1 !== preg_match('/^[a-zA-Z_][a-zA-Z0-9_]*$/', $field)) {
    throw new \InvalidArgumentException("Invalid field name: '$field'");
}
```
