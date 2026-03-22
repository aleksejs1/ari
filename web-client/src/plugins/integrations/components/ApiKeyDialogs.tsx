import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { AlertTriangle, Check, ChevronLeft, Copy, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
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
import { API_ORIGIN } from '@/lib/axios'

import type { AppTypeConfig } from '../constants'
import { ALL_SCOPES, APP_TYPES } from '../constants'
import type { ApiKey } from '../hooks/useApiKeys'

export type CreateStep = null | 'choose' | 'configure' | 'token'

export function ScopeCheckboxes({
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
    if (isFullAccess) {
      // Expand wildcard to all explicit scopes, then remove the unchecked one.
      // Without this, unchecking any scope while * is active would silently zero out permissions.
      onChange(ALL_SCOPES.map((s) => s.value).filter((v) => v !== value))
    } else {
      onChange(scopes.filter((s) => s !== value))
    }
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

function ClaudeHowTo({ token }: { token: string }) {
  const { t } = useTranslation()
  const [showHowTo, setShowHowTo] = useState(false)

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
          {/* claudeConfig computed here (not at component mount) to avoid holding token in memory when collapsed */}
          <pre className="overflow-x-auto rounded bg-gray-900 p-3 text-xs text-gray-100">
            {JSON.stringify(
              {
                mcpServers: {
                  ari: {
                    command: 'npx',
                    args: ['-y', '@ari/mcp-server'],
                    env: {
                      // API_ORIGIN is '' in production (same origin); fall back to actual origin
                      ARI_API_URL: API_ORIGIN || window.location.origin,
                      ARI_API_KEY: token,
                    },
                  },
                },
              },
              null,
              2,
            )}
          </pre>
        </div>
      ) : null}
    </div>
  )
}

export function TokenDisplay({ token, appType }: { token: string; appType: string }) {
  const { t } = useTranslation()
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(token)
      setCopied(true)
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      timeoutRef.current = setTimeout(() => setCopied(false), 2000)
    } catch {
      // Clipboard API unavailable — warn the user so they can manually copy before closing
      toast.error('Could not copy to clipboard. Please copy the key manually before closing.')
    }
  }

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {/* Use a <code> block instead of <input> to avoid password manager indexing */}
        <code className="min-w-0 flex-1 select-all overflow-x-auto rounded-md border bg-muted px-3 py-2 font-mono text-xs">
          {token}
        </code>
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

export function CreateDialog({
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
                  <span className="text-sm font-medium">{t(appType.labelKey)}</span>
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

export function EditDialog({
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
            <ScopeCheckboxes
              scopes={editScopes}
              onChange={onScopesChange}
              showFullAccess={!editingKey?.appType || editingKey.appType === 'custom'}
            />
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

export function DeleteDialog({
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
