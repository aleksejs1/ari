import { useQuery } from '@tanstack/react-query'

import { api } from '@/lib/axios'

import type { EntitlementSnapshot } from './types'

export const ENTITLEMENTS_QUERY_KEY = ['entitlements'] as const

export function useEntitlements() {
  return useQuery({
    queryKey: ENTITLEMENTS_QUERY_KEY,
    queryFn: async () => {
      const response = await api.get<EntitlementSnapshot>('/entitlements')
      return response.data
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}
