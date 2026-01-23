import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { History, User } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { formatLocalizedDateTime } from '@/lib/utils'
import { type TimelineEvent } from '@/types/models'

import { formatChangeValue, getBadgeStyles, getContactId, getLogDescription } from '../utils'

interface LogItemProps {
  log: TimelineEvent
  language: string
}

export const LogItem = ({ log, language }: LogItemProps) => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const contactId = getContactId(log)
  const isContactRelated = !!contactId

  const filterFields = (obj: Record<string, unknown> | null | undefined) => {
    if (!obj) {
      return []
    }
    return Object.entries(obj).filter(
      ([key]) => !['id', '@id', '@type', 'user', 'tenant'].includes(key),
    )
  }

  return (
    <div className="dark:hover:bg-gray-750 p-6 transition-colors hover:bg-gray-50">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1 space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`inline-flex items-center rounded px-2 py-0.5 text-xs font-semibold leading-5 ${getBadgeStyles(
                log.action,
              )}`}
            >
              {getLogDescription(log, t)}
            </span>
            {!isContactRelated ? (
              <span className="text-xs text-gray-400">#{log.entityId}</span>
            ) : null}
          </div>
          <div className="text-sm text-gray-500">
            {formatLocalizedDateTime(log.createdAt, language)}
          </div>
        </div>

        {isContactRelated ? (
          <div className="flex shrink-0 items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="h-8 gap-1.5"
              onClick={() => navigate(`/contacts/${contactId}`)}
            >
              <User className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">{t('common.viewDetails')}</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 gap-1.5 text-gray-500 hover:text-blue-600"
              onClick={() => navigate(`/contacts/${contactId}/timeline`)}
              title={t('auditLogs.viewTimeline')}
            >
              <History className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">{t('auditLogs.timeline')}</span>
            </Button>
          </div>
        ) : null}
      </div>

      {log.changes && filterFields(log.changes as Record<string, unknown>).length > 0 ? (
        <div className="mt-4 rounded-md bg-gray-50 p-4 text-sm dark:bg-gray-900">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {filterFields(log.changes as Record<string, unknown>).map(([key, val]) => (
              <div key={key} className="break-all">
                <span className="font-semibold text-gray-700 dark:text-gray-300">{key}:</span>{' '}
                <span className="text-gray-600 dark:text-gray-400">
                  {formatChangeValue(val, language, key)}
                </span>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {log.action === 'REMOVE' && log.snapshotBefore ? (
        <div className="mt-4">
          <div className="mb-1 text-xs font-semibold uppercase tracking-wider text-gray-500">
            {t('auditLogs.snapshotBeforeRemoval')}
          </div>
          <div className="rounded-md border border-red-100 bg-red-50 p-4 text-sm dark:border-red-900/30 dark:bg-red-900/20">
            <div className="grid grid-cols-1 gap-x-4 gap-y-2 sm:grid-cols-2">
              {filterFields(log.snapshotBefore).map(([key, val]) => (
                <div key={key} className="break-all">
                  <span className="font-semibold text-red-800 dark:text-red-300">{key}:</span>{' '}
                  <span className="text-red-700 dark:text-red-400">
                    {formatChangeValue(val, language, key)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : null}

      {log.action === 'INSERT' && log.snapshotAfter ? (
        <div className="mt-4">
          <div className="mb-1 text-xs font-semibold uppercase tracking-wider text-gray-500">
            {t('auditLogs.snapshotAfterInsertion')}
          </div>
          <div className="rounded-md border border-green-100 bg-green-50 p-4 text-sm dark:border-green-900/30 dark:bg-green-900/20">
            <div className="grid grid-cols-1 gap-x-4 gap-y-2 sm:grid-cols-2">
              {filterFields(log.snapshotAfter).map(([key, val]) => (
                <div key={key} className="break-all">
                  <span className="font-semibold text-green-800 dark:text-green-300">{key}:</span>{' '}
                  <span className="text-green-700 dark:text-green-400">
                    {formatChangeValue(val, language, key)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}
