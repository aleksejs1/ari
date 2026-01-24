import { lazy, Suspense } from 'react'
import { useTranslation } from 'react-i18next'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ContactDetailsRegistry } from '@/lib/contacts/details/ContactDetailsRegistry'
import { BasePlugin } from '@/lib/core/Plugin'
import type { PluginContext } from '@/lib/core/PluginContext'
import { RouteRegistry } from '@/lib/routing/RouteRegistry'
import { TopMenuRegistry } from '@/lib/ui/topmenu/TopMenuRegistry'

import { PageLoader } from '../settings/components/PageLoader'

import { ContactTimeline } from './components/ContactTimeline'
import { registerDefaultContactDetailsSections } from './details/defaults_details'
import { ContactsTopNavSection } from './extensions/ContactsTopNavSection'
import { registerDefaultContactFormSections } from './defaults_form'

const ContactsPage = lazy(() => import('./pages/ContactsPage'))
const ContactDetailsPage = lazy(() => import('./pages/ContactDetailsPage'))
const ContactTimelinePage = lazy(() => import('./pages/ContactTimelinePage'))

import en from './locales/en.json'
import ru from './locales/ru.json'

export class ContactsPlugin extends BasePlugin {
  name = 'contacts'

  register(context: PluginContext): void {
    this.registerTranslations({ en, ru }, context.i18n)
    const routeRegistry = RouteRegistry.getInstance()
    const topMenuRegistry = TopMenuRegistry.getInstance()

    // 1. Register Routes
    routeRegistry.register('sidebar-less', {
      path: '/contacts',
      element: (
        <Suspense fallback={<PageLoader />}>
          <ContactsPage />
        </Suspense>
      ),
    })

    routeRegistry.register('sidebar-less', {
      path: '/contacts/:id',
      element: (
        <Suspense fallback={<PageLoader />}>
          <ContactDetailsPage />
        </Suspense>
      ),
    })

    routeRegistry.register('sidebar-less', {
      path: '/contacts/:id/timeline',
      element: (
        <Suspense fallback={<PageLoader />}>
          <ContactTimelinePage />
        </Suspense>
      ),
    })

    // 3. Register Top Menu Extension
    topMenuRegistry.register({
      id: 'contacts-top',
      component: ContactsTopNavSection,
      order: 10,
    })

    // 4. Register Contact Details Sections
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

    // 5. Register Registry Sections
    registerDefaultContactFormSections()
    registerDefaultContactDetailsSections()
  }
}
