import { lazy, Suspense } from 'react'

import { DashboardSidebarSection } from './extensions/DashboardSidebarSection'
import { registerDashboardWidgets } from './hooks/registerWidgets'

import type { Plugin } from '@/lib/core/Plugin'
import { RouteRegistry } from '@/lib/routing/RouteRegistry'
import { SidebarRegistry } from '@/lib/ui/sidebar/SidebarRegistry'
import { PageLoader } from '@/plugins/settings/components/PageLoader'

const HomePage = lazy(() => import('./pages/HomePage'))

export class DashboardPlugin implements Plugin {
  name = 'dashboard'

  register(): void {
    const routeRegistry = RouteRegistry.getInstance()
    const sidebarRegistry = SidebarRegistry.getInstance()

    // 1. Register Routes
    routeRegistry.register('sidebar-less', {
      path: '/',
      element: (
        <Suspense fallback={<PageLoader />}>
          <HomePage />
        </Suspense>
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
