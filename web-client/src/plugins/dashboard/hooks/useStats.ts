import { useQuery } from '@tanstack/react-query'

import { api } from '@/lib/axios'
import { queryKeys } from '@/lib/queryKeys'
import type { Stats } from '@/types/models'

export function useStats() {
  return useQuery({
    queryKey: queryKeys.stats,
    queryFn: async () => {
      const response = await api.get<Stats>('/stats')
      return response.data
    },
    staleTime: 60000, // 1 minute
  })
}
