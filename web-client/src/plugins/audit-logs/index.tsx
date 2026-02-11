import { lazy, Suspense } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { FileText, History } from 'lucide-react'

import { DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { BasePlugin } from '@/lib/core/Plugin'
import type { PluginContext } from '@/lib/core/PluginContext'

import { SidebarNavItem } from '@/features/ui/sidebar/SidebarNavItem'

import { PageLoader } from './components/PageLoader'

const AuditLogsPage = lazy(() => import('./pages/AuditLogsPage'))
const RecentAuditLogsWidget = lazy(() => import('./widgets/RecentAuditLogsWidget'))

export class AuditLogsPlugin extends BasePlugin {
  name = 'audit-logs'

  register(context: PluginContext): void {
    const { routeRegistry, sidebarRegistry, userMenuRegistry, widgetRegistry } = context

    // 1. Routing
    routeRegistry.register('dashboard', {
      path: '/audit-logs',
      element: (
        <Suspense fallback={<PageLoader />}>
          <AuditLogsPage />
        </Suspense>
      ),
    })

    // 2. Sidebar
    sidebarRegistry.register({
      id: 'audit-logs-sidebar',
      component: ({ onNavigate }) => {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const { t } = useTranslation()
        return (
          <SidebarNavItem
            to="/audit-logs"
            icon={History}
            label={t('app.navigation.sidebar.auditLogs', 'Audit Logs')}
            onClick={onNavigate}
          />
        )
      },
      order: 15,
    })

    // 3. User Menu
    userMenuRegistry.register({
      id: 'audit-logs-usermenu',
      component: () => {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const { t } = useTranslation()
        return (
          <DropdownMenuItem asChild>
            <Link to="/audit-logs" className="cursor-pointer p-4 md:px-2 md:py-1.5">
              <FileText className="mr-3 h-5 w-5 md:mr-2 md:h-4 md:w-4" />
              <span className="text-base md:text-sm">
                {t('app.navigation.auditLogs', 'Audit Logs')}
              </span>
            </Link>
          </DropdownMenuItem>
        )
      },
      order: 25,
    })

    // 4. Dashboard Widgets
    widgetRegistry.register({
      id: 'recent-audit-logs',
      title: 'Recent Audit Logs',
      description: 'dashboard.widget.recentAuditLogs.description',
      component: () => (
        <Suspense fallback={null}>
          <RecentAuditLogsWidget />
        </Suspense>
      ),
      defaultDimensions: { w: 7, h: 4 },
    })
  }
}
