import { lazy, Suspense } from 'react'

import { ContactDetailsRegistry } from '@/lib/contacts/details/ContactDetailsRegistry'
import { BasePlugin } from '@/lib/core/Plugin'
import type { PluginContext } from '@/lib/core/PluginContext'
import { PluginErrorBoundary } from '@/lib/core/PluginErrorBoundary'

import { ContactGraphSidebarItem } from './components/ContactGraphSidebarItem'
import { GraphConnectionsCard } from './components/GraphConnectionsCard'
import { PageLoader } from './components/PageLoader'

const ContactGraphPage = lazy(() => import('./pages/ContactGraphPage'))

export class ContactGraphPlugin extends BasePlugin {
  name = 'contact-graph'

  register(context: PluginContext): void {
    const { routeRegistry, sidebarRegistry } = context
    const contactDetailsRegistry = ContactDetailsRegistry.getInstance()

    // 1. Register Route
    routeRegistry.register('main', {
      path: '/contact-graph',
      element: (
        <PluginErrorBoundary pluginId="contact-graph">
          <Suspense fallback={<PageLoader />}>
            <ContactGraphPage />
          </Suspense>
        </PluginErrorBoundary>
      ),
    })

    // 2. Register Sidebar Link
    sidebarRegistry.register({
      id: 'contact-graph-link',
      component: ContactGraphSidebarItem,
      order: 30,
    })

    // 3. Register Contact Details Widget
    contactDetailsRegistry.register({
      id: 'graph-connections',
      order: 90,
      layout: 'right',
      component: GraphConnectionsCard,
    })
  }
}
