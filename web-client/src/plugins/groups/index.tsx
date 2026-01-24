import { lazy, Suspense } from 'react'

import { BasePlugin } from '@/lib/core/Plugin'
import { RouteRegistry } from '@/lib/routing/RouteRegistry'
import { SidebarRegistry } from '@/lib/ui/sidebar/SidebarRegistry'

import { PageLoader } from './components/PageLoader'
import { GroupsSidebarSection } from './extensions/GroupsSidebarSection'

const GroupsPage = lazy(() => import('./pages/GroupsPage'))

export class GroupsPlugin extends BasePlugin {
  name = 'groups'

  register(): void {
    const routeRegistry = RouteRegistry.getInstance()
    const sidebarRegistry = SidebarRegistry.getInstance()

    // 1. Register Routes
    routeRegistry.register('dashboard', {
      path: '/groups',
      element: (
        <Suspense fallback={<PageLoader />}>
          <GroupsPage />
        </Suspense>
      ),
    })

    // 2. Register Sidebar Section
    sidebarRegistry.register({
      id: 'groups',
      component: GroupsSidebarSection,
      order: 15,
    })
  }
}
