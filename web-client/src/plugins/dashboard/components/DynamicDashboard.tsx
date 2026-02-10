import { useTranslation } from 'react-i18next'
import { AlertTriangle } from 'lucide-react'

import { Card, CardContent } from '@/components/ui/card'
import { widgetRegistry } from '@/lib/widgets/WidgetRegistry'

interface DynamicDashboardProps {
  layout: string[]
}

export default function DynamicDashboard({ layout }: DynamicDashboardProps) {
  const widgets = layout.map((id) => ({ id, def: widgetRegistry.get(id) }))

  // Split into full-width and column groups
  const sections: { type: 'full' | 'columns'; items: typeof widgets }[] = []
  let currentColumns: typeof widgets = []

  for (const widget of widgets) {
    const w = widget.def?.defaultDimensions.w ?? 12
    if (w >= 12) {
      if (currentColumns.length > 0) {
        sections.push({ type: 'columns', items: currentColumns })
        currentColumns = []
      }
      sections.push({ type: 'full', items: [widget] })
    } else {
      currentColumns.push(widget)
    }
  }
  if (currentColumns.length > 0) {
    sections.push({ type: 'columns', items: currentColumns })
  }

  return (
    <div className="space-y-4">
      {sections.map((section, sIdx) => {
        if (section.type === 'full') {
          const { id, def } = section.items[0]
          return def ? (
            <div key={`full-${sIdx}`}>
              <def.component />
            </div>
          ) : (
            <FallbackWidget key={`full-${sIdx}`} id={id} />
          )
        }

        // Distribute column widgets into left and right columns
        const left: typeof widgets = []
        const right: typeof widgets = []
        for (const widget of section.items) {
          const w = widget.def?.defaultDimensions.w ?? 6
          if (w > 6) {
            left.push(widget)
          } else {
            right.push(widget)
          }
        }

        return (
          <div key={`cols-${sIdx}`} className="flex flex-col gap-4 md:flex-row">
            <div className="flex flex-1 flex-col gap-4 md:basis-7/12">
              {left.map(({ id, def }) =>
                def ? <def.component key={id} /> : <FallbackWidget key={id} id={id} />,
              )}
            </div>
            <div className="flex flex-1 flex-col gap-4 md:basis-5/12">
              {right.map(({ id, def }) =>
                def ? <def.component key={id} /> : <FallbackWidget key={id} id={id} />,
              )}
            </div>
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
