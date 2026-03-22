import { ContactDetailsRegistry } from '@/lib/contacts/details/ContactDetailsRegistry'

import { PlaybookSection } from '../components/PlaybookSection'

import { BiographySection } from './sections/BiographySection'
import { ContactInfoSection } from './sections/ContactInfoSection'
import { ContactNamesSection } from './sections/ContactNamesSection'
import { DatesSection } from './sections/DatesSection'
import { GeneralInfoSection } from './sections/GeneralInfoSection'
import { IdentityNoteSection } from './sections/IdentityNoteSection'
import { InteractionHistorySection } from './sections/InteractionHistorySection'
import { KeepInTouchSection } from './sections/KeepInTouchSection'
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

  // Left column: actionable / relational blocks
  registry.register({
    id: 'upcoming_dates',
    component: UpcomingDatesSection,
    order: 20,
    layout: 'left',
  })

  registry.register({
    id: 'keep_in_touch',
    component: KeepInTouchSection,
    order: 30,
    layout: 'left',
  })

  registry.register({
    id: 'playbook',
    component: PlaybookSection,
    order: 40,
    layout: 'left',
  })

  // Right column: contact data blocks
  registry.register({
    id: 'contact_names',
    component: ContactNamesSection,
    order: 50,
    layout: 'right',
  })

  registry.register({
    id: 'contact_info',
    component: ContactInfoSection,
    order: 60,
    layout: 'right',
  })

  registry.register({
    id: 'professional',
    component: ProfessionalSection,
    order: 70,
    layout: 'right',
  })

  registry.register({
    id: 'dates',
    component: DatesSection,
    order: 80,
    layout: 'right',
  })

  registry.register({
    id: 'biography',
    component: BiographySection,
    order: 90,
    layout: 'right',
  })

  registry.register({
    id: 'relations',
    component: RelationsSection,
    order: 85,
    layout: 'right',
  })

  registry.register({
    id: 'identity_note',
    component: IdentityNoteSection,
    order: 999,
    layout: 'right',
  })

  // Full-width bottom: interaction history
  registry.register({
    id: 'interaction_history',
    component: InteractionHistorySection,
    order: 200,
    layout: 'full-bottom',
  })
}
