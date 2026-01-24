import { lazy, Suspense } from 'react'

import { BasePlugin } from '@/lib/core/Plugin'
import type { PluginContext } from '@/lib/core/PluginContext'

import { PageLoader } from './components/PageLoader'
import { NotificationsSidebarSection } from './extensions/NotificationsSidebarSection'

const NotificationChannelsPage = lazy(() => import('./pages/NotificationChannelsPage'))
const NotificationPoliciesPage = lazy(() => import('./pages/NotificationPoliciesPage'))
const NotificationPolicyFormPage = lazy(() => import('./pages/NotificationPolicyFormPage'))

export class NotificationsPlugin extends BasePlugin {
  name = 'notifications'

  register(context: PluginContext): void {
    const { routeRegistry, sidebarRegistry } = context

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
