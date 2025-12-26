import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

import { type HydraCollection } from '../contacts/useContacts'

import { api } from '@/lib/axios'
import { type NotificationChannel, type NotificationChannelFormValues } from '@/types/models'

export function useNotificationChannels(page = 1) {
  return useQuery({
    queryKey: ['notification-channels', page],
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
      queryClient.invalidateQueries({ queryKey: ['notification-channels'] })
    },
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
      queryClient.invalidateQueries({ queryKey: ['notification-channels'] })
    },
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
      queryClient.invalidateQueries({ queryKey: ['notification-channels'] })
    },
  })
}
