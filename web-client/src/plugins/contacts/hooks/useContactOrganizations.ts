import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { createMutation, normalizeIri } from '@/lib/api/createMutation'
import { api } from '@/lib/axios'
import { queryKeys } from '@/lib/queryKeys'
import type { ContactOrganization } from '@/types/models'

export function useCreateContactOrganization() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (
      data: Omit<Partial<ContactOrganization>, 'contact'> & { contact: string },
    ) => {
      const response = await api.post('/contact_organizations', data)
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

export const useUpdateContactOrganization = createMutation(
  async ({ id, data }: { id: string; data: Partial<ContactOrganization> }) => {
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

export const useDeleteContactOrganization = createMutation(
  async (id: string) => {
    await api.delete(normalizeIri(id))
  },
  {
    invalidateKeys: [queryKeys.contacts.all],
    onError: () => toast.error('Failed to delete.'),
  },
)
