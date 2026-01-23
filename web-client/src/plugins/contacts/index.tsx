import { lazy, Suspense } from 'react'
import { useTranslation } from 'react-i18next'

import { PageLoader } from '../settings/components/PageLoader'

import { ContactTimeline } from './components/ContactTimeline'
import { registerDefaultContactFormSections } from './defaults_form'
import { registerDefaultContactDetailsSections } from './details/defaults_details'
import { ContactsTopNavSection } from './extensions/ContactsTopNavSection'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ContactDetailsRegistry } from '@/lib/contacts/details/ContactDetailsRegistry'
import type { Plugin } from '@/lib/core/Plugin'
import { RouteRegistry } from '@/lib/routing/RouteRegistry'
import { TopMenuRegistry } from '@/lib/ui/topmenu/TopMenuRegistry'

const ContactsPage = lazy(() => import('./pages/ContactsPage'))
const ContactDetailsPage = lazy(() => import('./pages/ContactDetailsPage'))
const ContactTimelinePage = lazy(() => import('./pages/ContactTimelinePage'))

export class ContactsPlugin implements Plugin {
  name = 'contacts'

  register(): void {
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
        const { t } = useTranslation()

        return (
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>{t('contacts.history.title')}</CardTitle>
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
