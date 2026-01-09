# Core Service Architecture

This document provides a technical overview of the `core` service (backend), which serves as the API and business logic layer for the application.

## Technology Stack

- **Language**: PHP 8.5
- **Framework**: Symfony 7.4
- **API Framework**: API Platform 4
- **ORM**: Doctrine ORM 3
- **Database**: MySQL (via `pdo_mysql`)
- **Authentication**: JWT (LexikJWTAuthenticationBundle)
- **Static Analysis**: PHPStan (Level 8), Psalm (Level 3), Deptrac
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
- **Interface**: `App\Security\TenantAwareInterface` guarantees a `getTenant()` method.
- **Trait**: `App\Security\TenantAwareTrait` implements the interface.
- **Enforcement**: `App\Doctrine\Filter\TenantFilter` is a Doctrine SQLFilter that automatically appends `AND tenant_id = <current_user_id>` to SQL queries. This ensures users cannot accidentally access other users' data.
- **Bypass**: The filter can be disabled for administrative tasks or internal commands.

### 2. Security & ACL
Security is handled at the object level using Symfony Voters.
- **Voters**: Located in `src/Security/Voter`, e.g., `ContactVoter`.
- **Permissions**: Defined constants like `CONTACT_VIEW`, `CONTACT_EDIT`, `CONTACT_ADD`.
- **API Integration**: API Platform resources use `security` attributes, e.g., `security: "is_granted('CONTACT_VIEW', object)"`.

### 3. API Design
- **Resources**: Primarily entity-based, exposed via `#[ApiResource]`.
- **Serialization**: Controlled via `#[Groups]`.
  - `*:read`: For read operations.
  - `*:create`/`*:update`: For write operations.
  - `export`: Specific groups for data export.
- **Custom Operations**: Implemented using `#[Get]`, `#[Post]`, etc., pointing to custom Controllers or State Processors where standard CRUD is insufficient (e.g., XML Import/Export).

### 4. Audit Logging
Changes to critical entities are tracked via `App\EventSubscriber\AuditLogSubscriber`.
- **Mechanism**: Listens to Doctrine `onFlush` and `postPersist` events.
- **Storage**: Stores changes as JSON snapshots (`snapshotBefore`, `snapshotAfter`) and change sets in the `AuditLog` entity.
- **Scope**: Automatically audits any entity implementing `TenantAwareInterface` (unless explicitly excluded).

### 5. Notification System
Entities: `NotificationRule`, `NotificationQueue`, `NotificationPolicy`.
- **Logic**: Rules define when notifications are sent.
- **Queue**: Pending notifications are stored in `NotificationQueue`.
- **Cleanup**: `App\EventListener\NotificationRuleListener` ensures pending queue items are canceled when a rule is deleted.

### 6. User Preferences
Entity: `UserPref`.
- **Mechanism**: Stores user-specific settings (e.g., language, date format, time format, sync preferences).
- **Validation**: Enforced via `#[Assert\Callback]` in the entity to ensure values matches the preference type.
- **API**: Exposed via custom `UserPrefStateProvider` and `UserPrefProcessor` to allow access by preference `type` instead of ID.

### 7. Code Quality & Standards
The project enforces strict code quality:
- **Deptrac**: Enforces architectural layers (e.g., Controllers cannot depend on Entity internals directly? - *Check deptrac.yaml*). 
  - *Correction based on file content*: Controllers depend on everything. Entities are isolated.
- **PHPStan/Psalm**: High strictness levels to prevent type errors.
- **CS-Fixer**: Enforces PSR-12 and Symfony coding standards.

## Development Workflow

All commands should be executed within the Docker container:

```bash
# Access container
docker exec -it ari-app-1 bash -c "cd /app/core && bash"

# Run Quality Assurance Suite
docker exec -w /app/core ari-app-1 composer qa

# Run Tests
docker exec -w /app/core ari-app-1 vendor/bin/phpunit

# Fix Coding Standards
docker exec -w /app/core ari-app-1 composer cs-fix
```

## Critical Components for AI Context

When modifying the system, pay attention to:
- **`src/Doctrine/Filter/TenantFilter.php`**: Critical for data isolation. Ensure it's active for user requests.
- **`src/Security/Voter/*`**: Update voters when adding new entities or permissions.
- **`src/EventSubscriber/AuditLogSubscriber.php`**: Ensure new entities are audited if needed.
- **`composer.json`**: Describes dependencies and QA scripts.

