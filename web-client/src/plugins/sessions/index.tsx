import { lazy, Suspense } from 'react'

import { BasePlugin } from '@/lib/core/Plugin'
import type { PluginContext } from '@/lib/core/PluginContext'

import { PageLoader } from './components/PageLoader'

const SessionsPage = lazy(() => import('./pages/SessionsPage'))
const LoginHistoryPage = lazy(() => import('./pages/LoginHistoryPage'))
const RecentLoginsWidget = lazy(() => import('./widgets/RecentLoginsWidget'))

export class SessionsPlugin extends BasePlugin {
  name = 'sessions'

  register(context: PluginContext): void {
    const { routeRegistry, widgetRegistry } = context

    // 1. Settings sub-routes
    routeRegistry.register('settings', {
      path: 'sessions',
      element: (
        <Suspense fallback={<PageLoader />}>
          <SessionsPage />
        </Suspense>
      ),
    })

    routeRegistry.register('settings', {
      path: 'login-history',
      element: (
        <Suspense fallback={<PageLoader />}>
          <LoginHistoryPage />
        </Suspense>
      ),
    })

    // Redirects from old URLs
    routeRegistry.register('main', {
      path: '/sessions',
      lazy: async () => {
        const { Navigate } = await import('react-router-dom')
        return { Component: () => <Navigate to="/settings/sessions" replace /> }
      },
    })

    routeRegistry.register('main', {
      path: '/login-history',
      lazy: async () => {
        const { Navigate } = await import('react-router-dom')
        return { Component: () => <Navigate to="/settings/login-history" replace /> }
      },
    })

    // 2. Register Dashboard Widget
    widgetRegistry.register({
      id: 'recent-logins',
      title: 'Recent Logins',
      description: 'dashboard.widget.recentLogins.description',
      component: () => (
        <Suspense fallback={null}>
          <RecentLoginsWidget />
        </Suspense>
      ),
      defaultDimensions: { w: 7, h: 4 },
    })
  }
}
