import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { api } from '@/lib/axios'
import { queryKeys } from '@/lib/queryKeys'

export interface ContactPlaybook {
  id: number
  preset: string
  goal: string
  whyTags: string[] | null
  whyText: string | null
  status: 'active' | 'paused' | 'archived'
  celebrationPending: boolean
}

export interface PlaybookTemplate {
  preset: string
  goal: string
  title: string
  frequencyDays: number
  taskTypes: string[]
}

export function useContactPlaybook(contactId: string | number) {
  return useQuery<ContactPlaybook | null>({
    queryKey: queryKeys.contacts.playbook(contactId),
    queryFn: async () => {
      // validateStatus: treat 404 as a successful response so the browser
      // does not log a console error for contacts without an active playbook.
      const response = await api.get<ContactPlaybook>(`/contacts/${contactId}/playbook`, {
        validateStatus: (status) => status === 200 || status === 404,
      })
      if (response.status === 404) {
        return null
      }
      return response.data
    },
    staleTime: 30_000,
  })
}

interface HydraCollection<T> {
  'hydra:member'?: T[]
  member?: T[]
}

export function usePlaybookTemplates() {
  return useQuery<PlaybookTemplate[]>({
    queryKey: queryKeys.playbookTemplates,
    queryFn: async () => {
      const response = await api.get<HydraCollection<PlaybookTemplate>>('/playbook_templates')
      return response.data['hydra:member'] ?? response.data.member ?? []
    },
    staleTime: 300_000, // templates rarely change
  })
}

export function useActivatePlaybook(contactId: string | number) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: { preset: string; whyTags?: string[]; whyText?: string | null }) => {
      const response = await api.post<ContactPlaybook>(`/contacts/${contactId}/playbook`, data)
      return response.data
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.contacts.playbook(contactId) })
      void queryClient.invalidateQueries({ queryKey: queryKeys.contacts.tasks(contactId) })
    },
    onError: () => toast.error('Failed to save changes.'),
  })
}

export function useUpdatePlaybook(contactId: string | number) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (
      data: Partial<{
        whyTags: string[] | null
        whyText: string | null
        status: string
        celebrationPending: boolean
      }>,
    ) => {
      const response = await api.patch<ContactPlaybook>(`/contacts/${contactId}/playbook`, data, {
        headers: { 'Content-Type': 'application/merge-patch+json' },
      })
      return response.data
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.contacts.playbook(contactId) })
    },
    onError: () => toast.error('Failed to save changes.'),
  })
}

export function useSaveReflection(contactId: string | number) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ reflectionId, answer }: { reflectionId: number; answer: string }) => {
      const response = await api.patch<{
        id: number
        answer: string | null
        answeredAt: string | null
      }>(
        `/task_reflections/${reflectionId}`,
        { answer },
        { headers: { 'Content-Type': 'application/merge-patch+json' } },
      )
      return response.data
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.contacts.tasks(contactId) })
    },
    onError: () => toast.error('Failed to save changes.'),
  })
}

export function useDeletePlaybook(contactId: string | number) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async () => {
      await api.delete(`/contacts/${contactId}/playbook`)
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.contacts.playbook(contactId) })
      void queryClient.invalidateQueries({ queryKey: queryKeys.contacts.tasks(contactId) })
    },
    onError: () => toast.error('Failed to delete.'),
  })
}
