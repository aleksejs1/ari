import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

import { getHydraMember, type HydraCollection } from '../contacts/useContacts'

import { api } from '@/lib/axios'
import { type Group } from '@/types/models'

export function useGroups(
  params: Record<string, string | number | boolean> = { 'order[name]': 'asc' },
) {
  return useQuery({
    queryKey: ['groups', params],
    queryFn: async () => {
      const response = await api.get<HydraCollection<Group>>('/groups', { params })
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
      void queryClient.invalidateQueries({ queryKey: ['groups'] })
    },
  })
}

export function useUpdateGroup() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, data }: { id: string | number; data: Partial<Group> }) => {
      const url =
        typeof id === 'string' && id.startsWith('/api') ? id.substring(4) : `/groups/${id}`
      const response = await api.put<Group>(url, data)
      return response.data
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['groups'] })
    },
  })
}

export function useDeleteGroup() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string | number) => {
      const url =
        typeof id === 'string' && id.startsWith('/api') ? id.substring(4) : `/groups/${id}`
      await api.delete(url)
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['groups'] })
    },
  })
}
