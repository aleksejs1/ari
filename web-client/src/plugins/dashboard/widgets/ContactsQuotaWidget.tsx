import { useTranslation } from 'react-i18next'
import { Users } from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useEntitlements, useUpgradeModal } from '@/lib/entitlements'
import { cn } from '@/lib/utils'

const QUOTA_THRESHOLDS = { warning: 0.75, danger: 0.9 } as const

export default function ContactsQuotaWidget() {
  const { t } = useTranslation()
  const { data } = useEntitlements()
  const { openUpgradeModal } = useUpgradeModal()

  const quota = data?.quotas['contacts']

  if (!quota || quota.isUnlimited) {
    return null
  }

  const limit = quota.limit ?? 0
  const pct = limit > 0 ? quota.used / limit : 0
  const fillPct = Math.min(pct * 100, 100)

  let barColor = 'bg-green-500'
  if (pct >= QUOTA_THRESHOLDS.danger) {
    barColor = 'bg-red-500'
  } else if (pct >= QUOTA_THRESHOLDS.warning) {
    barColor = 'bg-yellow-500'
  }

  return (
    <Card
      className="cursor-pointer transition-colors hover:bg-accent/50"
      onClick={() => openUpgradeModal('contacts')}
    >
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-base font-semibold">
          <Users className="h-5 w-5 text-indigo-500" />
          <span>{t('dashboard.quota.contacts')}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
          <div
            className={cn('h-2 rounded-full transition-all', barColor)}
            style={{ width: `${fillPct}%` }}
          />
        </div>
        <p className="text-sm text-muted-foreground">
          {t('dashboard.quota.used', { used: quota.used, limit })}
        </p>
        <p className="text-xs text-muted-foreground">{t('dashboard.quota.clickToUpgrade')}</p>
      </CardContent>
    </Card>
  )
}
