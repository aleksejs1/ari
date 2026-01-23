import { History, FileText } from 'lucide-react'
import { lazy, Suspense } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import { PageLoader } from './components/PageLoader'

import { DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { SidebarNavItem } from '@/features/ui/sidebar/SidebarNavItem'
import type { Plugin } from '@/lib/core/Plugin'
import { RouteRegistry } from '@/lib/routing/RouteRegistry'
import { SidebarRegistry } from '@/lib/ui/sidebar/SidebarRegistry'
import { UserMenuRegistry } from '@/lib/ui/usermenu/UserMenuRegistry'
import { widgetRegistry } from '@/lib/widgets/WidgetRegistry'

const AuditLogsPage = lazy(() => import('./pages/AuditLogsPage'))
const RecentAuditLogsWidget = lazy(() => import('./widgets/RecentAuditLogsWidget'))

export class AuditLogsPlugin implements Plugin {
  name = 'audit-logs'

  register(): void {
    const routeRegistry = RouteRegistry.getInstance()
    const sidebarRegistry = SidebarRegistry.getInstance()
    const userMenuRegistry = UserMenuRegistry.getInstance()

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
      component: () => (
        <Suspense fallback={null}>
          <RecentAuditLogsWidget />
        </Suspense>
      ),
      defaultDimensions: { w: 7, h: 4 },
    })
  }
}
