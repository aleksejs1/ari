import type { AxiosInstance } from 'axios'
import type { i18n } from 'i18next'

import type { RouteRegistry } from '@/lib/routing/RouteRegistry'
import type { settingsRegistry } from '@/lib/settings/SettingsRegistry'
import type { SidebarRegistry } from '@/lib/ui/sidebar/SidebarRegistry'
import type { UserMenuRegistry } from '@/lib/ui/usermenu/UserMenuRegistry'
import type { layoutPresetRegistry } from '@/lib/widgets/LayoutPresets'
import type { widgetRegistry } from '@/lib/widgets/WidgetRegistry'

export interface PluginContext {
  routeRegistry: RouteRegistry
  sidebarRegistry: SidebarRegistry
  userMenuRegistry: UserMenuRegistry
  widgetRegistry: typeof widgetRegistry
  layoutPresetRegistry: typeof layoutPresetRegistry
  settingsRegistry: typeof settingsRegistry
  i18n: i18n
  api: AxiosInstance
}
