import { lazy, Suspense } from 'react'
import { useTranslation } from 'react-i18next'
import { Users } from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ContactDetailsRegistry } from '@/lib/contacts/details/ContactDetailsRegistry'
import { BasePlugin } from '@/lib/core/Plugin'
import type { PluginContext } from '@/lib/core/PluginContext'
import { widgetRegistry } from '@/lib/widgets/WidgetRegistry'

import { SidebarNavItem } from '@/features/ui/sidebar/SidebarNavItem'

import { PageLoader } from '../settings/components/PageLoader'

import { ContactTimeline } from './components/ContactTimeline'
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
        <Suspense fallback={<PageLoader />}>
          <ContactsPage />
        </Suspense>
      ),
    })

    routeRegistry.register('main', {
      path: '/contacts/:id',
      element: (
        <Suspense fallback={<PageLoader />}>
          <ContactDetailsPage />
        </Suspense>
      ),
    })

    routeRegistry.register('main', {
      path: '/contacts/:id/timeline',
      element: (
        <Suspense fallback={<PageLoader />}>
          <ContactTimelinePage />
        </Suspense>
      ),
    })

    // 2. Register Sidebar Section
    sidebarRegistry.register({
      id: 'contacts',
      component: ({ onNavigate, collapsed }) => {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const { t } = useTranslation('contacts')
        return (
          <SidebarNavItem
            to="/contacts"
            icon={Users}
            label={t('title', 'Contacts')}
            onClick={onNavigate}
            collapsed={collapsed}
          />
        )
      },
      order: 10,
    })

    // 3. Register Contact Details Sections
    const contactDetailsRegistry = ContactDetailsRegistry.getInstance()
    contactDetailsRegistry.register({
      id: 'history',
      component: ({ contact }) => {
        if (!contact.id) {
          return null
        }
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const { t } = useTranslation('contacts')

        return (
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>{t('history.title')}</CardTitle>
            </CardHeader>
            <CardContent>
              <ContactTimeline contactId={contact.id.toString()} />
            </CardContent>
          </Card>
        )
      },
      order: 100,
      layout: 'full',
    })

    // 4. Register Registry Sections
    registerDefaultContactFormSections()
    registerDefaultContactDetailsSections()

    // 5. Register Dashboard Widget
    widgetRegistry.register({
      id: 'catchUp',
      title: 'Catch Up',
      component: () => (
        <Suspense fallback={null}>
          <CatchUpWidget />
        </Suspense>
      ),
      defaultDimensions: { w: 4, h: 6 },
    })
  }
}
