import { lazy, Suspense } from 'react'

import { BasePlugin } from '@/lib/core/Plugin'
import type { PluginContext } from '@/lib/core/PluginContext'
import { PluginErrorBoundary } from '@/lib/core/PluginErrorBoundary'

import { PageLoader } from './components/PageLoader'

const IntegrationsPage = lazy(() => import('./pages/IntegrationsPage'))

export class IntegrationsPlugin extends BasePlugin {
  name = 'integrations'

  register(context: PluginContext): void {
    const { routeRegistry } = context

    routeRegistry.register('settings', {
      path: 'integrations',
      element: (
        <PluginErrorBoundary pluginId="integrations">
          <Suspense fallback={<PageLoader />}>
            <IntegrationsPage />
          </Suspense>
        </PluginErrorBoundary>
      ),
    })
  }
}
