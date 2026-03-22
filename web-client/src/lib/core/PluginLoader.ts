import { api, API_ORIGIN } from '@/lib/axios'
import i18n from '@/lib/i18n'
import { RouteRegistry } from '@/lib/routing/RouteRegistry'
import { settingsRegistry } from '@/lib/settings/SettingsRegistry'
import { SidebarRegistry } from '@/lib/ui/sidebar/SidebarRegistry'
import { UserMenuRegistry } from '@/lib/ui/usermenu/UserMenuRegistry'
import { layoutPresetRegistry } from '@/lib/widgets/LayoutPresets'
import { widgetRegistry } from '@/lib/widgets/WidgetRegistry'

import type { PluginContext } from './PluginContext'
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
    const corePlugins: PluginConfig[] = Object.keys(PLUGIN_MAP).map((id) => ({
      id,
      enabled: true,
    }))

    try {
      const response = await api.get('/plugins')
      const data = response.data

      // eslint-disable-next-line no-console
      console.debug('[PluginLoader] Raw config:', data)

      let remotePlugins: PluginConfig[] = []
      if (Array.isArray(data)) {
        remotePlugins = data
      } else if (data && typeof data === 'object' && Array.isArray(data.plugins)) {
        remotePlugins = data.plugins
      }

      return [...corePlugins, ...remotePlugins]
    } catch (error) {
      console.error('[PluginLoader] Failed to fetch plugin config', error)
      return corePlugins
    }
  }

  public async init(): Promise<void> {
    try {
      const config = await this.fetchConfig()

      // Prepare context
      const context = {
        routeRegistry: RouteRegistry.getInstance(),
        sidebarRegistry: SidebarRegistry.getInstance(),
        userMenuRegistry: UserMenuRegistry.getInstance(),
        widgetRegistry: widgetRegistry,
        layoutPresetRegistry: layoutPresetRegistry,
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

  /**
   * Validates that a remote plugin URL belongs to the same origin as the API server.
   * Relative URLs (no http prefix) are always allowed — they are same-origin by construction.
   * Absolute URLs from external origins are blocked to prevent supply-chain attacks.
   *
   * NOTE (security): even same-origin plugins receive the full authenticated `api` client
   * in their PluginContext. This is an intentional trade-off for internal plugins; remote
   * plugins from untrusted third-party origins must never be loaded.
   */
  private isPluginUrlAllowed(url: string): boolean {
    if (!url.startsWith('http')) {
      // Relative URL — will be resolved against API_ORIGIN, which is same-origin
      return true
    }
    try {
      const pluginOrigin = new URL(url).origin
      const allowedOrigin = API_ORIGIN ? new URL(API_ORIGIN).origin : window.location.origin
      return pluginOrigin === allowedOrigin
    } catch {
      return false
    }
  }

  private async loadPlugin(item: PluginConfig, context: PluginContext) {
    try {
      let PluginClass

      if (item.url) {
        const url = item.url.startsWith('http') ? item.url : `${API_ORIGIN}${item.url}`

        if (!this.isPluginUrlAllowed(url)) {
          console.error(
            `[PluginLoader] Blocked remote plugin from untrusted origin: ${item.id} (${url})`,
          )
          return
        }

        // eslint-disable-next-line no-console
        console.debug(`[PluginLoader] Loading remote plugin: ${item.id} from ${url}`)
        PluginClass = await loadRemotePlugin(url)
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
