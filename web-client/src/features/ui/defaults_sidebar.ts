import { CoreRoutesSection } from './sidebar/sections/CoreRoutesSection'
import { DangerZoneSection } from './sidebar/sections/DangerZoneSection'
import { IntegrationsRoutesSection } from './sidebar/sections/IntegrationsRoutesSection'
import { NotificationRoutesSection } from './sidebar/sections/NotificationRoutesSection'
import { SessionRoutesSection } from './sidebar/sections/SessionRoutesSection'
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
    id: 'notifications',
    component: NotificationRoutesSection,
    order: 20,
  })

  registry.register({
    id: 'integrations',
    component: IntegrationsRoutesSection,
    order: 30,
  })

  registry.register({
    id: 'sessions',
    component: SessionRoutesSection,
    order: 40,
  })

  registry.register({
    id: 'settings',
    component: SettingsRoutesSection,
    order: 50,
  })

  registry.register({
    id: 'danger-zone',
    component: DangerZoneSection,
    order: 100,
  })
}
