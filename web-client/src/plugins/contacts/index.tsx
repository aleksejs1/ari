import { lazy, Suspense } from 'react'

import { PageLoader } from '../settings/components/PageLoader'

import { registerDefaultContactFormSections } from './defaults_form'
import { registerDefaultContactDetailsSections } from './details/defaults_details'

import type { Plugin } from '@/lib/core/Plugin'
import { RouteRegistry } from '@/lib/routing/RouteRegistry'

const ContactsPage = lazy(() => import('./pages/ContactsPage'))
const ContactDetailsPage = lazy(() => import('./pages/ContactDetailsPage'))

export class ContactsPlugin implements Plugin {
  name = 'contacts'

  register(): void {
    const routeRegistry = RouteRegistry.getInstance()

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

    // 2. Register Registry Sections
    registerDefaultContactFormSections()
    registerDefaultContactDetailsSections()
  }
}
