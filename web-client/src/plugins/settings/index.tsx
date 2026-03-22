import { lazy, Suspense } from 'react'
import { Navigate } from 'react-router-dom'

import { BasePlugin } from '@/lib/core/Plugin'
import type { PluginContext } from '@/lib/core/PluginContext'
import { PluginErrorBoundary } from '@/lib/core/PluginErrorBoundary'

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
const AiSettings = lazy(() =>
  import('./tabs/AiSettings.component').then((m) => ({ default: m.AiSettings })),
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
        <PluginErrorBoundary pluginId="settings">
          <Suspense fallback={<PageLoader />}>
            <GeneralSettings />
          </Suspense>
        </PluginErrorBoundary>
      ),
    })

    routeRegistry.register('settings', {
      path: 'regional',
      element: (
        <PluginErrorBoundary pluginId="settings">
          <Suspense fallback={<PageLoader />}>
            <RegionalSettings />
          </Suspense>
        </PluginErrorBoundary>
      ),
    })

    routeRegistry.register('settings', {
      path: 'data',
      element: (
        <PluginErrorBoundary pluginId="settings">
          <Suspense fallback={<PageLoader />}>
            <DataSettings />
          </Suspense>
        </PluginErrorBoundary>
      ),
    })

    routeRegistry.register('settings', {
      path: 'plugins',
      element: (
        <PluginErrorBoundary pluginId="settings">
          <Suspense fallback={<PageLoader />}>
            <CommunityPlugins />
          </Suspense>
        </PluginErrorBoundary>
      ),
    })

    routeRegistry.register('settings', {
      path: 'ai',
      element: (
        <PluginErrorBoundary pluginId="settings">
          <Suspense fallback={<PageLoader />}>
            <AiSettings />
          </Suspense>
        </PluginErrorBoundary>
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
