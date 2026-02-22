import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { api } from '@/lib/axios'

export interface AiSuggestion {
  '@id'?: string
  id?: number
  entityType: string
  entityId: number
  suggestionType: string
  status: string
  payload: {
    detectedLocale?: string
    suggestedLocale?: string
    given?: string
    family?: string
  }
  resolvedAt?: string | null
}

export interface AiSuggestionStats {
  pending: number
  accepted: number
  dismissed: number
  error: number
  skipped: number
  tokensPrompt: number
  tokensCompletion: number
}

export function useAiSuggestions(entityType: string, entityId: number | null | undefined) {
  return useQuery({
    queryKey: ['ai_suggestions', entityType, entityId],
    queryFn: async () => {
      const response = await api.get<{ 'hydra:member': AiSuggestion[] }>('/ai_suggestions', {
        params: { entityType, entityId },
      })
      return (response.data['hydra:member'] ?? []) as AiSuggestion[]
    },
    enabled: !!entityId && entityId > 0,
    staleTime: 1000 * 60 * 2,
  })
}

export function useResolveAiSuggestion() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: 'accepted' | 'dismissed' }) => {
      const url = id.startsWith('/api') ? id.substring(4) : id
      const response = await api.patch(
        url,
        { status },
        {
          headers: { 'Content-Type': 'application/merge-patch+json' },
        },
      )
      return response.data
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['ai_suggestions'] })
      void queryClient.invalidateQueries({ queryKey: ['contacts'] })
    },
  })
}

export function useAiSuggestionStats() {
  return useQuery({
    queryKey: ['ai_suggestion_stats'],
    queryFn: async () => {
      const response = await api.get<AiSuggestionStats>('/ai_suggestions/stats')
      return response.data
    },
    staleTime: 1000 * 30,
  })
}

export function useTriggerBatchAiAnalysis() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async () => {
      await api.post('/ai_suggestions/batch')
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['ai_suggestion_stats'] })
    },
  })
}
