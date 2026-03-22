import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { createMutation, normalizeIri } from '@/lib/api/createMutation'
import { api } from '@/lib/axios'
import { queryKeys } from '@/lib/queryKeys'
import type { ContactPhoneNumber } from '@/types/models'

export function useCreateContactPhone() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (
      data: Omit<Partial<ContactPhoneNumber>, 'contact'> & { contact: string },
    ) => {
      const response = await api.post('/contact_phone_numbers', data)
      return response.data
    },
    onSuccess: (_, variables) => {
      const contactId = variables.contact.split('/').pop()
      void queryClient.invalidateQueries({ queryKey: queryKeys.contacts.all })
      if (contactId) {
        void queryClient.invalidateQueries({ queryKey: queryKeys.contacts.detail(contactId) })
      }
    },
    onError: () => toast.error('Failed to save changes.'),
  })
}

export const useUpdateContactPhone = createMutation(
  async ({ id, data }: { id: string; data: Partial<ContactPhoneNumber> }) => {
    const response = await api.patch(normalizeIri(id), data, {
      headers: {
        'Content-Type': 'application/merge-patch+json',
      },
    })
    return response.data
  },
  {
    invalidateKeys: [queryKeys.contacts.all],
  },
)

export const useDeleteContactPhone = createMutation(
  async (id: string) => {
    await api.delete(normalizeIri(id))
  },
  {
    invalidateKeys: [queryKeys.contacts.all],
    onError: () => toast.error('Failed to delete.'),
  },
)
