import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

import { api } from '@/lib/axios'
import { getHydraMember, type HydraCollection } from '@/plugins/contacts/useContacts'
import type { NotificationPolicy, NotificationPolicyFormValues } from '@/types/models'

export const useNotificationPolicies = () => {
  return useQuery({
    queryKey: ['notification-policies'],
    queryFn: async () => {
      const response = await api.get<{ member: NotificationPolicy[] }>('/notification-policies')
      return response.data.member || []
    },
  })
}

export const useNotificationPolicy = (id: string | undefined) => {
  return useQuery({
    queryKey: ['notification-policies', id],
    queryFn: async () => {
      if (!id) {
        return null
      }
      const response = await api.get<NotificationPolicy>(`/notification-policies/${id}`)
      return response.data
    },
    enabled: !!id,
  })
}

export const useCreateNotificationPolicy = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: NotificationPolicyFormValues) => {
      const response = await api.post<NotificationPolicy>('/notification-policies', data)
      return response.data
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['notification-policies'] })
    },
  })
}

export const useUpdateNotificationPolicy = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string | number
      data: NotificationPolicyFormValues
    }) => {
      const response = await api.put<NotificationPolicy>(`/notification-policies/${id}`, data) // Using PUT or PATCH based on API, usually PUT for full updates or PATCH. User didn't specify, I'll assume PUT/PATCH as in other resources. I'll use PATCH for safer partial updates if supported, or PUT. Let's check other hooks.
      return response.data
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['notification-policies'] })
    },
  })
}

export const useDeleteNotificationPolicy = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string | number) => {
      await api.delete(`/notification-policies/${id}`)
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['notification-policies'] })
    },
  })
}

export const useNotificationPolicyEventTypes = () => {
  return useQuery({
    queryKey: ['notification-policy-event-types'],
    queryFn: async () => {
      const response = await api.get<HydraCollection<{ text: string }>>(
        '/notification-policy/event-types',
      )
      const members = getHydraMember(response.data)
      return members.map((m) => m.text).filter(Boolean)
    },
  })
}
