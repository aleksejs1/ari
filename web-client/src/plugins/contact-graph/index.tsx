import { Network } from 'lucide-react'
import { lazy, Suspense } from 'react'
import { useTranslation } from 'react-i18next'

import { PageLoader } from './components/PageLoader'
import { GraphTopNavSection } from './extensions/GraphTopNavSection'

import { SidebarNavItem } from '@/features/ui/sidebar/SidebarNavItem'
import type { Plugin } from '@/lib/core/Plugin'
import { RouteRegistry } from '@/lib/routing/RouteRegistry'
import { SidebarRegistry } from '@/lib/ui/sidebar/SidebarRegistry'
import { TopMenuRegistry } from '@/lib/ui/topmenu/TopMenuRegistry'

const ContactGraphPage = lazy(() => import('./pages/ContactGraphPage'))

export class ContactGraphPlugin implements Plugin {
  name = 'contact-graph'

  register(): void {
    const routeRegistry = RouteRegistry.getInstance()
    const sidebarRegistry = SidebarRegistry.getInstance()
    const topMenuRegistry = TopMenuRegistry.getInstance()

    // 1. Register Route
    routeRegistry.register('sidebar-less', {
      path: '/contact-graph',
      element: (
        <Suspense fallback={<PageLoader />}>
          <ContactGraphPage />
        </Suspense>
      ),
    })

    // 2. Register Sidebar Link
    sidebarRegistry.register({
      id: 'contact-graph-link',
      component: ({ onNavigate }) => {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const { t } = useTranslation()
        return (
          <SidebarNavItem
            to="/contact-graph"
            icon={Network}
            label={t('contactGraph.title', 'Contact Graph')}
            onClick={onNavigate}
          />
        )
      },
      order: 45,
    })

    // 3. Register Top Menu Extension
    topMenuRegistry.register({
      id: 'contact-graph-top',
      component: GraphTopNavSection,
      order: 20,
    })
  }
}
