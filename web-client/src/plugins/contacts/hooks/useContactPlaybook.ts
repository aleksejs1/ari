import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { api } from '@/lib/axios'

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
    queryKey: ['contacts', String(contactId), 'playbook'],
    queryFn: async () => {
      try {
        const response = await api.get<ContactPlaybook>(`/contacts/${contactId}/playbook`)
        return response.data
      } catch (error: unknown) {
        if (
          error !== null &&
          typeof error === 'object' &&
          'response' in error &&
          error.response !== null &&
          typeof error.response === 'object' &&
          'status' in error.response &&
          error.response.status === 404
        ) {
          return null
        }
        throw error
      }
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
    queryKey: ['playbook_templates'],
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
      void queryClient.invalidateQueries({ queryKey: ['contacts', String(contactId), 'playbook'] })
      void queryClient.invalidateQueries({ queryKey: ['contacts', String(contactId), 'tasks'] })
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
      void queryClient.invalidateQueries({ queryKey: ['contacts', String(contactId), 'playbook'] })
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
      void queryClient.invalidateQueries({ queryKey: ['contacts', String(contactId), 'tasks'] })
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
      void queryClient.invalidateQueries({ queryKey: ['contacts', String(contactId), 'playbook'] })
      void queryClient.invalidateQueries({ queryKey: ['contacts', String(contactId), 'tasks'] })
    },
    onError: () => toast.error('Failed to delete.'),
  })
}
