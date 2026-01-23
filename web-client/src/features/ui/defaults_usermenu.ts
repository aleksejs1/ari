import { CoreNavigationSection } from './usermenu/sections/CoreNavigationSection'
import { LogoutSection } from './usermenu/sections/LogoutSection'
import { ThemeSection } from './usermenu/sections/ThemeSection'
import { UserIdentitySection } from './usermenu/sections/UserIdentitySection'

import { UserMenuRegistry } from '@/lib/ui/usermenu/UserMenuRegistry'

export function registerDefaultUserMenuSections() {
  const registry = UserMenuRegistry.getInstance()

  registry.register({
    id: 'identity',
    component: UserIdentitySection,
    order: 10,
  })

  registry.register({
    id: 'core-nav',
    component: CoreNavigationSection,
    order: 20,
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
