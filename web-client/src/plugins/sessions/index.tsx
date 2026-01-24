import { lazy, Suspense } from 'react'

import { BasePlugin } from '@/lib/core/Plugin'
import { RouteRegistry } from '@/lib/routing/RouteRegistry'
import { SidebarRegistry } from '@/lib/ui/sidebar/SidebarRegistry'

import { PageLoader } from './components/PageLoader'
import { SessionsSidebarSection } from './extensions/SessionsSidebarSection'

const SessionsPage = lazy(() => import('./pages/SessionsPage'))

export class SessionsPlugin extends BasePlugin {
  name = 'sessions'

  register(): void {
    const routeRegistry = RouteRegistry.getInstance()
    const sidebarRegistry = SidebarRegistry.getInstance()

    // 1. Register Route
    routeRegistry.register('dashboard', {
      path: '/sessions',
      element: (
        <Suspense fallback={<PageLoader />}>
          <SessionsPage />
        </Suspense>
      ),
    })

    // 2. Register Sidebar Section
    sidebarRegistry.register({
      id: 'sessions',
      component: SessionsSidebarSection,
      order: 40, // Keeps original order
    })
  }
}
