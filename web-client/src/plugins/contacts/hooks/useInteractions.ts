import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { api } from '@/lib/axios'
import type { ContactInteraction, NeedsAttentionContact } from '@/types/models'

import type { HydraCollection } from '../utils'

export function useNeedsAttention(limit = 7) {
  return useQuery({
    queryKey: ['contacts', 'needsAttention', limit],
    queryFn: async () => {
      const response = await api.get<HydraCollection<NeedsAttentionContact>>(
        `/contacts/needs-attention?limit=${limit}`,
      )
      return response.data['member'] ?? []
    },
    staleTime: 60_000,
  })
}

export function useNeedsAttentionPaged(page = 1, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: ['contacts', 'needsAttention', 'paged', page],
    queryFn: async () => {
      const response = await api.get<HydraCollection<NeedsAttentionContact>>(
        `/contacts/needs-attention?page=${page}`,
      )
      return response.data
    },
    placeholderData: (previousData) => previousData,
    staleTime: 60_000,
    ...(options?.enabled !== undefined ? { enabled: options.enabled } : {}),
  })
}

export function useCreateInteraction() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (
      data: Omit<ContactInteraction, '@id' | '@type' | 'createdAt'> & { contact: string },
    ) => {
      const response = await api.post<ContactInteraction>('/contact_interactions', data)
      return response.data
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['contacts'] })
    },
  })
}

export function useUpdateInteraction() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<ContactInteraction> }) => {
      const url = id.startsWith('/api') ? id.substring(4) : id
      const response = await api.patch<ContactInteraction>(url, data, {
        headers: { 'Content-Type': 'application/merge-patch+json' },
      })
      return response.data
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['contacts'] })
    },
  })
}

export function useDeleteInteraction() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const url = id.startsWith('/api') ? id.substring(4) : id
      await api.delete(url)
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['contacts'] })
    },
  })
}

export function useUpdateContactCadence() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, cadenceDays }: { id: string; cadenceDays: number | null }) => {
      const url = id.startsWith('/api') ? id.substring(4) : id
      const response = await api.patch(
        url,
        { cadenceDays },
        {
          headers: { 'Content-Type': 'application/merge-patch+json' },
        },
      )
      return response.data
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['contacts'] })
    },
  })
}
