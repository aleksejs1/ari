import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { api } from '@/lib/axios'

interface SystemSetting {
  id: string
  value: string
}

export const useSystemSetting = (key: string) => {
  return useQuery({
    queryKey: ['system-settings', key],
    queryFn: async () => {
      try {
        const response = await api.get<SystemSetting>(`/system_settings/${key}`)
        return response.data.value
      } catch (error: any) {
        if (error.response?.status === 404) {
          return null
        }
        throw error
      }
    },
  })
}

export const useUpdateSystemSetting = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ key, value }: { key: string; value: string }) => {
      await api.put<SystemSetting>(`/system_settings/${key}`, { value })
    },
    onSuccess: async (_, { key }) => {
      await queryClient.invalidateQueries({ queryKey: ['system-settings', key] })
    },
  })
}
