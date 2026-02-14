import { lazy, Suspense } from 'react'

import { BasePlugin } from '@/lib/core/Plugin'
import type { PluginContext } from '@/lib/core/PluginContext'

import { PageLoader } from './components/PageLoader'
import { GroupsSidebarSection } from './extensions/GroupsSidebarSection'

const GroupsPage = lazy(() => import('./pages/GroupsPage'))

export class GroupsPlugin extends BasePlugin {
  name = 'groups'

  register(context: PluginContext): void {
    const { routeRegistry, sidebarRegistry } = context

    // 1. Register Routes
    routeRegistry.register('main', {
      path: '/groups',
      element: (
        <Suspense fallback={<PageLoader />}>
          <GroupsPage />
        </Suspense>
      ),
    })

    // 2. Register Sidebar Section (collapsible groups)
    sidebarRegistry.register({
      id: 'groups',
      component: GroupsSidebarSection,
      order: 20,
    })
  }
}
