import { AlertTriangle } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { Card, CardContent } from '@/components/ui/card'
import { widgetRegistry } from '@/lib/widgets/WidgetRegistry'

interface DynamicDashboardProps {
  layout: string[]
}

export default function DynamicDashboard({ layout }: DynamicDashboardProps) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-12">
      {layout.map((widgetId, index) => {
        const widgetDef = widgetRegistry.get(widgetId)

        if (!widgetDef) {
          return (
            <div key={widgetId} className="col-span-12">
              <FallbackWidget id={widgetId} />
            </div>
          )
        }

        const WidgetComponent = widgetDef.component
        const { w } = widgetDef.defaultDimensions
        const colSpanClass = getColSpanClass(w)

        return (
          <div key={`${widgetId}-${index}`} className={`col-span-12 ${colSpanClass}`}>
            <WidgetComponent />
          </div>
        )
      })}
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

function getColSpanClass(width: number): string {
  // Map width 1-12 to Tailwind classes.
  // We use md:col-span-x to ensure on mobile (grid-cols-1) they just flow naturally
  // or we can use col-span-x if we trust grid-cols-1 to handle it.
  // However, explicit `md:` is safer to ensure mobile stack
  // even if we mess up the parent grid.
  // If we use `md:col-span-x`, then on mobile they have no class, so default col-span-1.
  // In grid-cols-1, col-span-1 is full width. This is correct.

  const safeWidth = Math.min(Math.max(width, 1), 12)
  return `md:col-span-${safeWidth}`
}
