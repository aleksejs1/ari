import { UserMenuRegistry } from '@/lib/ui/usermenu/UserMenuRegistry'

import { LogoutSection } from './usermenu/sections/LogoutSection'
import { ThemeSection } from './usermenu/sections/ThemeSection'
import { UserIdentitySection } from './usermenu/sections/UserIdentitySection'

export function registerDefaultUserMenuSections() {
  const registry = UserMenuRegistry.getInstance()

  registry.register({
    id: 'identity',
    component: UserIdentitySection,
    order: 10,
  })

  registry.register({
    id: 'theme',
    component: ThemeSection,
    order: 30,
  })

  registry.register({
    id: 'logout',
    component: LogoutSection,
    order: 100,
  })
}
