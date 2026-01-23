import { CoreRoutesSection } from './sidebar/sections/CoreRoutesSection'
// Removed IntegrationsRoutesSection import
// Removed NotificationRoutesSection import
// Removed SessionRoutesSection import
import { SettingsRoutesSection } from './sidebar/sections/SettingsRoutesSection'

import { SidebarRegistry } from '@/lib/ui/sidebar/SidebarRegistry'

export function registerDefaultSidebarSections() {
  const registry = SidebarRegistry.getInstance()

  registry.register({
    id: 'core',
    component: CoreRoutesSection,
    order: 10,
  })

  registry.register({
    id: 'settings',
    component: SettingsRoutesSection,
    order: 50,
  })
}
