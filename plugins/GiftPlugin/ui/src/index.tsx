import { lazy, Suspense } from 'react'

import './index.css'

import { BasePlugin } from '@/lib/core/Plugin'
import type { PluginContext } from '@/lib/core/PluginContext'

import { GiftSidebarItem } from './components/GiftSidebarItem'
import { PageLoader } from './components/PageLoader'
import en from './locales/en.json'
import ru from './locales/ru.json'
import { setApi } from './api'

const GiftListsPage = lazy(() => import('./pages/GiftListsPage'))

export default class GiftPlugin extends BasePlugin {
  name = 'gift-plugin'

  register(context: PluginContext): void {
    this.registerTranslations({ en, ru }, context.i18n)
    setApi(context.api)
    const { routeRegistry, sidebarRegistry } = context

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
