import { lazy, Suspense } from 'react'

import type { Plugin } from '@/lib/core/Plugin'
import { RouteRegistry } from '@/lib/routing/RouteRegistry'
import { SidebarRegistry } from '@/lib/ui/sidebar/SidebarRegistry'

import { PageLoader } from './components/PageLoader'
import { NotificationsSidebarSection } from './extensions/NotificationsSidebarSection'

const NotificationChannelsPage = lazy(() => import('./pages/NotificationChannelsPage'))
const NotificationPoliciesPage = lazy(() => import('./pages/NotificationPoliciesPage'))
const NotificationPolicyFormPage = lazy(() => import('./pages/NotificationPolicyFormPage'))

export class NotificationsPlugin implements Plugin {
  name = 'notifications'

  register(): void {
    const routeRegistry = RouteRegistry.getInstance()
    const sidebarRegistry = SidebarRegistry.getInstance()

    // 1. Register Routes
    routeRegistry.register('dashboard', {
      path: '/notification-channels',
      element: (
        <Suspense fallback={<PageLoader />}>
          <NotificationChannelsPage />
        </Suspense>
      ),
    })

    routeRegistry.register('dashboard', {
      path: '/settings/notification-policies',
      element: (
        <Suspense fallback={<PageLoader />}>
          <NotificationPoliciesPage />
        </Suspense>
      ),
    })

    routeRegistry.register('dashboard', {
      path: '/settings/notification-policies/new',
      element: (
        <Suspense fallback={<PageLoader />}>
          <NotificationPolicyFormPage />
        </Suspense>
      ),
    })

    routeRegistry.register('dashboard', {
      path: '/settings/notification-policies/:id',
      element: (
        <Suspense fallback={<PageLoader />}>
          <NotificationPolicyFormPage />
        </Suspense>
      ),
    })

    // 2. Register Sidebar Section
    sidebarRegistry.register({
      id: 'notifications',
      component: NotificationsSidebarSection,
      order: 30, // Maintains original order
    })
  }
}
