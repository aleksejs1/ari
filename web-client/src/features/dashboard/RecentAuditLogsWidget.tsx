import { useQuery } from '@tanstack/react-query'
import { History, User } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link, useNavigate } from 'react-router-dom'

import { getBadgeStyles, getContactId, getLogDescription } from '../audit-logs/utils'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { api } from '@/lib/axios'
import { formatLocalizedDateTime } from '@/lib/utils'
import { type TimelineEvent } from '@/types/models'

interface AuditLogCollection {
  member: TimelineEvent[]
  totalItems: number
}

export default function RecentAuditLogsWidget() {
  const { t, i18n } = useTranslation()
  const language = i18n.language
  const navigate = useNavigate()

  const { data: logsData, isLoading } = useQuery({
    queryKey: ['audit-logs', 1],
    queryFn: async () => {
      const res = await api.get<AuditLogCollection>(
        `/audit_logs?page=1&order%5BcreatedAt%5D=desc&itemsPerPage=10`,
      )
      return res.data
    },
  })

  const logs = logsData?.member || []

  return (
    <Card>
      <CardHeader>
        <Link to="/audit-logs" className="hover:opacity-80">
          <CardTitle className="flex items-center gap-2 text-base">
            <History className="h-5 w-5 text-blue-500" />
            {t('dashboard.recentAuditLogs')}
          </CardTitle>
        </Link>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="py-4 text-center text-sm text-gray-500">{t('common.loading')}</div>
        ) : null}
        {!isLoading && logs.length === 0 ? (
          <div className="py-4 text-center text-sm text-gray-500">{t('auditLogs.noLogs')}</div>
        ) : null}
        {!isLoading && logs.length > 0 ? (
          <div className="space-y-2">
            {logs.map((log) => {
              const contactId = getContactId(log)
              const isContactRelated = !!contactId

              return (
                <div
                  key={log.id}
                  className="flex items-center gap-2 rounded-md border border-gray-100 p-2 text-xs transition-colors hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-800/50"
                >
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500">
                        {formatLocalizedDateTime(log.createdAt, language)}
                      </span>
                      <span
                        className={`inline-flex items-center rounded px-1.5 py-0.5 font-semibold ${getBadgeStyles(log.action)}`}
                      >
                        {getLogDescription(log, t)}
                      </span>
                      {!isContactRelated && <span className="text-gray-400">#{log.id}</span>}
                    </div>
                  </div>
                  {!!isContactRelated && (
                    <div className="flex shrink-0 items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                        onClick={() => navigate(`/contacts/${contactId}`)}
                        title={t('common.viewDetails')}
                      >
                        <User className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                        onClick={() => navigate(`/contacts/${contactId}/timeline`)}
                        title={t('auditLogs.viewTimeline')}
                      >
                        <History className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        ) : null}
      </CardContent>
    </Card>
  )
}
