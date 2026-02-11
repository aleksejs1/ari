import { useTranslation } from 'react-i18next'

import { Checkbox } from '@/components/ui/checkbox'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import type { WidgetDefinition } from '@/lib/widgets/WidgetRegistry'

interface WidgetTogglePanelProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  widgets: WidgetDefinition[]
  isWidgetVisible: (id: string) => boolean
  onToggle: (id: string) => void
}

export default function WidgetTogglePanel({
  open,
  onOpenChange,
  widgets,
  isWidgetVisible,
  onToggle,
}: WidgetTogglePanelProps) {
  const { t } = useTranslation()

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t('dashboard.widgetToggle.title', 'Dashboard Widgets')}</DialogTitle>
          <DialogDescription>
            {t(
              'dashboard.widgetToggle.description',
              'Choose which widgets to show on your dashboard',
            )}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-1 py-2">
          {widgets.map((widget) => (
            <label
              key={widget.id}
              className="flex cursor-pointer items-center gap-3 rounded-md px-3 py-2.5 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50"
            >
              <Checkbox
                checked={isWidgetVisible(widget.id)}
                onCheckedChange={() => onToggle(widget.id)}
              />
              <div className="min-w-0 flex-1">
                <div className="text-sm font-medium">{widget.title}</div>
                {widget.description ? (
                  <div className="text-xs text-gray-500">
                    {t(widget.description, widget.description)}
                  </div>
                ) : null}
              </div>
            </label>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}
