import { api } from '@/lib/axios'
import i18n from '@/lib/i18n'
import { RouteRegistry } from '@/lib/routing/RouteRegistry'
import { settingsRegistry } from '@/lib/settings/SettingsRegistry'
import { SidebarRegistry } from '@/lib/ui/sidebar/SidebarRegistry'
import { TopMenuRegistry } from '@/lib/ui/topmenu/TopMenuRegistry'
import { UserMenuRegistry } from '@/lib/ui/usermenu/UserMenuRegistry'
import { widgetRegistry } from '@/lib/widgets/WidgetRegistry'

import { loadRemotePlugin } from './RemoteLoader'

import { PLUGIN_MAP } from '@/pluginMap'

export interface PluginConfig {
  id: string
  enabled: boolean
  url?: string
}

export class PluginLoader {
  private static instance: PluginLoader

  private constructor() {
    // Singleton
  }

  public static getInstance(): PluginLoader {
    if (!PluginLoader.instance) {
      PluginLoader.instance = new PluginLoader()
    }
    return PluginLoader.instance
  }

  private async fetchConfig(): Promise<PluginConfig[]> {
    // Mock configuration - simulating backend response
    return Promise.resolve([
      { id: 'dashboard', enabled: true },
      { id: 'contacts', enabled: true },
      { id: 'audit-logs', enabled: true },
      { id: 'contact-graph', enabled: true },
      { id: 'google-import', enabled: true },
      { id: 'groups', enabled: true },
      { id: 'notifications', enabled: true },
      { id: 'sessions', enabled: true },
      { id: 'settings', enabled: true },
      { id: 'user-security', enabled: true },
      {
        id: 'gift-plugin',
        enabled: true,
        url: 'http://localhost:5001/gift-plugin.js',
      },
    ])
  }

  public async init(): Promise<void> {
    try {
      const config = await this.fetchConfig()

      // Prepare context
      const context = {
        routeRegistry: RouteRegistry.getInstance(),
        sidebarRegistry: SidebarRegistry.getInstance(),
        userMenuRegistry: UserMenuRegistry.getInstance(),
        topMenuRegistry: TopMenuRegistry.getInstance(),
        widgetRegistry: widgetRegistry,
        settingsRegistry: settingsRegistry,
        i18n: i18n,
        api: api,
      }

      for (const item of config) {
        if (!item.enabled) {
          continue
        }

        await this.loadPlugin(item, context)
      }
    } catch (error) {
      console.error('[PluginLoader] Failed to initialize plugins', error)
      throw error
    }
  }

  private async loadPlugin(item: PluginConfig, context: any) {
    try {
      let PluginClass

      if (item.url) {
        PluginClass = await loadRemotePlugin(item.url)
      } else {
        const pluginLoader = PLUGIN_MAP[item.id]
        if (pluginLoader) {
          const module = await pluginLoader()
          PluginClass = module.default
        }
      }

      if (PluginClass) {
        const plugin = new PluginClass()
        plugin.register(context)
        // eslint-disable-next-line no-console
        console.log(`[PluginLoader] Registered: ${item.id} `)
      } else {
        console.warn(`[PluginLoader] Plugin not found: ${item.id} `)
      }
    } catch (e) {
      console.error(`[PluginLoader] Failed to load plugin: ${item.id} `, e)
    }
  }
}
