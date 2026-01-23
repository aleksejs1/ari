import { useMutation, useQueryClient } from '@tanstack/react-query'

import { api } from '@/lib/axios'
import type { ContactEmailAdress } from '@/types/models'

export function useCreateContactEmail() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (
      data: Omit<Partial<ContactEmailAdress>, 'contact'> & { contact: string },
    ) => {
      const response = await api.post('/contact_email_adresses', data)
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

export function useUpdateContactEmail() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<ContactEmailAdress> }) => {
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

export function useDeleteContactEmail() {
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
