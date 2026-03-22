import { lazy, Suspense } from 'react'

import { BasePlugin } from '@/lib/core/Plugin'
import type { PluginContext } from '@/lib/core/PluginContext'
import { PluginErrorBoundary } from '@/lib/core/PluginErrorBoundary'

import { PageLoader } from './components/PageLoader'

const AuditLogsPage = lazy(() => import('./pages/AuditLogsPage'))
const RecentAuditLogsWidget = lazy(() => import('./widgets/RecentAuditLogsWidget'))

export class AuditLogsPlugin extends BasePlugin {
  name = 'audit-logs'

  register(context: PluginContext): void {
    const { routeRegistry, widgetRegistry } = context

    // 1. Settings sub-route
    routeRegistry.register('settings', {
      path: 'audit-logs',
      element: (
        <PluginErrorBoundary pluginId="audit-logs">
          <Suspense fallback={<PageLoader />}>
            <AuditLogsPage />
          </Suspense>
        </PluginErrorBoundary>
      ),
    })

    // Redirect from old URL
    routeRegistry.register('main', {
      path: '/audit-logs',
      lazy: async () => {
        const { Navigate } = await import('react-router-dom')
        return { Component: () => <Navigate to="/settings/audit-logs" replace /> }
      },
    })

    // 2. Dashboard Widgets
    widgetRegistry.register({
      id: 'recent-audit-logs',
      title: 'Recent Audit Logs',
      description: 'dashboard.widget.recentAuditLogs.description',
      component: () => (
        <PluginErrorBoundary pluginId="audit-logs">
          <Suspense fallback={null}>
            <RecentAuditLogsWidget />
          </Suspense>
        </PluginErrorBoundary>
      ),
      defaultDimensions: { w: 7, h: 4 },
    })
  }
}
