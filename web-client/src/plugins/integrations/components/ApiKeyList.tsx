import { useTranslation } from 'react-i18next'
import { ChevronLeft, ChevronRight, Key, Loader2 } from 'lucide-react'

import { Card, CardContent } from '@/components/ui/card'

import type { ApiKey } from '../hooks/useApiKeys'

import { KeyRow } from './ApiKeyRow'

export function KeyListContent({
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
              aria-label={t('common.previousPage')}
              className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => onPageChange(Math.min(totalPages, page + 1))}
              disabled={page === totalPages || Boolean(isPlaceholderData)}
              aria-label={t('common.nextPage')}
              className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      ) : null}
    </div>
  )
}
