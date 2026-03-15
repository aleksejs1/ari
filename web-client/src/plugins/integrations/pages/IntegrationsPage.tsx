import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { formatDistanceToNow } from 'date-fns'
import type { LucideIcon } from 'lucide-react'
import {
  AlertTriangle,
  Check,
  ChevronLeft,
  Copy,
  Key,
  Layers,
  Loader2,
  Pencil,
  Plus,
  Sparkles,
  Terminal,
  Trash2,
  Workflow,
  Zap,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { api } from '@/lib/axios'
import { FeatureGate } from '@/lib/entitlements'

interface ApiKey {
  id: string
  name: string
  scopes: string[]
  secretLastFour: string
  lastUsedAt: string | null
  lastUsedIp: string | null
  appType: string | null
  createdAt: string
}

interface ApiKeyCollection {
  member: ApiKey[]
  totalItems: number
}

interface AppTypeConfig {
  id: string
  label: string
  icon: LucideIcon
  defaultName: string
  defaultScopes: string[]
}

const APP_TYPES: AppTypeConfig[] = [
  {
    id: 'claude',
    label: 'Claude (Anthropic)',
    icon: Sparkles,
    defaultName: 'Claude Desktop',
    defaultScopes: ['contacts:read', 'contacts:write', 'groups:read'],
  },
  {
    id: 'zapier',
    label: 'Zapier',
    icon: Zap,
    defaultName: 'Zapier',
    defaultScopes: ['contacts:read', 'contacts:write'],
  },
  {
    id: 'n8n',
    label: 'n8n',
    icon: Workflow,
    defaultName: 'n8n',
    defaultScopes: ['contacts:read', 'contacts:write'],
  },
  {
    id: 'make',
    label: 'Make',
    icon: Layers,
    defaultName: 'Make',
    defaultScopes: ['contacts:read', 'contacts:write'],
  },
  {
    id: 'custom',
    label: 'Custom',
    icon: Terminal,
    defaultName: '',
    defaultScopes: ['*'],
  },
]

interface ScopeDefinition {
  value: string
  label: string
}

const ALL_SCOPES: ScopeDefinition[] = [
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

const ITEMS_PER_PAGE = 10

type CreateStep = null | 'choose' | 'configure' | 'token'

function getAppTypeConfig(appType: string | null): AppTypeConfig | undefined {
  return APP_TYPES.find((a) => a.id === appType)
}

function AppTypeIcon({ appType }: { appType: string | null }) {
  const config = getAppTypeConfig(appType)
  const Icon = config?.icon ?? Key
  return <Icon className="h-5 w-5" />
}

function ScopeCheckboxes({
  scopes,
  onChange,
  showFullAccess,
}: {
  scopes: string[]
  onChange: (scopes: string[]) => void
  showFullAccess: boolean
}) {
  const { t } = useTranslation()
  const isFullAccess = scopes.includes('*')

  const handleFullAccessCheck = () => {
    onChange(['*'])
  }

  const handleFullAccessUncheck = () => {
    onChange([])
  }

  const handleScopeCheck = (value: string) => {
    onChange([...scopes.filter((s) => s !== '*'), value])
  }

  const handleScopeUncheck = (value: string) => {
    onChange(scopes.filter((s) => s !== value && s !== '*'))
  }

  return (
    <div className="space-y-2">
      {showFullAccess ? (
        <label className="flex cursor-pointer items-center gap-2 rounded-md p-2 hover:bg-gray-50 dark:hover:bg-gray-800">
          <input
            type="checkbox"
            checked={isFullAccess}
            onChange={isFullAccess ? handleFullAccessUncheck : handleFullAccessCheck}
            className="h-4 w-4 rounded border-gray-300 accent-blue-600"
          />
          <span className="text-sm font-medium">{t('integrations.fullAccess')}</span>
        </label>
      ) : null}
      {ALL_SCOPES.map((scope) => (
        <label
          key={scope.value}
          className={`flex cursor-pointer items-center gap-2 rounded-md p-2 hover:bg-gray-50 dark:hover:bg-gray-800 ${isFullAccess && showFullAccess ? 'opacity-50' : ''}`}
        >
          <input
            type="checkbox"
            checked={isFullAccess ? true : scopes.includes(scope.value)}
            disabled={isFullAccess ? showFullAccess : false}
            onChange={
              scopes.includes(scope.value)
                ? () => handleScopeUncheck(scope.value)
                : () => handleScopeCheck(scope.value)
            }
            className="h-4 w-4 rounded border-gray-300 accent-blue-600"
          />
          <span className="text-sm">{t(scope.label)}</span>
        </label>
      ))}
    </div>
  )
}

function getScopeDisplay(scopes: string[], t: (key: string) => string): string {
  if (scopes.includes('*')) {
    return t('integrations.fullAccess')
  }
  return scopes
    .map((s) => {
      const def = ALL_SCOPES.find((d) => d.value === s)
      return def ? t(def.label) : s
    })
    .join(', ')
}

function KeyRow({
  apiKey,
  onEdit,
  onRevoke,
}: {
  apiKey: ApiKey
  onEdit: (key: ApiKey) => void
  onRevoke: (key: ApiKey) => void
}) {
  const { t } = useTranslation()

  const scopeDisplay = getScopeDisplay(apiKey.scopes, t)

  const lastUsedDisplay = apiKey.lastUsedAt
    ? t('integrations.lastUsed', {
        time: formatDistanceToNow(new Date(apiKey.lastUsedAt)),
      })
    : t('integrations.neverUsed')

  return (
    <div className="flex items-center gap-4 px-6 py-4">
      <div className="rounded-full bg-gray-100 p-2 dark:bg-gray-700">
        <AppTypeIcon appType={apiKey.appType} />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <span className="font-semibold">{apiKey.name}</span>
          <code className="rounded bg-gray-100 px-1.5 py-0.5 font-mono text-xs text-gray-600 dark:bg-gray-700 dark:text-gray-300">
            ari_...{apiKey.secretLastFour}
          </code>
        </div>
        <p className="mt-0.5 text-sm text-gray-500">{scopeDisplay}</p>
        <p className="text-xs text-gray-400">
          {lastUsedDisplay}
          {apiKey.lastUsedIp ? ` · ${apiKey.lastUsedIp}` : ''}
        </p>
      </div>
      <div className="flex shrink-0 gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onEdit(apiKey)}
          className="h-8 w-8 p-0"
          title={t('common.edit')}
        >
          <Pencil className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onRevoke(apiKey)}
          className="h-8 w-8 p-0 text-red-600 hover:bg-red-50 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-900/20"
          title={t('integrations.revoke')}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

function ClaudeHowTo({ token }: { token: string }) {
  const { t } = useTranslation()
  const [showHowTo, setShowHowTo] = useState(false)

  const claudeConfig = JSON.stringify(
    {
      mcpServers: {
        ari: {
          command: 'npx',
          args: ['-y', '@ari/mcp-server'],
          env: {
            ARI_API_URL: 'http://localhost:8000',
            ARI_API_KEY: token,
          },
        },
      },
    },
    null,
    2,
  )

  return (
    <div className="rounded-md border border-gray-200 dark:border-gray-700">
      <button
        onClick={() => setShowHowTo((v) => !v)}
        className="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-medium text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800"
      >
        {t('integrations.howToConnect')}
        <span className="text-xs text-gray-400">{showHowTo ? '▲' : '▼'}</span>
      </button>
      {showHowTo ? (
        <div className="border-t border-gray-200 px-4 py-3 dark:border-gray-700">
          <p className="mb-2 text-xs text-gray-500">{t('integrations.howToConnectDesc')}</p>
          <pre className="overflow-x-auto rounded bg-gray-900 p-3 text-xs text-gray-100">
            {claudeConfig}
          </pre>
        </div>
      ) : null}
    </div>
  )
}

function TokenDisplay({ token, appType }: { token: string; appType: string }) {
  const { t } = useTranslation()
  const inputRef = useRef<HTMLInputElement>(null)
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(token)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      inputRef.current?.select()
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input
          ref={inputRef}
          readOnly
          value={token}
          className="font-mono text-xs"
          onClick={() => inputRef.current?.select()}
        />
        <Button variant="outline" size="sm" onClick={handleCopy} className="shrink-0 gap-1.5">
          {copied ? (
            <>
              <Check className="h-4 w-4 text-green-500" />
              {t('integrations.tokenCopied')}
            </>
          ) : (
            <>
              <Copy className="h-4 w-4" />
              {t('integrations.tokenCopy')}
            </>
          )}
        </Button>
      </div>

      <div className="flex items-start gap-2 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 dark:border-amber-800 dark:bg-amber-900/20">
        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" />
        <p className="text-sm text-amber-800 dark:text-amber-300">
          {t('integrations.tokenWarning')}
        </p>
      </div>

      {appType === 'claude' ? <ClaudeHowTo token={token} /> : null}
    </div>
  )
}

function KeyListContent({
  keys,
  isLoading,
  isPlaceholderData,
  page,
  totalPages,
  onEdit,
  onRevoke,
  onPageChange,
}: {
  keys: ApiKey[]
  isLoading: boolean
  isPlaceholderData: boolean | undefined
  page: number
  totalPages: number
  onEdit: (key: ApiKey) => void
  onRevoke: (key: ApiKey) => void
  onPageChange: (page: number) => void
}) {
  const { t } = useTranslation()

  if (isLoading) {
    return (
      <div className="flex justify-center p-12">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    )
  }

  if (keys.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <Key className="mb-3 h-10 w-10 text-gray-300 dark:text-gray-600" />
          <p className="font-medium text-gray-600 dark:text-gray-300">{t('integrations.empty')}</p>
          <p className="mt-1 text-sm text-gray-400">{t('integrations.emptyDescription')}</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div
      className={`overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800 ${isPlaceholderData ? 'opacity-60' : ''}`}
    >
      <div className="divide-y divide-gray-100 dark:divide-gray-700">
        {keys.map((key) => (
          <KeyRow key={key.id} apiKey={key} onEdit={onEdit} onRevoke={onRevoke} />
        ))}
      </div>

      {totalPages > 1 ? (
        <div className="flex items-center justify-between border-t border-gray-200 bg-gray-50 px-6 py-4 dark:border-gray-700 dark:bg-gray-800/50">
          <span className="text-sm text-gray-500">
            {page} / {totalPages}
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => onPageChange(Math.max(1, page - 1))}
              disabled={page === 1 || Boolean(isPlaceholderData)}
              className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
            >
              ←
            </button>
            <button
              onClick={() => onPageChange(Math.min(totalPages, page + 1))}
              disabled={page === totalPages || Boolean(isPlaceholderData)}
              className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
            >
              →
            </button>
          </div>
        </div>
      ) : null}
    </div>
  )
}

function CreateDialog({
  createStep,
  selectedAppType,
  newKeyName,
  newKeyScopes,
  createdToken,
  createdAppType,
  isPending,
  onSelectAppType,
  onNameChange,
  onScopesChange,
  onCreate,
  onClose,
  onBack,
}: {
  createStep: CreateStep
  selectedAppType: AppTypeConfig | null
  newKeyName: string
  newKeyScopes: string[]
  createdToken: string | null
  createdAppType: string
  isPending: boolean
  onSelectAppType: (appType: AppTypeConfig) => void
  onNameChange: (name: string) => void
  onScopesChange: (scopes: string[]) => void
  onCreate: () => void
  onClose: () => void
  onBack: () => void
}) {
  const { t } = useTranslation()

  return (
    <>
      <Dialog open={createStep === 'choose'} onOpenChange={(open) => !open && onClose()}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{t('integrations.createTitle')}</DialogTitle>
            <DialogDescription>{t('integrations.description')}</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {APP_TYPES.map((appType) => {
              const Icon = appType.icon
              return (
                <button
                  key={appType.id}
                  onClick={() => onSelectAppType(appType)}
                  className="flex flex-col items-center gap-2 rounded-lg border border-gray-200 bg-white p-4 text-center transition-colors hover:border-blue-400 hover:bg-blue-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-blue-500 dark:hover:bg-blue-900/20"
                >
                  <Icon className="h-7 w-7 text-gray-600 dark:text-gray-300" />
                  <span className="text-sm font-medium">{appType.label}</span>
                </button>
              )
            })}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={createStep === 'configure'} onOpenChange={(open) => !open && onClose()}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              <button
                onClick={onBack}
                className="mr-2 inline-flex items-center gap-1 text-sm font-normal text-gray-500 hover:text-gray-700"
              >
                <ChevronLeft className="h-4 w-4" />
                {t('integrations.createTitle')}
              </button>
              <span className="block text-lg font-semibold">
                {t('integrations.createStepConfigure')}
              </span>
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="key-name">{t('integrations.nameLabel')}</Label>
              <Input
                id="key-name"
                value={newKeyName}
                onChange={(e) => onNameChange(e.target.value)}
                placeholder={t('integrations.namePlaceholder')}
              />
            </div>
            <div className="space-y-1.5">
              <Label>{t('integrations.scopesLabel')}</Label>
              <ScopeCheckboxes
                scopes={newKeyScopes}
                onChange={onScopesChange}
                showFullAccess={selectedAppType?.id === 'custom'}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={onClose}>
              {t('common.cancel')}
            </Button>
            <Button onClick={onCreate} disabled={!newKeyName.trim() || isPending} className="gap-2">
              {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              {t('integrations.createButton')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={createStep === 'token'} onOpenChange={(open) => !open && onClose()}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{t('integrations.createdTitle')}</DialogTitle>
            <DialogDescription>{t('integrations.createdSubtitle')}</DialogDescription>
          </DialogHeader>
          {createdToken !== null ? (
            <TokenDisplay token={createdToken} appType={createdAppType} />
          ) : null}
          <DialogFooter>
            <Button onClick={onClose}>{t('integrations.tokenDone')}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

function EditDialog({
  editingKey,
  editName,
  editScopes,
  isPending,
  onNameChange,
  onScopesChange,
  onSave,
  onClose,
}: {
  editingKey: ApiKey | null
  editName: string
  editScopes: string[]
  isPending: boolean
  onNameChange: (name: string) => void
  onScopesChange: (scopes: string[]) => void
  onSave: () => void
  onClose: () => void
}) {
  const { t } = useTranslation()

  return (
    <Dialog open={editingKey !== null} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{t('integrations.editTitle')}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="edit-key-name">{t('integrations.nameLabel')}</Label>
            <Input
              id="edit-key-name"
              value={editName}
              onChange={(e) => onNameChange(e.target.value)}
              placeholder={t('integrations.namePlaceholder')}
            />
          </div>
          <div className="space-y-1.5">
            <Label>{t('integrations.scopesLabel')}</Label>
            <ScopeCheckboxes scopes={editScopes} onChange={onScopesChange} showFullAccess />
          </div>
          <div className="rounded-md border border-blue-200 bg-blue-50 px-3 py-2 text-sm text-blue-800 dark:border-blue-800 dark:bg-blue-900/20 dark:text-blue-300">
            {t('integrations.editScopeBanner')}
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            {t('common.cancel')}
          </Button>
          <Button onClick={onSave} disabled={!editName.trim() || isPending} className="gap-2">
            {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            {t('integrations.save')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function DeleteDialog({
  deletingKey,
  isPending,
  onConfirm,
  onClose,
}: {
  deletingKey: ApiKey | null
  isPending: boolean
  onConfirm: () => void
  onClose: () => void
}) {
  const { t } = useTranslation()

  return (
    <Dialog open={deletingKey !== null} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{t('integrations.revokeTitle')}</DialogTitle>
          <DialogDescription>
            {t('integrations.revokeDescription', { name: deletingKey?.name ?? '' })}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            {t('common.cancel')}
          </Button>
          <Button variant="destructive" onClick={onConfirm} disabled={isPending} className="gap-2">
            {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            {t('integrations.revoke')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default function IntegrationsPage() {
  const { t } = useTranslation()
  const queryClient = useQueryClient()

  const [page, setPage] = useState(1)
  const [createStep, setCreateStep] = useState<CreateStep>(null)
  const [selectedAppType, setSelectedAppType] = useState<AppTypeConfig | null>(null)
  const [newKeyName, setNewKeyName] = useState('')
  const [newKeyScopes, setNewKeyScopes] = useState<string[]>([])
  const [createdToken, setCreatedToken] = useState<string | null>(null)
  const [createdAppType, setCreatedAppType] = useState<string>('')
  const [editingKey, setEditingKey] = useState<ApiKey | null>(null)
  const [editName, setEditName] = useState('')
  const [editScopes, setEditScopes] = useState<string[]>([])
  const [deletingKey, setDeletingKey] = useState<ApiKey | null>(null)

  const { data, isLoading, isPlaceholderData } = useQuery({
    queryKey: ['api-keys', page],
    queryFn: async () => {
      const res = await api.get<ApiKeyCollection>(
        `/api_keys?page=${page}&itemsPerPage=${ITEMS_PER_PAGE}`,
      )
      return res.data
    },
    placeholderData: (prev) => prev,
  })

  const keys = data?.member ?? []
  const totalItems = data?.totalItems ?? 0
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE)

  const invalidateKeys = () => {
    void queryClient.invalidateQueries({ queryKey: ['api-keys'] })
  }

  const createMutation = useMutation({
    mutationFn: async (payload: { name: string; scopes: string[]; appType: string }) => {
      const res = await api.post<ApiKey & { token: string }>('/api_keys', payload)
      return res.data
    },
    onSuccess: (result) => {
      setCreatedToken(result.token)
      setCreatedAppType(selectedAppType?.id ?? 'custom')
      setCreateStep('token')
      invalidateKeys()
    },
  })

  const updateMutation = useMutation({
    mutationFn: async (payload: { id: string; name: string; scopes: string[] }) => {
      const res = await api.patch<ApiKey>(
        `/api_keys/${payload.id}`,
        { name: payload.name, scopes: payload.scopes },
        { headers: { 'Content-Type': 'application/merge-patch+json' } },
      )
      return res.data
    },
    onSuccess: () => {
      setEditingKey(null)
      invalidateKeys()
    },
  })

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/api_keys/${id}`)
    },
    onSuccess: () => {
      setDeletingKey(null)
      invalidateKeys()
    },
  })

  const openCreate = () => {
    setSelectedAppType(null)
    setNewKeyName('')
    setNewKeyScopes([])
    setCreatedToken(null)
    setCreateStep('choose')
  }

  const handleSelectAppType = (appType: AppTypeConfig) => {
    setSelectedAppType(appType)
    setNewKeyName(appType.defaultName)
    setNewKeyScopes(appType.defaultScopes)
    setCreateStep('configure')
  }

  const handleCreate = () => {
    if (!newKeyName.trim() || !selectedAppType) {
      return
    }
    createMutation.mutate({
      name: newKeyName.trim(),
      scopes: newKeyScopes,
      appType: selectedAppType.id,
    })
  }

  const handleCreateClose = () => {
    setCreateStep(null)
    setCreatedToken(null)
    setCreatedAppType('')
  }

  const openEdit = (key: ApiKey) => {
    setEditingKey(key)
    setEditName(key.name)
    setEditScopes(key.scopes)
  }

  const handleSaveEdit = () => {
    if (!editingKey || !editName.trim()) {
      return
    }
    updateMutation.mutate({ id: editingKey.id, name: editName.trim(), scopes: editScopes })
  }

  const handleConfirmDelete = () => {
    if (!deletingKey) {
      return
    }
    deleteMutation.mutate(deletingKey.id)
  }

  return (
    <FeatureGate
      feature="api_keys"
      denied={
        <div className="rounded-lg border border-gray-200 bg-white p-8 text-center text-gray-500 dark:border-gray-700 dark:bg-gray-800">
          {t('integrations.deniedMessage')}
        </div>
      }
    >
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{t('integrations.title')}</h1>
            <p className="mt-1 text-sm text-gray-500">{t('integrations.description')}</p>
          </div>
          <Button onClick={openCreate} className="gap-2">
            <Plus className="h-4 w-4" />
            {t('integrations.connect')}
          </Button>
        </div>

        <KeyListContent
          keys={keys}
          isLoading={isLoading}
          isPlaceholderData={isPlaceholderData}
          page={page}
          totalPages={totalPages}
          onEdit={openEdit}
          onRevoke={setDeletingKey}
          onPageChange={setPage}
        />
      </div>

      <CreateDialog
        createStep={createStep}
        selectedAppType={selectedAppType}
        newKeyName={newKeyName}
        newKeyScopes={newKeyScopes}
        createdToken={createdToken}
        createdAppType={createdAppType}
        isPending={createMutation.isPending}
        onSelectAppType={handleSelectAppType}
        onNameChange={setNewKeyName}
        onScopesChange={setNewKeyScopes}
        onCreate={handleCreate}
        onClose={handleCreateClose}
        onBack={() => setCreateStep('choose')}
      />

      <EditDialog
        editingKey={editingKey}
        editName={editName}
        editScopes={editScopes}
        isPending={updateMutation.isPending}
        onNameChange={setEditName}
        onScopesChange={setEditScopes}
        onSave={handleSaveEdit}
        onClose={() => setEditingKey(null)}
      />

      <DeleteDialog
        deletingKey={deletingKey}
        isPending={deleteMutation.isPending}
        onConfirm={handleConfirmDelete}
        onClose={() => setDeletingKey(null)}
      />
    </FeatureGate>
  )
}
