import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { api } from '@/lib/axios'
import { queryKeys } from '@/lib/queryKeys'

export function useCreateContactRelation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: { contact: string; relatedContact: string; type: string }) => {
      const response = await api.post('/contact_relations', data)
      return response.data
    },
    onSuccess: (_, variables) => {
      const contactId = variables.contact.split('/').pop()
      const relatedId = variables.relatedContact.split('/').pop()
      void queryClient.invalidateQueries({ queryKey: queryKeys.contacts.all })
      if (contactId) {
        void queryClient.invalidateQueries({ queryKey: queryKeys.contacts.detail(contactId) })
      }
      if (relatedId) {
        void queryClient.invalidateQueries({ queryKey: queryKeys.contacts.detail(relatedId) })
      }
    },
    onError: () => toast.error('Failed to save changes.'),
  })
}
