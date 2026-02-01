import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { api } from '@/lib/axios'

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
    queryKey: ['marketplace', 'registry'],
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
    queryKey: ['marketplace', 'readme', pluginId],
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
      void queryClient.invalidateQueries({ queryKey: ['marketplace', 'registry'] })
    },
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
      void queryClient.invalidateQueries({ queryKey: ['marketplace', 'registry'] })
    },
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
      void queryClient.invalidateQueries({ queryKey: ['marketplace', 'registry'] })
    },
  })
}
