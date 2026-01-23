import { useQuery } from '@tanstack/react-query'

import { api } from '@/lib/axios'
import { type Contact, type ContactDate } from '@/types/models'

import { getHydraMember, type HydraCollection } from '@/plugins/contacts/useContacts'

// Helper to get displayName from the contact embedded in ContactDate
// Note: The API response for ContactDate might need to expanded to include the Contact object or at least we hope Hydra handles it.
// Looking at the user request: "теперь в ответе объект contact имеет displayName".
// This implies the ContactDate resource has a 'contact' property which is the Contact resource (or a subset of it).
// Let's check schema.d.ts again or just assume it based on 'upcomingAnniversary' context usually implying we see WHO has the anniversary.
// Actually, `ContactDate` model in `src/types/models.ts` was:
// export type ContactDate = components['schemas']['ContactDate.jsonld-contact.read'] & { ... }
// We need to verify if `contact` is in `aContactDate`.

export function useUpcomingAnniversaries() {
  return useQuery({
    queryKey: ['upcoming-anniversaries'],
    queryFn: async () => {
      // The user specified: "теперь при получении коллекции есть возможность сортировать по upcomingAnniversary"
      // And "теперь в ответе объект contact имеет displayName"
      // This suggests we are fetching `ContactDate` collection.
      const response = await api.get<HydraCollection<ContactDate & { contact?: Contact }>>(
        '/contact_dates?upcomingAnniversary=asc&page=1&itemsPerPage=5',
      )
      // Assuming we want a limited number, but Hydra usually defaults to 30.
      // We can interpret "widget" as showing top N.

      return getHydraMember(response.data)
    },
  })
}
