import type { LucideIcon } from 'lucide-react'
import { Layers, Sparkles, Terminal, Workflow, Zap } from 'lucide-react'

export type AppTypeId = 'claude' | 'zapier' | 'n8n' | 'make' | 'custom'

export interface AppTypeConfig {
  id: AppTypeId
  labelKey: string
  icon: LucideIcon
  defaultName: string
  defaultScopes: string[]
}

export interface ScopeDefinition {
  value: string
  label: string
}

export const APP_TYPES: AppTypeConfig[] = [
  {
    id: 'claude',
    labelKey: 'integrations.appType.claude',
    icon: Sparkles,
    defaultName: 'Claude Desktop',
    defaultScopes: ['contacts:read', 'contacts:write', 'groups:read'],
  },
  {
    id: 'zapier',
    labelKey: 'integrations.appType.zapier',
    icon: Zap,
    defaultName: 'Zapier',
    defaultScopes: ['contacts:read', 'contacts:write'],
  },
  {
    id: 'n8n',
    labelKey: 'integrations.appType.n8n',
    icon: Workflow,
    defaultName: 'n8n',
    defaultScopes: ['contacts:read', 'contacts:write'],
  },
  {
    id: 'make',
    labelKey: 'integrations.appType.make',
    icon: Layers,
    defaultName: 'Make',
    defaultScopes: ['contacts:read', 'contacts:write'],
  },
  {
    id: 'custom',
    labelKey: 'integrations.appType.custom',
    icon: Terminal,
    defaultName: '',
    // Start with no scopes — user must explicitly choose (principle of least privilege)
    defaultScopes: [],
  },
]

export const ALL_SCOPES: ScopeDefinition[] = [
  { value: 'contacts:read', label: 'integrations.scope.contactsRead' },
  { value: 'contacts:write', label: 'integrations.scope.contactsWrite' },
  { value: 'contacts:delete', label: 'integrations.scope.contactsDelete' },
  { value: 'groups:read', label: 'integrations.scope.groupsRead' },
  { value: 'groups:write', label: 'integrations.scope.groupsWrite' },
  { value: 'groups:delete', label: 'integrations.scope.groupsDelete' },
  { value: 'audit_logs:read', label: 'integrations.scope.auditLogsRead' },
  { value: 'ai_suggestions:read', label: 'integrations.scope.aiSuggestionsRead' },
  { value: 'ai_suggestions:write', label: 'integrations.scope.aiSuggestionsWrite' },
]

export const ITEMS_PER_PAGE = 10
