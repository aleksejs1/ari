import { lazy, Suspense } from 'react'
import { Navigate } from 'react-router-dom'

import { BasePlugin } from '@/lib/core/Plugin'
import type { PluginContext } from '@/lib/core/PluginContext'

import { PageLoader } from './components/PageLoader'
import { SettingsSidebarSection } from './extensions/SettingsSidebarSection'

const GeneralSettings = lazy(() =>
  import('./tabs/GeneralSettings.component').then((m) => ({ default: m.GeneralSettings })),
)
const RegionalSettings = lazy(() =>
  import('./tabs/RegionalSettings.component').then((m) => ({ default: m.RegionalSettings })),
)
const DataSettings = lazy(() =>
  import('./tabs/DataSettings.component').then((m) => ({ default: m.DataSettings })),
)
const CommunityPlugins = lazy(() =>
  import('./components/CommunityPlugins.component').then((m) => ({ default: m.CommunityPlugins })),
)

export class SettingsPlugin extends BasePlugin {
  name = 'settings'

  register(context: PluginContext): void {
    const { routeRegistry, sidebarRegistry } = context

    // 1. Register Settings index redirect
    routeRegistry.register('settings', {
      index: true,
      element: <Navigate to="/settings/general" replace />,
    })

    // 2. Register Settings tabs as sub-routes
    routeRegistry.register('settings', {
      path: 'general',
      element: (
        <Suspense fallback={<PageLoader />}>
          <GeneralSettings />
        </Suspense>
      ),
    })

    routeRegistry.register('settings', {
      path: 'regional',
      element: (
        <Suspense fallback={<PageLoader />}>
          <RegionalSettings />
        </Suspense>
      ),
    })

    routeRegistry.register('settings', {
      path: 'data',
      element: (
        <Suspense fallback={<PageLoader />}>
          <DataSettings />
        </Suspense>
      ),
    })

    routeRegistry.register('settings', {
      path: 'plugins',
      element: (
        <Suspense fallback={<PageLoader />}>
          <CommunityPlugins />
        </Suspense>
      ),
    })

    // 3. Register Sidebar Section
    sidebarRegistry.register({
      id: 'settings',
      component: SettingsSidebarSection,
      order: 100,
    })
  }
}
