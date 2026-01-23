import { ContactDetailsRegistry } from '@/lib/contacts/details/ContactDetailsRegistry'

import { BiographySection } from './sections/BiographySection'
import { ContactInfoSection } from './sections/ContactInfoSection'
import { DatesSection } from './sections/DatesSection'
import { GeneralInfoSection } from './sections/GeneralInfoSection'
import { ProfessionalSection } from './sections/ProfessionalSection'
import { RelationsSection } from './sections/RelationsSection'
import { UpcomingDatesSection } from './sections/UpcomingDatesSection'

export function registerDefaultContactDetailsSections() {
  const registry = ContactDetailsRegistry.getInstance()

  registry.register({
    id: 'general_info',
    component: GeneralInfoSection,
    order: 10,
    layout: 'full',
  })

  registry.register({
    id: 'contact_info',
    component: ContactInfoSection,
    order: 20,
    layout: 'half',
  })

  registry.register({
    id: 'professional',
    component: ProfessionalSection,
    order: 30,
    layout: 'half',
  })

  registry.register({
    id: 'dates',
    component: DatesSection,
    order: 40,
    layout: 'half',
  })

  registry.register({
    id: 'upcoming_dates',
    component: UpcomingDatesSection,
    order: 50,
    layout: 'half',
  })

  registry.register({
    id: 'relations',
    component: RelationsSection,
    order: 60,
    layout: 'half',
  })

  registry.register({
    id: 'biography',
    component: BiographySection,
    order: 70,
    layout: 'full',
  })
}
