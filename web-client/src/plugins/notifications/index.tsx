import { lazy, Suspense } from 'react'

import { BasePlugin } from '@/lib/core/Plugin'
import type { PluginContext } from '@/lib/core/PluginContext'

import { PageLoader } from './components/PageLoader'

const NotificationChannelsPage = lazy(() => import('./pages/NotificationChannelsPage'))
const NotificationPoliciesPage = lazy(() => import('./pages/NotificationPoliciesPage'))
const NotificationPolicyFormPage = lazy(() => import('./pages/NotificationPolicyFormPage'))

export class NotificationsPlugin extends BasePlugin {
  name = 'notifications'

  register(context: PluginContext): void {
    const { routeRegistry } = context

    // 1. Settings sub-routes
    routeRegistry.register('settings', {
      path: 'notification-channels',
      element: (
        <Suspense fallback={<PageLoader />}>
          <NotificationChannelsPage />
        </Suspense>
      ),
    })

    routeRegistry.register('settings', {
      path: 'notification-policies',
      element: (
        <Suspense fallback={<PageLoader />}>
          <NotificationPoliciesPage />
        </Suspense>
      ),
    })

    routeRegistry.register('settings', {
      path: 'notification-policies/new',
      element: (
        <Suspense fallback={<PageLoader />}>
          <NotificationPolicyFormPage />
        </Suspense>
      ),
    })

    routeRegistry.register('settings', {
      path: 'notification-policies/:id',
      element: (
        <Suspense fallback={<PageLoader />}>
          <NotificationPolicyFormPage />
        </Suspense>
      ),
    })

    // Redirect from old URL
    routeRegistry.register('main', {
      path: '/notification-channels',
      lazy: async () => {
        const { Navigate } = await import('react-router-dom')
        return { Component: () => <Navigate to="/settings/notification-channels" replace /> }
      },
    })
  }
}
