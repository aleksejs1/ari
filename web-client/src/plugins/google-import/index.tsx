import { lazy, Suspense } from 'react'

import { BasePlugin } from '@/lib/core/Plugin'
import { RouteRegistry } from '@/lib/routing/RouteRegistry'
import { SidebarRegistry } from '@/lib/ui/sidebar/SidebarRegistry'

import { PageLoader } from './components/PageLoader'
import { GoogleImportSidebarSection } from './extensions/GoogleImportSidebarSection'

const GoogleImportPage = lazy(() => import('./pages/GoogleImportPage'))

export class GoogleImportPlugin extends BasePlugin {
  name = 'google-import'

  register(): void {
    const routeRegistry = RouteRegistry.getInstance()
    const sidebarRegistry = SidebarRegistry.getInstance()

    // 1. Register Route
    routeRegistry.register('dashboard', {
      path: '/google-import',
      element: (
        <Suspense fallback={<PageLoader />}>
          <GoogleImportPage />
        </Suspense>
      ),
    })

    // 2. Register Sidebar Section
    sidebarRegistry.register({
      id: 'google-import',
      component: GoogleImportSidebarSection,
      order: 50, // Integrations section
    })
  }
}
