import { useMutation, useQueryClient } from '@tanstack/react-query'

import { api } from '@/lib/axios'

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
      void queryClient.invalidateQueries({ queryKey: ['contacts', contactId] })
      if (relatedId) {
        void queryClient.invalidateQueries({ queryKey: ['contacts', relatedId] })
      }
    },
  })
}
