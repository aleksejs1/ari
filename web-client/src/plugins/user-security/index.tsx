import { lazy, Suspense } from 'react'

import { BasePlugin } from '@/lib/core/Plugin'
import type { PluginContext } from '@/lib/core/PluginContext'

import { PageLoader } from './components/PageLoader'
import { SecuritySidebarSection } from './extensions/SecuritySidebarSection'

const ChangePasswordPage = lazy(() => import('./pages/ChangePasswordPage'))
const DeleteAccountPage = lazy(() => import('./pages/DeleteAccountPage'))

export class UserSecurityPlugin extends BasePlugin {
  name = 'user-security'

  register(context: PluginContext): void {
    const { routeRegistry, sidebarRegistry } = context

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
