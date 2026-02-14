import { lazy, Suspense } from 'react'

import { BasePlugin } from '@/lib/core/Plugin'
import type { PluginContext } from '@/lib/core/PluginContext'

import { PageLoader } from './components/PageLoader'

const ChangePasswordPage = lazy(() => import('./pages/ChangePasswordPage'))
const DeleteAccountPage = lazy(() => import('./pages/DeleteAccountPage'))

export class UserSecurityPlugin extends BasePlugin {
  name = 'user-security'

  register(context: PluginContext): void {
    const { routeRegistry } = context

    // 1. Settings sub-routes
    routeRegistry.register('settings', {
      path: 'change-password',
      element: (
        <Suspense fallback={<PageLoader />}>
          <ChangePasswordPage />
        </Suspense>
      ),
    })
    routeRegistry.register('settings', {
      path: 'delete-account',
      element: (
        <Suspense fallback={<PageLoader />}>
          <DeleteAccountPage />
        </Suspense>
      ),
    })

    // Redirects from old URLs
    routeRegistry.register('main', {
      path: '/change-password',
      lazy: async () => {
        const { Navigate } = await import('react-router-dom')
        return { Component: () => <Navigate to="/settings/change-password" replace /> }
      },
    })
    routeRegistry.register('main', {
      path: '/delete-account',
      lazy: async () => {
        const { Navigate } = await import('react-router-dom')
        return { Component: () => <Navigate to="/settings/delete-account" replace /> }
      },
    })
  }
}
