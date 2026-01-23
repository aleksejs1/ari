import { useQuery } from '@tanstack/react-query'

import { api } from '@/lib/axios'
import type { components } from '@/types/schema'

type Autocomplete = components['schemas']['Autocomplete']

export function useAutocomplete() {
  return useQuery({
    queryKey: ['autocomplete'],
    queryFn: async () => {
      const response = await api.get<Autocomplete>('/autocomplete')
      return response.data
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}
