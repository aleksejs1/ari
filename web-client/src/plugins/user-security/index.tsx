import { lazy, Suspense } from 'react'

import type { Plugin } from '@/lib/core/Plugin'
import { RouteRegistry } from '@/lib/routing/RouteRegistry'
import { SidebarRegistry } from '@/lib/ui/sidebar/SidebarRegistry'

import { PageLoader } from './components/PageLoader'
import { SecuritySidebarSection } from './extensions/SecuritySidebarSection'

const ChangePasswordPage = lazy(() => import('./pages/ChangePasswordPage'))
const DeleteAccountPage = lazy(() => import('./pages/DeleteAccountPage'))

export class UserSecurityPlugin implements Plugin {
  name = 'user-security'

  register(): void {
    const routeRegistry = RouteRegistry.getInstance()
    const sidebarRegistry = SidebarRegistry.getInstance()

    // 1. Register Routes
    routeRegistry.register('dashboard', {
      path: '/change-password',
      element: (
        <Suspense fallback={<PageLoader />}>
          <ChangePasswordPage />
        </Suspense>
      ),
    })
    routeRegistry.register('dashboard', {
      path: '/delete-account',
      element: (
        <Suspense fallback={<PageLoader />}>
          <DeleteAccountPage />
        </Suspense>
      ),
    })

    // 2. Register Sidebar Section
    sidebarRegistry.register({
      id: 'user-security',
      component: SecuritySidebarSection,
      order: 40,
    })
  }
}
