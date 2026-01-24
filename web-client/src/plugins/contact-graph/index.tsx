import { lazy, Suspense } from 'react'
import { useTranslation } from 'react-i18next'
import { Network } from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ContactDetailsRegistry } from '@/lib/contacts/details/ContactDetailsRegistry'
import { BasePlugin } from '@/lib/core/Plugin'
import { RouteRegistry } from '@/lib/routing/RouteRegistry'
import { SidebarRegistry } from '@/lib/ui/sidebar/SidebarRegistry'
import { TopMenuRegistry } from '@/lib/ui/topmenu/TopMenuRegistry'

import { SidebarNavItem } from '@/features/ui/sidebar/SidebarNavItem'

import { ContactGraphWidget } from './components/ContactGraphWidget'
import { PageLoader } from './components/PageLoader'
import { GraphTopNavSection } from './extensions/GraphTopNavSection'

const ContactGraphPage = lazy(() => import('./pages/ContactGraphPage'))

export class ContactGraphPlugin extends BasePlugin {
  name = 'contact-graph'

  register(): void {
    const routeRegistry = RouteRegistry.getInstance()
    const sidebarRegistry = SidebarRegistry.getInstance()
    const topMenuRegistry = TopMenuRegistry.getInstance()
    const contactDetailsRegistry = ContactDetailsRegistry.getInstance()

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

    // 4. Register Contact Details Widget
    contactDetailsRegistry.register({
      id: 'graph-connections',
      order: 90,
      layout: 'half', // or full based on preference
      component: ({ contact }) => {
        if (!contact.id) {
          return null
        }
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const { t } = useTranslation()

        return (
          <Card>
            <CardHeader>
              <CardTitle>{t('contactGraph.widgetTitle', 'Graph Connections')}</CardTitle>
            </CardHeader>
            <CardContent>
              <ContactGraphWidget contactId={contact.id.toString()} />
            </CardContent>
          </Card>
        )
      },
    })
  }
}
