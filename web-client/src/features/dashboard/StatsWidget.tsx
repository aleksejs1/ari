import { BarChart3, Users, ScrollText, Send } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { useStats } from './useStats'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export default function StatsWidget() {
  const { t } = useTranslation()
  const { data: stats, isLoading, isError } = useStats()

  if (isError) {
    return null
  }

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-base font-semibold">
          <BarChart3 className="h-5 w-5 text-indigo-500" />
          <span>{t('dashboard.stats')}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-8 w-12" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="flex flex-col">
              <span className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                <Users className="h-3.5 w-3.5" />
                {t('dashboard.totalContacts')}
              </span>
              <span className="mt-1 text-2xl font-bold tracking-tight">
                {stats?.totalContacts ?? 0}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                <ScrollText className="h-3.5 w-3.5" />
                {t('dashboard.totalAuditLogs')}
              </span>
              <span className="mt-1 text-2xl font-bold tracking-tight">
                {stats?.totalAuditLogs ?? 0}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                <Send className="h-3.5 w-3.5" />
                {t('dashboard.totalSentNotifications')}
              </span>
              <span className="mt-1 text-2xl font-bold tracking-tight">
                {stats?.totalSentNotifications ?? 0}
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
