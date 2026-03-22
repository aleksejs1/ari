import { lazy, Suspense } from 'react'

import { BasePlugin } from '@/lib/core/Plugin'
import type { PluginContext } from '@/lib/core/PluginContext'
import { PluginErrorBoundary } from '@/lib/core/PluginErrorBoundary'

import { PageLoader } from './components/PageLoader'

const GoogleImportPage = lazy(() => import('./pages/GoogleImportPage'))

export class GoogleImportPlugin extends BasePlugin {
  name = 'google-import'

  register(context: PluginContext): void {
    const { routeRegistry } = context

    // 1. Settings sub-route
    routeRegistry.register('settings', {
      path: 'google-import',
      element: (
        <PluginErrorBoundary pluginId="google-import">
          <Suspense fallback={<PageLoader />}>
            <GoogleImportPage />
          </Suspense>
        </PluginErrorBoundary>
      ),
    })

    // Redirect from old URL
    routeRegistry.register('main', {
      path: '/google-import',
      lazy: async () => {
        const { Navigate } = await import('react-router-dom')
        return { Component: () => <Navigate to="/settings/google-import" replace /> }
      },
    })
  }
}
