import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useQuery } from '@tanstack/react-query'
import { format } from 'date-fns'
import { Loader2, LogIn, Monitor, Smartphone } from 'lucide-react'

import { api } from '@/lib/axios'

interface LoginHistoryEntry {
  id: number
  ipAddress: string | null
  userAgent: string | null
  createdAt: string
}

interface LoginHistoryCollection {
  member: LoginHistoryEntry[]
  totalItems: number
}

const ITEMS_PER_PAGE = 30

function DeviceIcon({ userAgent }: { userAgent: string | null }) {
  if (userAgent && /mobile/i.test(userAgent)) {
    return <Smartphone className="h-5 w-5" />
  }
  return <Monitor className="h-5 w-5" />
}

function LoginRow({ login }: { login: LoginHistoryEntry }) {
  const { t } = useTranslation()

  return (
    <div className="flex items-center gap-4 px-6 py-4">
      <div className="rounded-full bg-gray-100 p-2 dark:bg-gray-700">
        <DeviceIcon userAgent={login.userAgent} />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="font-medium">{login.ipAddress || t('common.unknown', 'Unknown')}</span>
          <span className="text-sm text-gray-400">{format(new Date(login.createdAt), 'PPpp')}</span>
        </div>
        <p className="truncate text-sm text-gray-500" title={login.userAgent || undefined}>
          {login.userAgent || t('common.unknown', 'Unknown')}
        </p>
      </div>
    </div>
  )
}

function Pagination({
  page,
  totalPages,
  isPlaceholderData,
  onPageChange,
}: {
  page: number
  totalPages: number
  isPlaceholderData: boolean
  onPageChange: (page: number) => void
}) {
  const { t } = useTranslation()

  if (totalPages <= 1) {
    return null
  }

  return (
    <div className="flex items-center justify-between border-t border-gray-200 bg-gray-50 px-6 py-4 dark:border-gray-700 dark:bg-gray-800/50">
      <div className="text-sm text-gray-700 dark:text-gray-300">
        {t('pagination.pageInfo', { current: page, total: totalPages })}
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => onPageChange(Math.max(1, page - 1))}
          disabled={page === 1 || isPlaceholderData}
          className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
        >
          {t('pagination.previous')}
        </button>
        <button
          onClick={() => onPageChange(Math.min(totalPages, page + 1))}
          disabled={page === totalPages || isPlaceholderData}
          className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
        >
          {t('pagination.next')}
        </button>
      </div>
    </div>
  )
}

export default function LoginHistoryPage() {
  const { t } = useTranslation()
  const [page, setPage] = useState(1)

  const {
    data: loginsData,
    isLoading,
    isPlaceholderData,
  } = useQuery({
    queryKey: ['login-history', page],
    queryFn: async () => {
      const res = await api.get<LoginHistoryCollection>(
        `/auth_history?page=${page}&itemsPerPage=${ITEMS_PER_PAGE}`,
      )
      return res.data
    },
    placeholderData: (previousData) => previousData,
  })

  const logins = loginsData?.member || []
  const totalItems = loginsData?.totalItems || 0
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE)

  if (isLoading) {
    return (
      <div className="flex justify-center p-12">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <LogIn className="h-8 w-8 text-green-500" />
          <h1 className="text-3xl font-bold tracking-tight">
            {t('loginHistory.title', 'Login History')}
          </h1>
        </div>
        <div className="text-sm text-gray-500">
          {t('auditLogs.totalCount', { count: totalItems })}
        </div>
      </div>

      <div
        className="flex min-h-[400px] flex-col overflow-hidden rounded-lg bg-white shadow dark:bg-gray-800"
        data-testid="login-history-list"
      >
        <div className="flex-1">
          {logins.length === 0 ? (
            <div className="flex h-full items-center justify-center p-12">
              <p className="text-gray-500">
                {t('loginHistory.noLogins', 'No login records found')}
              </p>
            </div>
          ) : (
            <div
              className={`space-y-0 divide-y divide-gray-100 dark:divide-gray-700 ${isPlaceholderData ? 'opacity-60' : ''}`}
            >
              {logins.map((login) => (
                <LoginRow key={login.id} login={login} />
              ))}
            </div>
          )}
        </div>

        <Pagination
          page={page}
          totalPages={totalPages}
          isPlaceholderData={isPlaceholderData ?? false}
          onPageChange={setPage}
        />
      </div>
    </div>
  )
}
