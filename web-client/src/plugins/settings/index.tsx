import { lazy, Suspense } from 'react'

import { PageLoader } from './components/PageLoader'
import { SettingsSidebarSection } from './extensions/SettingsSidebarSection'
import { DataSettingsTab } from './tabs/DataSettingsTab'
import { GeneralSettingsTab } from './tabs/GeneralSettingsTab'
import { RegionalSettingsTab } from './tabs/RegionalSettingsTab'

import type { Plugin } from '@/lib/core/Plugin'
import { RouteRegistry } from '@/lib/routing/RouteRegistry'
import { settingsRegistry } from '@/lib/settings/SettingsRegistry'
import { SidebarRegistry } from '@/lib/ui/sidebar/SidebarRegistry'

const SettingsPage = lazy(() => import('./pages/SettingsPage'))

export class SettingsPlugin implements Plugin {
  name = 'settings'

  register(): void {
    const routeRegistry = RouteRegistry.getInstance()
    const sidebarRegistry = SidebarRegistry.getInstance()

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
