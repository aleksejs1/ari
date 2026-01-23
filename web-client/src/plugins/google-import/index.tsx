import { lazy, Suspense } from 'react'

import { PageLoader } from './components/PageLoader'
import { GoogleImportSidebarSection } from './extensions/GoogleImportSidebarSection'

import type { Plugin } from '@/lib/core/Plugin'
import { RouteRegistry } from '@/lib/routing/RouteRegistry'
import { SidebarRegistry } from '@/lib/ui/sidebar/SidebarRegistry'

const GoogleImportPage = lazy(() => import('./pages/GoogleImportPage'))

export class GoogleImportPlugin implements Plugin {
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
