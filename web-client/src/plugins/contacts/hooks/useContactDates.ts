import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { createMutation, normalizeIri } from '@/lib/api/createMutation'
import { api } from '@/lib/axios'
import { queryKeys } from '@/lib/queryKeys'
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
      void queryClient.invalidateQueries({ queryKey: queryKeys.contacts.all })
      if (contactId) {
        void queryClient.invalidateQueries({ queryKey: queryKeys.contacts.timeline(contactId) })
      }
    },
    onError: () => toast.error('Failed to save changes.'),
  })
}

export const useUpdateContactDate = createMutation(
  async ({ id, data }: { id: string; data: Partial<ContactDate> }) => {
    // Backend requires PUT (full replace) for contact_dates — PATCH is not supported on this resource.
    const response = await api.put(normalizeIri(id), data)
    return response.data
  },
  {
    invalidateKeys: [queryKeys.contacts.all],
  },
)

export const useDeleteContactDate = createMutation(
  async (id: string) => {
    await api.delete(normalizeIri(id))
  },
  {
    invalidateKeys: [queryKeys.contacts.all],
    onError: () => toast.error('Failed to delete.'),
  },
)
