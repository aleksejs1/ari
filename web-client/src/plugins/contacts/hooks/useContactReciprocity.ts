import { useQuery } from '@tanstack/react-query'

import { api } from '@/lib/axios'
import { queryKeys } from '@/lib/queryKeys'

export interface ContactReciprocity {
  id: number
  me: number
  them: number
  days: number
}

export function useContactReciprocity(contactId: string | number) {
  return useQuery<ContactReciprocity>({
    queryKey: queryKeys.contacts.reciprocity(contactId),
    queryFn: async () => {
      const response = await api.get<ContactReciprocity>(`/contacts/${contactId}/reciprocity`)
      return response.data
    },
    staleTime: 60_000,
  })
}
