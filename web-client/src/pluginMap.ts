import type { BasePlugin } from './lib/core/Plugin'

export type PluginConstructor = new () => BasePlugin

export const PLUGIN_MAP: Record<string, () => Promise<{ default: PluginConstructor }>> = {
  dashboard: () => import('./plugins/dashboard').then((m) => ({ default: m.DashboardPlugin })),
  contacts: () => import('./plugins/contacts').then((m) => ({ default: m.ContactsPlugin })),
  'audit-logs': () => import('./plugins/audit-logs').then((m) => ({ default: m.AuditLogsPlugin })),
  'contact-graph': () =>
    import('./plugins/contact-graph').then((m) => ({ default: m.ContactGraphPlugin })),
  'google-import': () =>
    import('./plugins/google-import').then((m) => ({ default: m.GoogleImportPlugin })),
  groups: () => import('./plugins/groups').then((m) => ({ default: m.GroupsPlugin })),
  notifications: () =>
    import('./plugins/notifications').then((m) => ({ default: m.NotificationsPlugin })),
  sessions: () => import('./plugins/sessions').then((m) => ({ default: m.SessionsPlugin })),
  settings: () => import('./plugins/settings').then((m) => ({ default: m.SettingsPlugin })),
  'user-security': () =>
    import('./plugins/user-security').then((m) => ({ default: m.UserSecurityPlugin })),
}
