import './index.css'

import { BasePlugin, type PluginContext } from '@ari/plugin-sdk'
import { lazy, Suspense } from 'react'

import { setApi } from './api'
import { GiftTopMenuItem } from './components/GiftTopMenuItem'
import { PageLoader } from './components/PageLoader'
import en from './locales/en.json'
import ru from './locales/ru.json'

const GiftListsPage = lazy(() => import('./pages/GiftListsPage'))

export default class GiftPlugin extends BasePlugin {
  name = 'gift-plugin'

  register(context: PluginContext): void {
    this.registerTranslations({ en, ru }, context.i18n)
    setApi(context.api)
    const { routeRegistry } = context

    // 1. Register Routes
    routeRegistry.register('sidebar-less', {
      path: '/gift-lists',
      element: (
        <Suspense fallback={<PageLoader />}>
          <GiftListsPage />
        </Suspense>
      ),
    })

    // 2. Register Top Menu Section
    const { topMenuRegistry } = context
    if (topMenuRegistry) {
      topMenuRegistry.register({
        id: 'gifts',
        component: GiftTopMenuItem,
        order: 10,
      })
    }
  }
}
