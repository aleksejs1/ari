import { useQuery } from '@tanstack/react-query'
import { type TFunction } from 'i18next'
import { Loader2, History } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { api } from '@/lib/axios'
import { formatLocalizedDate, formatLocalizedDateTime } from '@/lib/utils'
import { type TimelineEvent } from '@/types/models'

// Helper to format change values, handling nested objects.
const formatChangeValue = (val: unknown, language: string): string => {
  if (val === null || val === undefined) {
    return ''
  }

  if (typeof val === 'object') {
    if (Array.isArray(val)) {
      return val.map((v) => formatChangeValue(v, language)).join(' → ')
    }

    const valid = val as Record<string, unknown>
    if (valid.date && typeof valid.date === 'string') {
      try {
        return formatLocalizedDate(valid.date, language)
      } catch {
        return valid.date
      }
    }

    return JSON.stringify(val)
  }

  return String(val)
}

interface AuditLogCollection {
  member: TimelineEvent[]
  totalItems: number
}

const LogItem = ({ log, language }: { log: TimelineEvent; language: string }) => {
  const { t } = useTranslation()
  return (
    <div className="dark:hover:bg-gray-750 p-6 transition-colors hover:bg-gray-50">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="rounded bg-gray-100 px-2 py-0.5 text-sm font-semibold uppercase tracking-wide text-gray-700 dark:bg-gray-700 dark:text-gray-300">
              {log.action}
            </span>
            <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
              {log.entityType} #{log.entityId}
            </span>
            {log.user ? (
              <span className="text-sm text-gray-500">
                {t('common.by', 'by')} {log.user}
              </span>
            ) : null}
          </div>
          <div className="text-sm text-gray-500">
            {formatLocalizedDateTime(log.createdAt, language)}
          </div>
        </div>
      </div>

      {log.changes && Object.keys(log.changes).length > 0 ? (
        <div className="mt-4 rounded-md bg-gray-50 p-4 text-sm dark:bg-gray-900">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {Object.entries(log.changes as Record<string, unknown>)
              .filter(([key]) => key !== 'user' && key !== 'tenant')
              .map(([key, val]) => (
                <div key={key} className="break-all">
                  <span className="font-semibold text-gray-700 dark:text-gray-300">{key}:</span>{' '}
                  <span className="text-gray-600 dark:text-gray-400">
                    {formatChangeValue(val, language)}
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
              {Object.entries(log.snapshotBefore)
                .filter(([key]) => key !== 'user' && key !== 'tenant')
                .map(([key, val]) => (
                  <div key={key} className="break-all">
                    <span className="font-semibold text-red-800 dark:text-red-300">{key}:</span>{' '}
                    <span className="text-red-700 dark:text-red-400">
                      {formatChangeValue(val, language)}
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
              {Object.entries(log.snapshotAfter)
                .filter(([key]) => key !== 'user' && key !== 'tenant')
                .map(([key, val]) => (
                  <div key={key} className="break-all">
                    <span className="font-semibold text-green-800 dark:text-green-300">{key}:</span>{' '}
                    <span className="text-green-700 dark:text-green-400">
                      {formatChangeValue(val, language)}
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

const LogList = ({
  logs,
  isPlaceholderData,
  t,
  language,
}: {
  logs: TimelineEvent[]
  isPlaceholderData: boolean
  t: TFunction
  language: string
}) => {
  if (logs.length === 0) {
    return <div className="p-12 text-center text-gray-500">{t('auditLogs.noLogs')}</div>
  }

  return (
    <div
      className={`divide-y divide-gray-200 dark:divide-gray-700 ${
        isPlaceholderData ? 'opacity-50' : ''
      }`}
    >
      {logs.map((log) => (
        <LogItem key={log.id} log={log} language={language} />
      ))}
    </div>
  )
}

export default function AuditLogsPage() {
  const { t, i18n } = useTranslation()
  const language = i18n.language
  const [page, setPage] = useState(1)

  const {
    data: logsData,
    isLoading,
    isPlaceholderData,
    error,
  } = useQuery({
    queryKey: ['audit-logs', page],
    queryFn: async () => {
      const res = await api.get<AuditLogCollection>(
        `/audit_logs?page=${page}&order%5BcreatedAt%5D=desc`,
      )
      return res.data
    },
    placeholderData: (previousData) => previousData,
  })

  if (isLoading) {
    return (
      <div className="flex justify-center p-12">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    )
  }

  if (error) {
    return <div className="p-12 text-center text-red-500">{t('errors.failedToLoadLogs')}</div>
  }

  const logs = logsData?.member || []
  const totalItems = logsData?.totalItems || 0
  const ITEMS_PER_PAGE = 30
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <History className="h-8 w-8 text-blue-500" />
          <h1 className="text-3xl font-bold tracking-tight">{t('auditLogs.title')}</h1>
        </div>
        <div className="text-sm text-gray-500">
          {t('auditLogs.totalCount', { count: totalItems })}
        </div>
      </div>

      <div className="flex min-h-[400px] flex-col overflow-hidden rounded-lg bg-white shadow dark:bg-gray-800">
        <div className="flex-1">
          <LogList logs={logs} isPlaceholderData={isPlaceholderData} t={t} language={language} />
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-gray-200 bg-gray-50 px-6 py-4 dark:border-gray-700 dark:bg-gray-800/50">
            <div className="text-sm text-gray-700 dark:text-gray-300">
              {t('pagination.pageInfo', {
                current: page,
                total: totalPages,
              })}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1 || isPlaceholderData}
                className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
              >
                {t('pagination.previous')}
              </button>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages || isPlaceholderData}
                className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
              >
                {t('pagination.next')}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
