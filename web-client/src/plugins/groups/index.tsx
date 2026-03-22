import { lazy, Suspense } from 'react'

import { BasePlugin } from '@/lib/core/Plugin'
import type { PluginContext } from '@/lib/core/PluginContext'
import { PluginErrorBoundary } from '@/lib/core/PluginErrorBoundary'

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
        <PluginErrorBoundary pluginId="groups">
          <Suspense fallback={<PageLoader />}>
            <GroupsPage />
          </Suspense>
        </PluginErrorBoundary>
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
