import { useMutation, useQueryClient } from '@tanstack/react-query'

import { api } from '@/lib/axios'
import type { ContactDate } from '@/types/models'

export function useCreateContactDate() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: Omit<Partial<ContactDate>, 'contact'> & { contact: string }) => {
      const response = await api.post('/contact_dates', data)
      return response.data
    },
    onSuccess: (_, variables) => {
      const contactId = variables.contact.split('/').pop()
      void queryClient.invalidateQueries({ queryKey: ['contacts'] })
      if (contactId) {
        void queryClient.invalidateQueries({ queryKey: ['contacts', contactId, 'timeline'] })
      }
    },
  })
}

export function useUpdateContactDate() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<ContactDate> }) => {
      const url = id.startsWith('/api') ? id.substring(4) : id
      const response = await api.put(url, data)
      return response.data
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['contacts'] })
    },
  })
}

// eslint-disable-next-line sonarjs/no-identical-functions
export function useDeleteContactDate() {
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
