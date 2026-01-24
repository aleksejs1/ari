import type { AxiosInstance } from 'axios'
import type { i18n } from 'i18next'

import type { RouteRegistry } from '@/lib/routing/RouteRegistry'
import type { settingsRegistry } from '@/lib/settings/SettingsRegistry'
import type { SidebarRegistry } from '@/lib/ui/sidebar/SidebarRegistry'
import type { TopMenuRegistry } from '@/lib/ui/topmenu/TopMenuRegistry'
import type { UserMenuRegistry } from '@/lib/ui/usermenu/UserMenuRegistry'
import type { widgetRegistry } from '@/lib/widgets/WidgetRegistry'

export interface PluginContext {
  routeRegistry: RouteRegistry
  sidebarRegistry: SidebarRegistry
  userMenuRegistry: UserMenuRegistry
  topMenuRegistry: TopMenuRegistry
  widgetRegistry: typeof widgetRegistry
  settingsRegistry: typeof settingsRegistry
  i18n: i18n
  api: AxiosInstance
}
