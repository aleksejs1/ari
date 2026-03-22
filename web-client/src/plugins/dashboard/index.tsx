import { lazy, Suspense } from 'react'

import { PageLoader } from '@/components/PageLoader'
import { BasePlugin } from '@/lib/core/Plugin'
import type { PluginContext } from '@/lib/core/PluginContext'
import { PluginErrorBoundary } from '@/lib/core/PluginErrorBoundary'

import { DashboardSidebarSection } from './extensions/DashboardSidebarSection'
import { registerDashboardWidgets } from './hooks/registerWidgets'

const HomePage = lazy(() => import('./pages/HomePage'))

export class DashboardPlugin extends BasePlugin {
  name = 'dashboard'

  register(context: PluginContext): void {
    const { routeRegistry, sidebarRegistry } = context

    // 1. Register Routes
    routeRegistry.register('main', {
      path: '/',
      element: (
        <PluginErrorBoundary pluginId="dashboard">
          <Suspense fallback={<PageLoader />}>
            <HomePage />
          </Suspense>
        </PluginErrorBoundary>
      ),
    })

    // 2. Register Sidebar Extension
    sidebarRegistry.register({
      id: 'dashboard',
      component: DashboardSidebarSection,
      order: 0, // Top of the list
    })

    // 3. Register Widgets
    registerDashboardWidgets()
  }
}
