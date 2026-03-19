import { useQuery } from '@tanstack/react-query'

import { api } from '@/lib/axios'

export interface ContactReciprocity {
  id: number
  me: number
  them: number
  days: number
}

export function useContactReciprocity(contactId: string | number) {
  return useQuery<ContactReciprocity>({
    queryKey: ['contacts', String(contactId), 'reciprocity'],
    queryFn: async () => {
      const response = await api.get<ContactReciprocity>(`/contacts/${contactId}/reciprocity`)
      return response.data
    },
    staleTime: 60_000,
  })
}
