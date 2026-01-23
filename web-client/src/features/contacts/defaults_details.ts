import { BiographySection } from './details/sections/BiographySection'
import { ContactInfoSection } from './details/sections/ContactInfoSection'
import { DatesSection } from './details/sections/DatesSection'
import { GeneralInfoSection } from './details/sections/GeneralInfoSection'
import { ProfessionalSection } from './details/sections/ProfessionalSection'
import { RelationsSection } from './details/sections/RelationsSection'
import { UpcomingDatesSection } from './details/sections/UpcomingDatesSection'

import { ContactDetailsRegistry } from '@/lib/contacts/details/ContactDetailsRegistry'

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
  layout: 'full', // Biography looks better full width, matching the original card class 'md:col-span-2'
})
