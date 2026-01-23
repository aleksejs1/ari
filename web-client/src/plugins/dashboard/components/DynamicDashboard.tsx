import { useTranslation } from 'react-i18next'
import { AlertTriangle } from 'lucide-react'

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
  const safeWidth = Math.min(Math.max(width, 1), 12)
  const spanMap: Record<number, string> = {
    1: 'md:col-span-1',
    2: 'md:col-span-2',
    3: 'md:col-span-3',
    4: 'md:col-span-4',
    5: 'md:col-span-5',
    6: 'md:col-span-6',
    7: 'md:col-span-7',
    8: 'md:col-span-8',
    9: 'md:col-span-9',
    10: 'md:col-span-10',
    11: 'md:col-span-11',
    12: 'md:col-span-12',
  }
  return spanMap[safeWidth] || 'md:col-span-6'
}
