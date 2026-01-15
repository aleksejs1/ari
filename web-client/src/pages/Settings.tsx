import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Button } from '@/components/ui/button'
import { useSettingsTabs } from '@/lib/settings/SettingsRegistry'

export default function SettingsPage() {
  const { t } = useTranslation()
  const tabs = useSettingsTabs()
  const [activeTabId, setActiveTabId] = useState<string | null>(null)

  const activeTab = activeTabId ? tabs.find((tab) => tab.id === activeTabId) : tabs[0]

  return (
    <div className="container mx-auto py-6">
      <h1 className="mb-6 text-3xl font-bold">{t('settings.title')}</h1>

      <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
        <aside className="-mx-4 lg:w-1/5">
          <nav className="flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1">
            {tabs.map((tab) => (
              <Button
                key={tab.id}
                variant={activeTab?.id === tab.id ? 'secondary' : 'ghost'}
                className="justify-start hover:bg-transparent hover:underline"
                onClick={() => setActiveTabId(tab.id)}
              >
                {t(tab.name)}
              </Button>
            ))}
          </nav>
        </aside>
        <div className="flex-1 lg:max-w-2xl">
          {activeTab ? (
            <activeTab.Component />
          ) : (
            <div className="text-muted-foreground">No settings active.</div>
          )}
        </div>
      </div>
    </div>
  )
}
