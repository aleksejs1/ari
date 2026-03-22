import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useQuery } from '@tanstack/react-query'
import { History, Loader2 } from 'lucide-react'

import { api } from '@/lib/axios'
import { queryKeys } from '@/lib/queryKeys'
import { type TimelineEvent } from '@/types/models'

import { LogList } from '../components/LogList'

interface AuditLogCollection {
  member: TimelineEvent[]
  totalItems: number
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
    queryKey: queryKeys.auditLogs.list(page),
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

      <div
        className="flex min-h-[400px] flex-col overflow-hidden rounded-lg bg-white shadow dark:bg-gray-800"
        data-testid="audit-logs-list"
      >
        <div className="flex-1">
          <LogList logs={logs} isPlaceholderData={isPlaceholderData} language={language} />
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
