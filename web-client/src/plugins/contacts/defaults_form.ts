import { ContactFormRegistry } from '@/lib/contacts/form/ContactFormRegistry'

import { ContactFormAddress } from './components/ContactFormAddress'
import { ContactFormBiography } from './components/ContactFormBiography'
import { ContactFormEmail } from './components/ContactFormEmail'
import { ContactFormNames } from './components/ContactFormNames'
import { ContactFormOrganization } from './components/ContactFormOrganization'
import { ContactFormPhone } from './components/ContactFormPhone'
import { ContactFormRelations } from './components/ContactFormRelations'
import { ContactFormSync } from './components/ContactFormSync'
import { AvatarSection } from './form/sections/AvatarSection'
import { GroupsSection } from './form/sections/GroupsSection'

export function registerDefaultContactFormSections() {
  const registry = ContactFormRegistry.getInstance()

  registry.register({
    id: 'avatar',
    component: AvatarSection,
    order: 10,
  })

  registry.register({
    id: 'names',
    component: ContactFormNames,
    order: 20,
  })

  registry.register({
    id: 'phone',
    component: ContactFormPhone,
    order: 30,
  })

  registry.register({
    id: 'email',
    component: ContactFormEmail,
    order: 40,
  })

  registry.register({
    id: 'address',
    component: ContactFormAddress,
    order: 50,
  })

  registry.register({
    id: 'biography',
    component: ContactFormBiography,
    order: 60,
  })

  registry.register({
    id: 'organization',
    component: ContactFormOrganization,
    order: 70,
  })

  registry.register({
    id: 'relations',
    component: ContactFormRelations,
    order: 80,
  })

  registry.register({
    id: 'sync',
    component: ContactFormSync,
    order: 90,
  })

  registry.register({
    id: 'groups',
    component: GroupsSection,
    order: 100,
  })
}
