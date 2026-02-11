import { lazy, Suspense } from 'react'
import { useTranslation } from 'react-i18next'
import { LogIn } from 'lucide-react'

import { BasePlugin } from '@/lib/core/Plugin'
import type { PluginContext } from '@/lib/core/PluginContext'

import { SidebarNavItem } from '@/features/ui/sidebar/SidebarNavItem'

import { PageLoader } from './components/PageLoader'
import { SessionsSidebarSection } from './extensions/SessionsSidebarSection'

const SessionsPage = lazy(() => import('./pages/SessionsPage'))
const LoginHistoryPage = lazy(() => import('./pages/LoginHistoryPage'))
const RecentLoginsWidget = lazy(() => import('./widgets/RecentLoginsWidget'))

export class SessionsPlugin extends BasePlugin {
  name = 'sessions'

  register(context: PluginContext): void {
    const { routeRegistry, sidebarRegistry, widgetRegistry } = context

    // 1. Register Routes
    routeRegistry.register('dashboard', {
      path: '/sessions',
      element: (
        <Suspense fallback={<PageLoader />}>
          <SessionsPage />
        </Suspense>
      ),
    })

    routeRegistry.register('dashboard', {
      path: '/login-history',
      element: (
        <Suspense fallback={<PageLoader />}>
          <LoginHistoryPage />
        </Suspense>
      ),
    })

    // 2. Register Sidebar Sections
    sidebarRegistry.register({
      id: 'sessions',
      component: SessionsSidebarSection,
      order: 40,
    })

    sidebarRegistry.register({
      id: 'login-history',
      component: ({ onNavigate }) => {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const { t } = useTranslation()
        return (
          <SidebarNavItem
            to="/login-history"
            icon={LogIn}
            label={t('app.navigation.sidebar.loginHistory', 'Login History')}
            onClick={onNavigate}
          />
        )
      },
      order: 42,
    })

    // 3. Register Dashboard Widget
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
