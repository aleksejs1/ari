import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { api } from '@/lib/axios'

interface AvailablePlugin {
  pluginId: string
  name: string
  title: string
  description: string
  version: string
  enabled: boolean
}

export const useUserPlugins = () => {
  return useQuery({
    queryKey: ['user-plugins'],
    queryFn: async () => {
      const response = await api.get<AvailablePlugin[]>('/user-plugins/available')
      return response.data
    },
  })
}

import { useReload } from '@/contexts/ReloadContext'

// ... existing imports ...

export const useActivatePlugin = () => {
  const queryClient = useQueryClient()
  const { setReloadNeeded } = useReload()

  return useMutation({
    mutationFn: async (pluginId: string) => {
      await api.post('/user-plugins/activate', { pluginId })
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['user-plugins'] })
      await queryClient.invalidateQueries({ queryKey: ['plugins'] }) // Refresh global plugin list
      setReloadNeeded(true)
    },
  })
}

export const useDeactivatePlugin = () => {
  const queryClient = useQueryClient()
  const { setReloadNeeded } = useReload()

  return useMutation({
    mutationFn: async (pluginId: string) => {
      await api.post('/user-plugins/deactivate', { pluginId })
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['user-plugins'] })
      await queryClient.invalidateQueries({ queryKey: ['plugins'] }) // Refresh global plugin list
      setReloadNeeded(true)
    },
  })
}
