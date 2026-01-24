import { lazy, Suspense } from 'react'

import { BasePlugin } from '@/lib/core/Plugin'
import { RouteRegistry } from '@/lib/routing/RouteRegistry'
import { SidebarRegistry } from '@/lib/ui/sidebar/SidebarRegistry'

import { GiftSidebarItem } from './components/GiftSidebarItem'
import { PageLoader } from './components/PageLoader'
import en from './locales/en.json'
import ru from './locales/ru.json'

const GiftListsPage = lazy(() => import('./pages/GiftListsPage'))

export class GiftPlugin extends BasePlugin {
  name = 'gift-plugin'

  register(): void {
    this.registerTranslations({ en, ru })
    const routeRegistry = RouteRegistry.getInstance()
    const sidebarRegistry = SidebarRegistry.getInstance()

    // 1. Register Routes
    routeRegistry.register('dashboard', {
      path: '/gift-lists',
      element: (
        <Suspense fallback={<PageLoader />}>
          <GiftListsPage />
        </Suspense>
      ),
    })

    // 2. Register Sidebar Section
    sidebarRegistry.register({
      id: 'gifts',
      component: GiftSidebarItem,
      order: 60, // After contacts
    })
  }
}
