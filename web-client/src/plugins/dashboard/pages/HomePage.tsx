import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Settings } from 'lucide-react'

import { useDashboardSettings } from '@/hooks/useDashboardSettings'

import DynamicDashboard from '../components/DynamicDashboard'
import WidgetTogglePanel from '../components/WidgetTogglePanel'

export default function HomePage() {
  const { t } = useTranslation()
  const [customizeOpen, setCustomizeOpen] = useState(false)
  const { visibleLayout, allWidgets, isWidgetVisible, toggleWidget } = useDashboardSettings()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">{t('dashboard.title')}</h1>
        <button
          onClick={() => setCustomizeOpen(true)}
          className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-800 dark:hover:text-gray-300"
        >
          <Settings className="h-4 w-4" />
          {t('dashboard.customize', 'Customize')}
        </button>
      </div>

      <DynamicDashboard zones={visibleLayout} />

      <WidgetTogglePanel
        open={customizeOpen}
        onOpenChange={setCustomizeOpen}
        widgets={allWidgets}
        isWidgetVisible={isWidgetVisible}
        onToggle={toggleWidget}
      />
    </div>
  )
}
