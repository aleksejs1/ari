import './index.css'

import { BasePlugin, type PluginContext, setSdkApi } from '@ari/plugin-sdk'
import { lazy, Suspense } from 'react'

import { GiftTopMenuItem } from './components/GiftTopMenuItem'
import { PageLoader } from './components/PageLoader'
import en from './locales/en.json'
import ru from './locales/ru.json'

const GiftListsPage = lazy(() => import('./pages/GiftListsPage'))

export default class GiftPlugin extends BasePlugin {
  name = 'gift-plugin'

  register(context: PluginContext): void {
    setSdkApi(context.api)
    context.i18n.addResourceBundle('en', 'gift-plugin', en)
    context.i18n.addResourceBundle('ru', 'gift-plugin', ru)

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
