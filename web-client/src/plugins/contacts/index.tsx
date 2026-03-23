import { lazy, Suspense } from 'react'

import { ContactDetailsRegistry } from '@/lib/contacts/details/ContactDetailsRegistry'
import { BasePlugin } from '@/lib/core/Plugin'
import type { PluginContext } from '@/lib/core/PluginContext'
import { PluginErrorBoundary } from '@/lib/core/PluginErrorBoundary'
import { widgetRegistry } from '@/lib/widgets/WidgetRegistry'

import { PageLoader } from '../settings/components/PageLoader'

import { ContactsHistoryCard } from './components/ContactsHistoryCard'
import { ContactsSidebarItem } from './components/ContactsSidebarItem'
import { registerDefaultContactDetailsSections } from './details/defaults_details'
import en from './locales/en.json'
import ru from './locales/ru.json'
import { registerDefaultContactFormSections } from './defaults_form'

const CatchUpWidget = lazy(() => import('./widgets/CatchUpWidget'))
const ContactsPage = lazy(() => import('./pages/ContactsPage'))
const ContactDetailsPage = lazy(() => import('./pages/ContactDetailsPage'))
const ContactTimelinePage = lazy(() => import('./pages/ContactTimelinePage'))

export class ContactsPlugin extends BasePlugin {
  name = 'contacts'

  register(context: PluginContext): void {
    this.registerTranslations({ en, ru }, context.i18n)
    const { routeRegistry, sidebarRegistry } = context

    // 1. Register Routes
    routeRegistry.register('main', {
      path: '/contacts',
      element: (
        <PluginErrorBoundary pluginId="contacts">
          <Suspense fallback={<PageLoader />}>
            <ContactsPage />
          </Suspense>
        </PluginErrorBoundary>
      ),
    })

    routeRegistry.register('main', {
      path: '/contacts/:id',
      element: (
        <PluginErrorBoundary pluginId="contacts">
          <Suspense fallback={<PageLoader />}>
            <ContactDetailsPage />
          </Suspense>
        </PluginErrorBoundary>
      ),
    })

    routeRegistry.register('main', {
      path: '/contacts/:id/timeline',
      element: (
        <PluginErrorBoundary pluginId="contacts">
          <Suspense fallback={<PageLoader />}>
            <ContactTimelinePage />
          </Suspense>
        </PluginErrorBoundary>
      ),
    })

    // 2. Register Sidebar Section
    sidebarRegistry.register({
      id: 'contacts',
      component: ContactsSidebarItem,
      order: 10,
    })

    // 3. Register Contact Details Sections
    const contactDetailsRegistry = ContactDetailsRegistry.getInstance()
    contactDetailsRegistry.register({
      id: 'history',
      component: ContactsHistoryCard,
      order: 100,
      layout: 'full-bottom',
    })

    // 4. Register Registry Sections
    registerDefaultContactFormSections()
    registerDefaultContactDetailsSections()

    // 5. Register Dashboard Widget
    widgetRegistry.register({
      id: 'catchUp',
      title: 'Catch Up',
      component: () => (
        <PluginErrorBoundary pluginId="contacts">
          <Suspense fallback={null}>
            <CatchUpWidget />
          </Suspense>
        </PluginErrorBoundary>
      ),
      defaultDimensions: { w: 4, h: 6 },
    })
  }
}
