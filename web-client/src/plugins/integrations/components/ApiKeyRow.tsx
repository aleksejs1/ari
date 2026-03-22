import { useTranslation } from 'react-i18next'
import { formatDistanceToNow, isValid, parseISO } from 'date-fns'
import { Key, Pencil, Trash2 } from 'lucide-react'

import { Button } from '@/components/ui/button'

import { APP_TYPES } from '../constants'
import type { ApiKey } from '../hooks/useApiKeys'
import { getScopeDisplay } from '../utils'

function getAppTypeConfig(appType: string | null) {
  return APP_TYPES.find((a) => a.id === appType)
}

export function AppTypeIcon({ appType }: { appType: string | null }) {
  const config = getAppTypeConfig(appType)
  const Icon = config?.icon ?? Key
  return <Icon className="h-5 w-5" />
}

export function KeyRow({
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

  const lastUsedDisplay = (() => {
    if (!apiKey.lastUsedAt) {
      return t('integrations.neverUsed')
    }
    const date = parseISO(apiKey.lastUsedAt)
    if (!isValid(date)) {
      return t('integrations.neverUsed')
    }
    return t('integrations.lastUsed', { time: formatDistanceToNow(date) })
  })()

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
