import { useQuery } from '@tanstack/react-query'
import { format } from 'date-fns'
import { Loader2, History } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { api } from '@/lib/axios'
import { type TimelineEvent } from '@/types/models'

// Reuse the formatter logic
const formatChangeValue = (val: unknown): string => {
  if (val === null || val === undefined) return ''

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
  <div className="p-6 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors">
    <div className="flex items-start justify-between">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-sm px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 uppercase tracking-wide">
            {log.action}
          </span>
          <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
            {log.entityType} #{log.entityId}
          </span>
          {log.user && <span className="text-sm text-gray-500">by {log.user}</span>}
        </div>
        <div className="text-sm text-gray-500">{format(new Date(log.createdAt), 'PPP p')}</div>
      </div>
    </div>

    {log.changes && Object.keys(log.changes).length > 0 && (
      <div className="mt-4 bg-gray-50 dark:bg-gray-900 rounded-md p-4 text-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {Object.entries(log.changes as Record<string, unknown>).map(([key, val]) => (
            <div key={key} className="break-all">
              <span className="font-semibold text-gray-700 dark:text-gray-300">{key}:</span>{' '}
              <span className="text-gray-600 dark:text-gray-400">{formatChangeValue(val)}</span>
            </div>
          ))}
        </div>
      </div>
    )}
  </div>
)

const LogList = ({
  logs,
  isPlaceholderData,
  t,
}: {
  logs: TimelineEvent[]
  isPlaceholderData: boolean
  t: (key: string, defaultValue?: string) => string
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
      const res = await api.get<AuditLogCollection>(`/audit_logs?page=${page}`)
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
          <History className="w-8 h-8 text-blue-500" />
          <h1 className="text-3xl font-bold tracking-tight">
            {t('auditLogs.title', 'Audit Logs')}
          </h1>
        </div>
        <div className="text-sm text-gray-500">
          {t('auditLogs.totalCount', 'Total items: {{count}}', { count: totalItems })}
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden flex flex-col min-h-[400px]">
        <div className="flex-1">
          <LogList logs={logs} isPlaceholderData={isPlaceholderData} t={t as any} />
        </div>

        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between bg-gray-50 dark:bg-gray-800/50">
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
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-700 transition-colors"
              >
                {t('pagination.previous', 'Previous')}
              </button>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages || isPlaceholderData}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-700 transition-colors"
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
