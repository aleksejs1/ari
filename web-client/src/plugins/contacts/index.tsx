import { BiographySection } from '@/features/contacts/details/sections/BiographySection'
import { ContactInfoSection } from '@/features/contacts/details/sections/ContactInfoSection'
import { DatesSection } from '@/features/contacts/details/sections/DatesSection'
import { GeneralInfoSection } from '@/features/contacts/details/sections/GeneralInfoSection'
import { ProfessionalSection } from '@/features/contacts/details/sections/ProfessionalSection'
import { RelationsSection } from '@/features/contacts/details/sections/RelationsSection'
import { UpcomingDatesSection } from '@/features/contacts/details/sections/UpcomingDatesSection'
import { ContactDetailsRegistry } from '@/lib/contacts/details/ContactDetailsRegistry'
import type { Plugin } from '@/lib/core/Plugin'

export class ContactsPlugin implements Plugin {
  name = 'contacts'

  register(): void {
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
}
