import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { LogIn, Monitor, Smartphone } from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { api } from '@/lib/axios'
import { queryKeys } from '@/lib/queryKeys'
import { formatLocalizedDateTime } from '@/lib/utils'

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

export default function RecentLoginsWidget() {
  const { t, i18n } = useTranslation()
  const language = i18n.language

  const { data, isLoading } = useQuery({
    queryKey: queryKeys.loginHistory.widget,
    queryFn: async () => {
      const res = await api.get<LoginHistoryCollection>('/auth_history?page=1&itemsPerPage=5')
      return res.data
    },
  })

  const logins = data?.member || []

  const getDeviceIcon = (userAgent: string | null) => {
    if (userAgent && /mobile/i.test(userAgent)) {
      return <Smartphone className="h-4 w-4 text-gray-400" />
    }
    return <Monitor className="h-4 w-4 text-gray-400" />
  }

  return (
    <Card>
      <CardHeader>
        <Link to="/login-history" className="hover:opacity-80">
          <CardTitle className="flex items-center gap-2 text-base">
            <LogIn className="h-5 w-5 text-green-500" />
            {t('dashboard.recentLogins', 'Recent Logins')}
          </CardTitle>
        </Link>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="py-4 text-center text-sm text-gray-500">{t('common.loading')}</div>
        ) : null}
        {!isLoading && logins.length === 0 ? (
          <div className="py-4 text-center text-sm text-gray-500">
            {t('loginHistory.noLogins', 'No login records found')}
          </div>
        ) : null}
        {!isLoading && logins.length > 0 ? (
          <div className="space-y-2">
            {logins.map((login) => (
              <div
                key={login.id}
                className="flex items-center gap-2 rounded-md border border-gray-100 p-2 text-xs transition-colors hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-800/50"
              >
                {getDeviceIcon(login.userAgent)}
                <div className="min-w-0 flex-1 space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{login.ipAddress || t('common.unknown')}</span>
                    <span className="text-gray-500">
                      {formatLocalizedDateTime(login.createdAt, language)}
                    </span>
                  </div>
                  {login.userAgent ? (
                    <div className="truncate text-gray-400" title={login.userAgent}>
                      {login.userAgent}
                    </div>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        ) : null}
      </CardContent>
    </Card>
  )
}
