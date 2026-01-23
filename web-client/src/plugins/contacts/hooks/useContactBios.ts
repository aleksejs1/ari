import { useMutation, useQueryClient } from '@tanstack/react-query'

import { api } from '@/lib/axios'
import type { ContactBiography } from '@/types/models'

export function useCreateContactBiography() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: Omit<Partial<ContactBiography>, 'contact'> & { contact: string }) => {
      const response = await api.post('/contact_biographies', data)
      return response.data
    },
    onSuccess: (_, variables) => {
      const contactId = variables.contact.split('/').pop()
      void queryClient.invalidateQueries({ queryKey: ['contacts'] })
      if (contactId) {
        void queryClient.invalidateQueries({ queryKey: ['contacts', contactId] })
      }
    },
  })
}

export function useUpdateContactBiography() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<ContactBiography> }) => {
      const url = id.startsWith('/api') ? id.substring(4) : id
      const response = await api.patch(url, data, {
        headers: {
          'Content-Type': 'application/merge-patch+json',
        },
      })
      return response.data
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['contacts'] })
    },
  })
}

export function useDeleteContactBiography() {
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
