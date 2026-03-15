import { useQuery } from '@tanstack/react-query'

import { api } from '@/lib/axios'

export interface ContactDisplayOptions {
  nameLocales: string[]
  phoneTypes: string[]
  emailTypes: string[]
  dateTexts: string[]
}

export function useContactDisplayOptions() {
  return useQuery({
    queryKey: ['contacts', 'display-options'],
    queryFn: async () => {
      const response = await api.get<ContactDisplayOptions>('/contacts/display-options')
      return response.data
    },
    staleTime: 5 * 60 * 1000,
  })
}
