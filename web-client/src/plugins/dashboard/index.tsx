import { lazy, Suspense } from 'react'

import { BasePlugin } from '@/lib/core/Plugin'
import { RouteRegistry } from '@/lib/routing/RouteRegistry'
import { SidebarRegistry } from '@/lib/ui/sidebar/SidebarRegistry'
import { TopMenuRegistry } from '@/lib/ui/topmenu/TopMenuRegistry'

import { PageLoader } from '@/plugins/settings/components/PageLoader'

import { DashboardSidebarSection } from './extensions/DashboardSidebarSection'
import { DashboardTopNavSection } from './extensions/DashboardTopNavSection'
import { registerDashboardWidgets } from './hooks/registerWidgets'

const HomePage = lazy(() => import('./pages/HomePage'))

export class DashboardPlugin extends BasePlugin {
  name = 'dashboard'

  register(): void {
    const routeRegistry = RouteRegistry.getInstance()
    const sidebarRegistry = SidebarRegistry.getInstance()
    const topMenuRegistry = TopMenuRegistry.getInstance()

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

    // 3. Register Top Menu Extension
    topMenuRegistry.register({
      id: 'dashboard-top',
      component: DashboardTopNavSection,
      order: 0,
    })

    // 4. Register Widgets
    registerDashboardWidgets()
  }
}
