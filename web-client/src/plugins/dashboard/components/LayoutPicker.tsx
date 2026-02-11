import { useTranslation } from 'react-i18next'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import type { LayoutPreset } from '@/lib/widgets/LayoutPresets'

interface LayoutPickerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  layouts: LayoutPreset[]
  activeLayoutId: string
  onSelect: (presetId: string) => void
}

function ZonePreview({ preset }: { preset: LayoutPreset }) {
  const fullZones = preset.zones.filter((z) => z.basis === '100%')
  const columnZones = preset.zones.filter((z) => z.basis !== '100%')

  return (
    <div className="flex flex-col gap-1">
      {fullZones.map((zone) => (
        <div
          key={zone.id}
          className="h-3 rounded-sm bg-gray-300 dark:bg-gray-600"
          style={{ width: '100%' }}
        />
      ))}
      {columnZones.length > 0 ? (
        <div className="flex gap-1">
          {columnZones.map((zone) => (
            <div
              key={zone.id}
              className="h-8 rounded-sm bg-gray-300 dark:bg-gray-600"
              style={{ flex: basisToFlex(zone.basis) }}
            />
          ))}
        </div>
      ) : null}
    </div>
  )
}

function basisToFlex(basis?: string): string {
  if (!basis) {
    return '1'
  }
  const match = /^(\d+)\/(\d+)$/.exec(basis)
  if (match) {
    return String(Number(match[1]) / Number(match[2]))
  }
  return '1'
}

export default function LayoutPicker({
  open,
  onOpenChange,
  layouts,
  activeLayoutId,
  onSelect,
}: LayoutPickerProps) {
  const { t } = useTranslation()

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t('dashboard.layout.title', 'Choose Layout')}</DialogTitle>
          <DialogDescription>
            {t('dashboard.layout.description', 'Select a layout for your dashboard')}
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-3">
          {layouts.map((preset) => {
            const isActive = preset.id === activeLayoutId
            return (
              <button
                key={preset.id}
                onClick={() => {
                  onSelect(preset.id)
                  onOpenChange(false)
                }}
                className={`flex flex-col gap-2 rounded-lg border-2 p-3 text-left transition-colors ${
                  isActive
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600'
                }`}
              >
                <ZonePreview preset={preset} />
                <div>
                  <div className="text-sm font-medium">{t(preset.name)}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {t(preset.description)}
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      </DialogContent>
    </Dialog>
  )
}
