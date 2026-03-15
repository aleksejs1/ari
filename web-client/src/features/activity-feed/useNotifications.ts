import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { getHydraMember, type HydraCollection } from '@/lib/api/hydra'
import { api } from '@/lib/axios'
import type { ActivityFeed } from '@/types/models'

export function useNotifications(page = 1) {
  return useQuery({
    queryKey: ['notifications', page],
    queryFn: async () => {
      const response = await api.get<HydraCollection<ActivityFeed> | ActivityFeed[]>(
        `/activity-feed?page=${page}`,
      )
      const data = response.data
      if (Array.isArray(data)) {
        return data
      }
      return getHydraMember(data)
    },
    // Refresh every minute
    refetchInterval: 60000,
  })
}

export function useUnreadCount() {
  return useQuery({
    queryKey: ['notifications', 'unread-count'],
    queryFn: async () => {
      const response = await api.get<HydraCollection<ActivityFeed> | number | unknown>(
        '/activity-feed/unread-count',
      )
      return parseUnreadCount(response.data)
    },
    // Refresh every minute
    refetchInterval: 60000,
  })
}

function parseUnreadCount(data: unknown): number {
  if (typeof data === 'number') {
    return data
  }

  if (Array.isArray(data)) {
    return data.length
  }

  if (typeof data === 'object' && data !== null) {
    return parseObjectUnreadCount(data as Record<string, unknown>)
  }

  return getHydraMember(data as HydraCollection<ActivityFeed>).length
}

function parseObjectUnreadCount(d: Record<string, unknown>): number {
  const total = getValueAsNumber(d['totalItems'] ?? d['hydra:totalItems'])
  if (total !== null) {
    return total
  }

  // Check for "count" property (user feedback)
  const count = getValueAsNumber(d['count'])
  if (count !== null) {
    return count
  }

  const member = d['member'] ?? d['hydra:member']
  if (Array.isArray(member)) {
    return member.length
  }

  return 0
}

function getValueAsNumber(value: unknown): number | null {
  if (typeof value === 'number') {
    return value
  }
  if (typeof value === 'string' && !isNaN(Number(value))) {
    return Number(value)
  }
  return null
}

export function useMarkAsRead() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: number) => {
      await api.patch(
        '/activity-feed/read',
        { ids: [id] },
        {
          headers: {
            'Content-Type': 'application/merge-patch+json',
          },
        },
      )
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['notifications'] })
      void queryClient.invalidateQueries({ queryKey: ['notifications', 'unread-count'] })
    },
  })
}
