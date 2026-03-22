import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { api } from '@/lib/axios'
import { queryKeys } from '@/lib/queryKeys'
import type { Group } from '@/types/models'

import { getHydraMember, type HydraCollection } from '../utils'

export function useGroups() {
  return useQuery({
    queryKey: queryKeys.groups.all,
    queryFn: async () => {
      const response = await api.get<HydraCollection<Group>>('/groups')
      return getHydraMember(response.data)
    },
  })
}

export function useCreateGroup() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: Partial<Group>) => {
      const response = await api.post<Group>('/groups', data)
      return response.data
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.groups.all })
    },
    onError: () => toast.error('Failed to save changes.'),
  })
}

export function useUpdateContactGroups() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ contactId, groupIds }: { contactId: string; groupIds: string[] }) => {
      const url = contactId.startsWith('/api') ? contactId.substring(4) : contactId

      const response = await api.patch(
        url,
        {
          contactGroups: groupIds.map((id) => ({ groupResource: id })) as any,
        },
        {
          headers: {
            'Content-Type': 'application/merge-patch+json',
          },
        },
      )
      return response.data
    },
    onSuccess: (_, variables) => {
      const id = variables.contactId.split('/').pop()
      void queryClient.invalidateQueries({ queryKey: queryKeys.contacts.all })
      if (id) {
        void queryClient.invalidateQueries({ queryKey: queryKeys.contacts.detail(id) })
      }
    },
    onError: () => toast.error('Failed to save changes.'),
  })
}
