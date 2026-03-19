import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import type { HydraCollection } from '@/lib/api/hydra'
import { api } from '@/lib/axios'

export interface TaskReflection {
  id: number
  question: string
  answer: string | null
  answeredAt: string | null
}

export interface ContactTask {
  id: number
  contactId: number
  contactDisplayName: string | null
  type: string
  seriesKey: string
  isOffline: boolean
  dueDate: string | null
  status: 'pending' | 'completed' | 'snoozed' | 'archived' | 'paused' | 'awaiting_reflection'
  snoozedUntil: string | null
  reflectionDueAt: string | null
  completedAt: string | null
  createdAt: string
  reflection: TaskReflection | null
}

export function useContactTasks(
  contactId: string | number,
  options?: { status?: string | string[] },
) {
  const params = new URLSearchParams()
  params.set('contact', String(contactId))
  if (options?.status) {
    const statuses = Array.isArray(options.status) ? options.status : [options.status]
    statuses.forEach((s) => params.append('status[]', s))
  }

  return useQuery<ContactTask[]>({
    queryKey: ['contacts', String(contactId), 'tasks', options],
    queryFn: async () => {
      const response = await api.get<HydraCollection<ContactTask>>(
        `/contact_tasks?${params.toString()}`,
      )
      return response.data['member'] ?? []
    },
    staleTime: 30_000,
  })
}

export function useUpdateTask(contactId: string | number) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({
      taskId,
      data,
    }: {
      taskId: number
      data: { status: string; snoozedUntil?: string }
    }) => {
      const response = await api.patch<ContactTask>(`/contact_tasks/${taskId}`, data, {
        headers: { 'Content-Type': 'application/merge-patch+json' },
      })
      return response.data
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['contacts', String(contactId), 'tasks'] })
    },
  })
}
