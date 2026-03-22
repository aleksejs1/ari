import { useQuery } from '@tanstack/react-query'

import { api } from '@/lib/axios'
import { queryKeys } from '@/lib/queryKeys'

export interface ContactDisplayOptions {
  nameLocales: string[]
  phoneTypes: string[]
  emailTypes: string[]
  dateTexts: string[]
}

export function useContactDisplayOptions() {
  return useQuery({
    queryKey: queryKeys.contacts.displayOptions,
    queryFn: async () => {
      const response = await api.get<ContactDisplayOptions>('/contacts/display-options')
      return response.data
    },
    staleTime: 5 * 60 * 1000,
  })
}
