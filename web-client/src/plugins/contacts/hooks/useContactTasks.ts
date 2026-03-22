import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import type { HydraCollection } from '@/lib/api/hydra'
import { api } from '@/lib/axios'
import { queryKeys } from '@/lib/queryKeys'

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

export function todayIso(): string {
  return new Date().toISOString().slice(0, 10)
}

export function useContactTasks(
  contactId: string | number,
  options?: { status?: string | string[]; dueBefore?: string },
) {
  const params = new URLSearchParams()
  params.set('contact', String(contactId))
  if (options?.status) {
    const statuses = Array.isArray(options.status) ? options.status : [options.status]
    statuses.forEach((s) => params.append('status[]', s))
  }
  if (options?.dueBefore) {
    params.set('dueDate[before]', options.dueBefore)
  }

  return useQuery<ContactTask[]>({
    queryKey: [...queryKeys.contacts.tasks(contactId), options],
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
      void queryClient.invalidateQueries({ queryKey: queryKeys.contacts.tasks(contactId) })
      void queryClient.invalidateQueries({ queryKey: queryKeys.contacts.playbook(contactId) })
      void queryClient.invalidateQueries({ queryKey: queryKeys.contacts.detail(String(contactId)) })
    },
    onError: () => toast.error('Failed to update task.'),
  })
}
