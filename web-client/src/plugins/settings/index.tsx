import { lazy, Suspense } from 'react'

import { BasePlugin } from '@/lib/core/Plugin'
import type { PluginContext } from '@/lib/core/PluginContext'

import { PageLoader } from './components/PageLoader'
import { SettingsSidebarSection } from './extensions/SettingsSidebarSection'
import { DataSettingsTab } from './tabs/DataSettingsTab'
import { GeneralSettingsTab } from './tabs/GeneralSettingsTab'
import { RegionalSettingsTab } from './tabs/RegionalSettingsTab'

const SettingsPage = lazy(() => import('./pages/SettingsPage'))

export class SettingsPlugin extends BasePlugin {
  name = 'settings'

  register(context: PluginContext): void {
    const { routeRegistry, sidebarRegistry, settingsRegistry } = context

    // 1. Register Routes
    routeRegistry.register('dashboard', {
      path: '/settings',
      element: (
        <Suspense fallback={<PageLoader />}>
          <SettingsPage />
        </Suspense>
      ),
    })

    // 2. Register Sidebar Section
    sidebarRegistry.register({
      id: 'settings',
      component: SettingsSidebarSection,
      order: 80,
    })

    // 3. Register Base Tabs
    settingsRegistry.registerTab(new GeneralSettingsTab())
    settingsRegistry.registerTab(new RegionalSettingsTab())
    settingsRegistry.registerTab(new DataSettingsTab())
  }
}
