import { useMutation, useQueryClient } from '@tanstack/react-query'

import { api } from '@/lib/axios'
import type { ContactInteraction } from '@/types/models'

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
