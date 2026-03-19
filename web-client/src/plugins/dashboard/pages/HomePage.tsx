import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Settings } from 'lucide-react'

import { useDashboardSettings } from '@/hooks/useDashboardSettings'

import DashboardEditToolbar from '../components/DashboardEditToolbar'
import DynamicDashboard from '../components/DynamicDashboard'
import LayoutPicker from '../components/LayoutPicker'
import WidgetTogglePanel from '../components/WidgetTogglePanel'
import SeasonalCheckinWidget from '../widgets/SeasonalCheckinWidget'

export default function HomePage() {
  const { t } = useTranslation()
  const [customizeOpen, setCustomizeOpen] = useState(false)
  const [layoutPickerOpen, setLayoutPickerOpen] = useState(false)
  const {
    activeLayout,
    visibleLayout,
    allWidgets,
    availableLayouts,
    isWidgetVisible,
    toggleWidget,
    isEditMode,
    enterEditMode,
    exitEditMode,
    saveAndExit,
    resetToDefault,
    reorderInZone,
    moveWidget,
    switchLayout,
  } = useDashboardSettings()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">{t('dashboard.title')}</h1>
        {isEditMode ? (
          <DashboardEditToolbar
            onSave={saveAndExit}
            onCancel={exitEditMode}
            onReset={resetToDefault}
            onChangeLayout={() => setLayoutPickerOpen(true)}
          />
        ) : (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCustomizeOpen(true)}
              className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-800 dark:hover:text-gray-300"
            >
              <Settings className="h-4 w-4" />
              {t('dashboard.customize', 'Customize')}
            </button>
            <button
              onClick={enterEditMode}
              className="rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              {t('dashboard.edit.reorder', 'Reorder')}
            </button>
          </div>
        )}
      </div>

      <SeasonalCheckinWidget />

      <DynamicDashboard
        zones={visibleLayout}
        layoutId={activeLayout}
        isEditMode={isEditMode}
        onReorder={reorderInZone}
        onMoveWidget={moveWidget}
      />

      <WidgetTogglePanel
        open={customizeOpen}
        onOpenChange={setCustomizeOpen}
        widgets={allWidgets}
        isWidgetVisible={isWidgetVisible}
        onToggle={toggleWidget}
      />

      <LayoutPicker
        open={layoutPickerOpen}
        onOpenChange={setLayoutPickerOpen}
        layouts={availableLayouts}
        activeLayoutId={activeLayout}
        onSelect={switchLayout}
      />
    </div>
  )
}
