import { useTranslation } from 'react-i18next'
import { Sparkles } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

import { useMarkAsRead, usePendingSeasonalCheckin } from '@/features/activity-feed/useNotifications'

export default function SeasonalCheckinWidget() {
  const { t } = useTranslation()
  const { data: checkin } = usePendingSeasonalCheckin()
  const { mutate: markAsRead } = useMarkAsRead()

  if (!checkin) {
    return null
  }

  const handleDismiss = () => {
    if (checkin.id !== undefined) {
      markAsRead(checkin.id)
    }
  }

  return (
    <Card data-testid="seasonal-checkin-banner" className="border-primary/20 bg-primary/5">
      <CardContent className="flex items-center justify-between gap-4 py-4">
        <div className="flex items-center gap-3">
          <Sparkles className="h-5 w-5 shrink-0 text-primary" />
          <div>
            <p className="text-sm font-medium">{t('dashboard.seasonalCheckin.title')}</p>
            <p className="text-xs text-muted-foreground">{t('dashboard.seasonalCheckin.body')}</p>
          </div>
        </div>
        <Button size="sm" variant="ghost" onClick={handleDismiss}>
          {t('dashboard.seasonalCheckin.dismiss')}
        </Button>
      </CardContent>
    </Card>
  )
}
