// Removed IntegrationsRoutesSection import
// Removed NotificationRoutesSection import
// Removed SessionRoutesSection import
import { SidebarRegistry } from '@/lib/ui/sidebar/SidebarRegistry'

import { CoreRoutesSection } from './sidebar/sections/CoreRoutesSection'

export function registerDefaultSidebarSections() {
  const registry = SidebarRegistry.getInstance()

  registry.register({
    id: 'core',
    component: CoreRoutesSection,
    order: 10,
  })
}
