import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { type HydraCollection } from '@/lib/api/hydra'
import { api } from '@/lib/axios'
import { queryKeys } from '@/lib/queryKeys'
import { type NotificationChannel, type NotificationChannelFormValues } from '@/types/models'

export function useNotificationChannels(page = 1) {
  return useQuery({
    queryKey: queryKeys.notificationChannels.list(page),
    queryFn: async () => {
      const response = await api.get<HydraCollection<NotificationChannel>>(
        `/notification_channels?page=${page}`,
      )
      return response.data
    },
  })
}

export function useCreateNotificationChannel() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: NotificationChannelFormValues) => {
      const response = await api.post('/notification_channels', data)
      return response.data
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.notificationChannels.all })
    },
    onError: () => toast.error('Failed to save changes.'),
  })
}

export function useUpdateNotificationChannel() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: NotificationChannelFormValues }) => {
      const url = id.startsWith('/api') ? id.substring(4) : id
      const response = await api.put(url, data)
      return response.data
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.notificationChannels.all })
    },
    onError: () => toast.error('Failed to save changes.'),
  })
}

export function useDeleteNotificationChannel() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const url = id.startsWith('/api') ? id.substring(4) : id
      await api.delete(url)
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.notificationChannels.all })
    },
    onError: () => toast.error('Failed to save changes.'),
  })
}

export function useVerifyNotificationChannel() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string | number) => {
      const url =
        typeof id === 'string' && id.startsWith('/api')
          ? id.substring(4)
          : `/notification_channels/${id}`
      const response = await api.post(`${url}/verify`)
      return response.data
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.notificationChannels.all })
    },
    onError: () => toast.error('Failed to save changes.'),
  })
}
