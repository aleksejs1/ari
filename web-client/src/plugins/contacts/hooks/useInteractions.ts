import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { api } from '@/lib/axios'
import { queryKeys } from '@/lib/queryKeys'
import type { ContactInteraction, NeedsAttentionContact } from '@/types/models'

import type { HydraCollection } from '../utils'

export function useNeedsAttention(limit = 7) {
  return useQuery({
    queryKey: queryKeys.contacts.needsAttention(limit),
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
    queryKey: queryKeys.contacts.needsAttentionPaged(page),
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
      void queryClient.invalidateQueries({ queryKey: queryKeys.contacts.all })
    },
    onError: () => toast.error('Failed to save changes.'),
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
      void queryClient.invalidateQueries({ queryKey: queryKeys.contacts.all })
    },
    onError: () => toast.error('Failed to save changes.'),
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
      void queryClient.invalidateQueries({ queryKey: queryKeys.contacts.all })
    },
    onError: () => toast.error('Failed to delete.'),
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
      void queryClient.invalidateQueries({ queryKey: queryKeys.contacts.all })
    },
    onError: () => toast.error('Failed to save changes.'),
  })
}
