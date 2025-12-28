import { useQuery } from '@tanstack/react-query'
import { format } from 'date-fns'
import { Loader2, History } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { api } from '@/lib/axios'
import { type TimelineEvent } from '@/types/models'

// Reuse the formatter logic
const formatChangeValue = (val: unknown): string => {
  if (val === null || val === undefined) {
    return ''
  }

  if (typeof val === 'object') {
    if (Array.isArray(val)) {
      return val.map(formatChangeValue).join(' → ')
    }

    const valid = val as Record<string, unknown>
    if (valid.date && typeof valid.date === 'string') {
      try {
        return format(new Date(valid.date), 'PPP')
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

const LogItem = ({ log }: { log: TimelineEvent }) => (
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
          {log.user ? <span className="text-sm text-gray-500">by {log.user}</span> : null}
        </div>
        <div className="text-sm text-gray-500">{format(new Date(log.createdAt), 'PPP p')}</div>
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
                <span className="text-gray-600 dark:text-gray-400">{formatChangeValue(val)}</span>
              </div>
            ))}
        </div>
      </div>
    ) : null}

    {log.action === 'REMOVE' && log.snapshotBefore ? (
      <div className="mt-4">
        <div className="mb-1 text-xs font-semibold uppercase tracking-wider text-gray-500">
          Snapshot Before Removal
        </div>
        <div className="rounded-md border border-red-100 bg-red-50 p-4 text-sm dark:border-red-900/30 dark:bg-red-900/20">
          <div className="grid grid-cols-1 gap-x-4 gap-y-2 sm:grid-cols-2">
            {Object.entries(log.snapshotBefore)
              .filter(([key]) => key !== 'user' && key !== 'tenant')
              .map(([key, val]) => (
                <div key={key} className="break-all">
                  <span className="font-semibold text-red-800 dark:text-red-300">{key}:</span>{' '}
                  <span className="text-red-700 dark:text-red-400">{formatChangeValue(val)}</span>
                </div>
              ))}
          </div>
        </div>
      </div>
    ) : null}

    {log.action === 'INSERT' && log.snapshotAfter ? (
      <div className="mt-4">
        <div className="mb-1 text-xs font-semibold uppercase tracking-wider text-gray-500">
          Snapshot After Insertion
        </div>
        <div className="rounded-md border border-green-100 bg-green-50 p-4 text-sm dark:border-green-900/30 dark:bg-green-900/20">
          <div className="grid grid-cols-1 gap-x-4 gap-y-2 sm:grid-cols-2">
            {Object.entries(log.snapshotAfter)
              .filter(([key]) => key !== 'user' && key !== 'tenant')
              .map(([key, val]) => (
                <div key={key} className="break-all">
                  <span className="font-semibold text-green-800 dark:text-green-300">{key}:</span>{' '}
                  <span className="text-green-700 dark:text-green-400">
                    {formatChangeValue(val)}
                  </span>
                </div>
              ))}
          </div>
        </div>
      </div>
    ) : null}
  </div>
)

const LogList = ({
  logs,
  isPlaceholderData,
  t,
}: {
  logs: TimelineEvent[]
  isPlaceholderData: boolean
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  t: any
}) => {
  if (logs.length === 0) {
    return (
      <div className="p-12 text-center text-gray-500">
        {t('auditLogs.noLogs', 'No audit logs found')}
      </div>
    )
  }

  return (
    <div
      className={`divide-y divide-gray-200 dark:divide-gray-700 ${
        isPlaceholderData ? 'opacity-50' : ''
      }`}
    >
      {logs.map((log) => (
        <LogItem key={log.id} log={log} />
      ))}
    </div>
  )
}

export default function AuditLogsPage() {
  const { t } = useTranslation()
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
    return (
      <div className="p-12 text-center text-red-500">
        {t('errors.failedToLoadLogs', 'Failed to load audit logs')}
      </div>
    )
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
          <h1 className="text-3xl font-bold tracking-tight">
            {t('auditLogs.title', 'Audit Logs')}
          </h1>
        </div>
        <div className="text-sm text-gray-500">
          {t('auditLogs.totalCount', 'Total items: {{count}}', { count: totalItems })}
        </div>
      </div>

      <div className="flex min-h-[400px] flex-col overflow-hidden rounded-lg bg-white shadow dark:bg-gray-800">
        <div className="flex-1">
          <LogList logs={logs} isPlaceholderData={isPlaceholderData} t={t} />
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-gray-200 bg-gray-50 px-6 py-4 dark:border-gray-700 dark:bg-gray-800/50">
            <div className="text-sm text-gray-700 dark:text-gray-300">
              {t('pagination.pageInfo', 'Page {{current}} of {{total}}', {
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
                {t('pagination.previous', 'Previous')}
              </button>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages || isPlaceholderData}
                className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
              >
                {t('pagination.next', 'Next')}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
