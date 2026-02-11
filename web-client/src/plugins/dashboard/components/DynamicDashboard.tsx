import { useTranslation } from 'react-i18next'
import { AlertTriangle } from 'lucide-react'

import { Card, CardContent } from '@/components/ui/card'
import { widgetRegistry } from '@/lib/widgets/WidgetRegistry'

interface DynamicDashboardProps {
  zones: Record<string, string[]>
}

function WidgetRenderer({ id }: { id: string }) {
  const def = widgetRegistry.get(id)
  if (!def) {
    return <FallbackWidget id={id} />
  }
  return <def.component />
}

function ZoneWidgets({ ids }: { ids: string[] }) {
  return (
    <>
      {ids.map((id) => (
        <WidgetRenderer key={id} id={id} />
      ))}
    </>
  )
}

export default function DynamicDashboard({ zones }: DynamicDashboardProps) {
  const fullIds = zones.full || []
  const leftIds = zones.left || []
  const rightIds = zones.right || []

  const hasColumns = leftIds.length > 0 || rightIds.length > 0

  return (
    <div className="space-y-4">
      {fullIds.length > 0 ? <ZoneWidgets ids={fullIds} /> : null}

      {hasColumns ? (
        <div className="flex flex-col gap-4 md:flex-row">
          {leftIds.length > 0 ? (
            <div className="flex flex-1 flex-col gap-4 md:basis-7/12">
              <ZoneWidgets ids={leftIds} />
            </div>
          ) : null}
          {rightIds.length > 0 ? (
            <div className="flex flex-1 flex-col gap-4 md:basis-5/12">
              <ZoneWidgets ids={rightIds} />
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  )
}

function FallbackWidget({ id }: { id: string }) {
  const { t } = useTranslation()
  return (
    <Card className="border-dashed border-yellow-400 bg-yellow-50 dark:bg-yellow-900/10">
      <CardContent className="flex items-center gap-2 p-4 text-yellow-600 dark:text-yellow-400">
        <AlertTriangle className="h-5 w-5" />
        <span className="font-medium">
          {t('dashboard.widgetNotFound', { defaultValue: 'Widget not found' })}: {id}
        </span>
      </CardContent>
    </Card>
  )
}
