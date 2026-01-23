import { useMutation, useQueryClient } from '@tanstack/react-query'

import { api } from '@/lib/axios'
import type { ContactName } from '@/types/models'

export function useCreateContactName() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: Omit<Partial<ContactName>, 'contact'> & { contact: string }) => {
      const response = await api.post('/contact_names', data)
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

export function useUpdateContactName() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<ContactName> }) => {
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

export function useDeleteContactName() {
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
