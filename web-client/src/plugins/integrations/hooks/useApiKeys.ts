import { useCallback } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { api } from '@/lib/axios'
import { queryKeys } from '@/lib/queryKeys'

import { type AppTypeId, ITEMS_PER_PAGE } from '../constants'

export interface ApiKey {
  id: string
  name: string
  scopes: string[]
  secretLastFour: string
  lastUsedAt: string | null
  lastUsedIp: string | null
  appType: string | null
  createdAt: string
}

export interface ApiKeyCollection {
  member: ApiKey[]
  totalItems: number
}

export function useApiKeys(page: number) {
  const queryClient = useQueryClient()

  const { data, isLoading, isPlaceholderData } = useQuery({
    queryKey: queryKeys.apiKeys.list(page),
    queryFn: async () => {
      const res = await api.get<ApiKeyCollection>(
        `/api_keys?page=${page}&itemsPerPage=${ITEMS_PER_PAGE}`,
      )
      return res.data
    },
    placeholderData: (prev) => prev,
  })

  const keys = data?.member ?? []
  const totalItems = data?.totalItems ?? 0
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE)

  const invalidateKeys = useCallback(() => {
    void queryClient.invalidateQueries({ queryKey: queryKeys.apiKeys.all })
  }, [queryClient])

  const createMutation = useMutation({
    mutationFn: async (payload: { name: string; scopes: string[]; appType: AppTypeId }) => {
      const res = await api.post<ApiKey & { token: string }>('/api_keys', payload)
      return res.data
    },
    onSuccess: invalidateKeys,
    onError: () => toast.error('Failed to create API key.'),
  })

  const updateMutation = useMutation({
    mutationFn: async (payload: { id: string; name: string; scopes: string[] }) => {
      const res = await api.patch<ApiKey>(
        `/api_keys/${payload.id}`,
        { name: payload.name, scopes: payload.scopes },
        { headers: { 'Content-Type': 'application/merge-patch+json' } },
      )
      return res.data
    },
    onSuccess: invalidateKeys,
    onError: () => toast.error('Failed to update API key.'),
  })

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/api_keys/${id}`)
    },
    onSuccess: invalidateKeys,
    onError: () => toast.error('Failed to revoke API key.'),
  })

  return {
    keys,
    totalPages,
    isLoading,
    isPlaceholderData,
    createMutation,
    updateMutation,
    deleteMutation,
  }
}
