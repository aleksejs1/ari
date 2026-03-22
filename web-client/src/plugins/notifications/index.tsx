import { lazy, Suspense } from 'react'

import { BasePlugin } from '@/lib/core/Plugin'
import type { PluginContext } from '@/lib/core/PluginContext'
import { PluginErrorBoundary } from '@/lib/core/PluginErrorBoundary'

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
        <PluginErrorBoundary pluginId="notifications">
          <Suspense fallback={<PageLoader />}>
            <NotificationChannelsPage />
          </Suspense>
        </PluginErrorBoundary>
      ),
    })

    routeRegistry.register('settings', {
      path: 'notification-policies',
      element: (
        <PluginErrorBoundary pluginId="notifications">
          <Suspense fallback={<PageLoader />}>
            <NotificationPoliciesPage />
          </Suspense>
        </PluginErrorBoundary>
      ),
    })

    routeRegistry.register('settings', {
      path: 'notification-policies/new',
      element: (
        <PluginErrorBoundary pluginId="notifications">
          <Suspense fallback={<PageLoader />}>
            <NotificationPolicyFormPage />
          </Suspense>
        </PluginErrorBoundary>
      ),
    })

    routeRegistry.register('settings', {
      path: 'notification-policies/:id',
      element: (
        <PluginErrorBoundary pluginId="notifications">
          <Suspense fallback={<PageLoader />}>
            <NotificationPolicyFormPage />
          </Suspense>
        </PluginErrorBoundary>
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
