import { Network } from 'lucide-react'
import { lazy, Suspense } from 'react'
import { useTranslation } from 'react-i18next'

import { PageLoader } from './components/PageLoader'

import { SidebarNavItem } from '@/features/ui/sidebar/SidebarNavItem'
import type { Plugin } from '@/lib/core/Plugin'
import { RouteRegistry } from '@/lib/routing/RouteRegistry'
import { SidebarRegistry } from '@/lib/ui/sidebar/SidebarRegistry'

const ContactGraphPage = lazy(() => import('./pages/ContactGraphPage'))

export class ContactGraphPlugin implements Plugin {
  name = 'contact-graph'

  register(): void {
    const routeRegistry = RouteRegistry.getInstance()
    const sidebarRegistry = SidebarRegistry.getInstance()

    // 1. Register Route
    routeRegistry.register('sidebar-less', {
      path: '/contact-graph',
      element: (
        <Suspense fallback={<PageLoader />}>
          <ContactGraphPage />
        </Suspense>
      ),
    })

    // 2. Register Sidebar Link (adding it to the "Integrations" section or similar)
    sidebarRegistry.register({
      id: 'contact-graph-link',
      component: ({ onNavigate }) => {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const { t } = useTranslation()
        return (
          <SidebarNavItem
            to="/contact-graph"
            icon={Network}
            label={t('contactGraph.title', 'Contact Graph')} // Fallback title
            onClick={onNavigate}
          />
        )
      },
      order: 45, // Place it somewhere after sessions/integrations? Checking defaults_sidebar.ts...
      // defaults_sidebar: integrations=30, sessions=40, settings=50. So 45 fits in between or near sessions.
    })
  }
}
