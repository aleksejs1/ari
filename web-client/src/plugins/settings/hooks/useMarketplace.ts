import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { api } from '@/lib/axios'
import { queryKeys } from '@/lib/queryKeys'

import type {
  MarketplaceActionResponse,
  MarketplaceRegistry,
  PluginReadmeResponse,
} from '../types/marketplace'

const jsonHeaders = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
}

export function useMarketplaceRegistry() {
  return useQuery({
    queryKey: queryKeys.marketplace.registry,
    queryFn: async () => {
      const response = await api.get<MarketplaceRegistry>('/marketplace/registry', {
        headers: jsonHeaders,
      })
      return response.data
    },
  })
}

export function usePluginReadme(pluginId: string | null) {
  return useQuery({
    queryKey: queryKeys.marketplace.readme(pluginId ?? ''),
    queryFn: async () => {
      const response = await api.get<PluginReadmeResponse>(`/marketplace/readme/${pluginId}`, {
        headers: jsonHeaders,
      })
      return response.data
    },
    enabled: !!pluginId,
  })
}

export function useInstallPlugin() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (pluginId: string) => {
      const response = await api.post<MarketplaceActionResponse>(
        '/marketplace/install',
        { pluginId },
        { headers: jsonHeaders },
      )
      return response.data
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.marketplace.registry })
    },
    onError: () => toast.error('Failed to install plugin.'),
  })
}

export function useUpdatePlugin() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (pluginId: string) => {
      const response = await api.post<MarketplaceActionResponse>(
        '/marketplace/update',
        { pluginId },
        { headers: jsonHeaders },
      )
      return response.data
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.marketplace.registry })
    },
    onError: () => toast.error('Failed to update plugin.'),
  })
}

export function useUninstallPlugin() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (pluginId: string) => {
      const response = await api.post<MarketplaceActionResponse>(
        '/marketplace/uninstall',
        { pluginId },
        { headers: jsonHeaders },
      )
      return response.data
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.marketplace.registry })
    },
    onError: () => toast.error('Failed to uninstall plugin.'),
  })
}
