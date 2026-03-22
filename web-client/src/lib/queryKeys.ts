/**
 * Centralized TanStack Query key factory.
 * Use these constants everywhere instead of inline string literals to prevent
 * typos that silently break cache invalidation.
 */
export const queryKeys = {
  // ── Auth / user ──────────────────────────────────────────────────────────
  userPrefs: ['user_prefs'] as const,
  userPlugins: ['user-plugins'] as const,
  plugins: ['plugins'] as const,
  systemSettings: (key: string) => ['system-settings', key] as const,

  // ── Contacts ─────────────────────────────────────────────────────────────
  contacts: {
    all: ['contacts'] as const,
    list: (page: number, filters: unknown, sort: unknown) =>
      ['contacts', page, filters, sort] as const,
    detail: (id: string | number) => ['contacts', String(id)] as const,
    similar: (id: string | number) => ['contacts', String(id), 'similar'] as const,
    timeline: (id: string | number) => ['contacts', String(id), 'timeline'] as const,
    snapshot: (contactId: string | number, logId: string | number) =>
      ['contacts', String(contactId), 'snapshot', String(logId)] as const,
    playbook: (id: string | number) => ['contacts', String(id), 'playbook'] as const,
    reciprocity: (id: string | number) => ['contacts', String(id), 'reciprocity'] as const,
    tasks: (id: string | number) => ['contacts', String(id), 'tasks'] as const,
    needsAttention: (limit: number) => ['contacts', 'needsAttention', limit] as const,
    needsAttentionPaged: (page: number) => ['contacts', 'needsAttention', 'paged', page] as const,
    displayOptions: ['contacts', 'display-options'] as const,
    autocomplete: ['contacts', 'autocomplete'] as const,
  },

  // ── Groups ───────────────────────────────────────────────────────────────
  groups: {
    all: ['groups'] as const,
    list: (params: unknown) => ['groups', params] as const,
  },

  // ── AI suggestions ───────────────────────────────────────────────────────
  aiSuggestions: {
    all: ['ai_suggestions'] as const,
    byEntity: (entityType: string, entityId: string | number) =>
      ['ai_suggestions', entityType, entityId] as const,
    stats: ['ai_suggestion_stats'] as const,
  },

  // ── Notifications ─────────────────────────────────────────────────────────
  notifications: {
    all: ['notifications'] as const,
    list: (page: number) => ['notifications', page] as const,
    unreadCount: ['notifications', 'unread-count'] as const,
    seasonalCheckin: ['notifications', 'seasonal-checkin'] as const,
  },
  notificationChannels: {
    all: ['notification-channels'] as const,
    list: (page: number) => ['notification-channels', page] as const,
  },
  notificationPolicies: {
    all: ['notification-policies'] as const,
    detail: (id: string | number) => ['notification-policies', String(id)] as const,
    eventTypes: ['notification-policy-event-types'] as const,
  },

  // ── Sessions / auth history ───────────────────────────────────────────────
  activeSessions: ['active-sessions'] as const,
  loginHistory: {
    list: (page: number) => ['login-history', page] as const,
    widget: ['login-history', 'widget'] as const,
  },

  // ── Audit logs ────────────────────────────────────────────────────────────
  auditLogs: {
    list: (page: number) => ['audit-logs', page] as const,
  },

  // ── Contact graph ─────────────────────────────────────────────────────────
  contactGraph: (params: unknown) => ['contact-graph', params] as const,

  // ── Playbook templates ────────────────────────────────────────────────────
  playbookTemplates: ['playbook_templates'] as const,

  // ── Dashboard ─────────────────────────────────────────────────────────────
  stats: ['stats'] as const,
  upcomingAnniversaries: ['upcoming-anniversaries'] as const,

  // ── Marketplace / plugins ─────────────────────────────────────────────────
  marketplace: {
    registry: ['marketplace', 'registry'] as const,
    readme: (pluginId: string) => ['marketplace', 'readme', pluginId] as const,
  },

  // ── API keys ──────────────────────────────────────────────────────────────
  apiKeys: {
    // `all` is a prefix key used for bulk invalidation after any mutation.
    // Any key starting with 'api-keys' (including list pages) will be invalidated.
    all: ['api-keys'] as const,
    list: (page: number) => ['api-keys', page] as const,
  },
} as const
