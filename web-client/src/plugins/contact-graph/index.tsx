import { lazy, Suspense } from 'react'
import { useTranslation } from 'react-i18next'
import { Lock, Network } from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ContactDetailsRegistry } from '@/lib/contacts/details/ContactDetailsRegistry'
import { BasePlugin } from '@/lib/core/Plugin'
import type { PluginContext } from '@/lib/core/PluginContext'
import { PluginErrorBoundary } from '@/lib/core/PluginErrorBoundary'
import { FeatureGate, useUpgradeModal } from '@/lib/entitlements'
import type { Contact } from '@/types/models'

import { SidebarNavItem } from '@/features/ui/sidebar/SidebarNavItem'

import { useContactGraph } from './api/useContactGraph'
import { ContactGraphWidget } from './components/ContactGraphWidget'
import { PageLoader } from './components/PageLoader'

const ContactGraphPage = lazy(() => import('./pages/ContactGraphPage'))

function ContactGraphSidebarItem({
  onNavigate,
  collapsed,
}: {
  onNavigate?: () => void
  collapsed?: boolean
}) {
  const { t } = useTranslation()
  const { openUpgradeModal } = useUpgradeModal()
  const label = t('contactGraph.title', 'Contact Graph')
  return (
    <FeatureGate
      feature="contact_graph"
      promo={
        <button
          type="button"
          onClick={() => openUpgradeModal('contact_graph')}
          className={
            collapsed
              ? 'flex w-full justify-center rounded-lg px-2 py-2 text-gray-400 transition-colors hover:bg-gray-100 dark:text-gray-500 dark:hover:bg-gray-700'
              : 'flex w-full items-center gap-2 rounded-lg px-4 py-2 text-gray-400 transition-colors hover:bg-gray-100 dark:text-gray-500 dark:hover:bg-gray-700'
          }
          title={t('contactGraph.lockedHint', 'Available on higher-tier plans')}
        >
          <Network className="h-5 w-5 shrink-0" />
          {!collapsed && (
            <>
              <span className="flex-1 text-left">{label}</span>
              <Lock className="h-3.5 w-3.5 shrink-0" />
            </>
          )}
        </button>
      }
    >
      <SidebarNavItem
        to="/contact-graph"
        icon={Network}
        label={label}
        onClick={onNavigate}
        collapsed={collapsed}
      />
    </FeatureGate>
  )
}

function GraphConnectionsCard({ contact }: { contact: Contact }) {
  const { t } = useTranslation()
  const contactId = contact.id?.toString() ?? ''
  // Same query key as ContactGraphWidget — TanStack Query returns cached data, no extra request.
  const { data, isLoading } = useContactGraph(contactId ? { contactId, level: 2 } : {})

  if (!contact.id) {
    return null
  }

  if (!isLoading && data && data.nodes.length <= 1) {
    return null
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('contactGraph.widgetTitle', 'Graph Connections')}</CardTitle>
      </CardHeader>
      <CardContent>
        <ContactGraphWidget contactId={contactId} />
      </CardContent>
    </Card>
  )
}

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
