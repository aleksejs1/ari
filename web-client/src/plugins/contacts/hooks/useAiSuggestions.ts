import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { normalizeIri } from '@/lib/api/createMutation'
import { api } from '@/lib/axios'
import { queryKeys } from '@/lib/queryKeys'

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
    queryKey: queryKeys.aiSuggestions.byEntity(entityType, entityId ?? ''),
    queryFn: async () => {
      const response = await api.get<{ member: AiSuggestion[] }>('/ai_suggestions', {
        params: { entityType, entityId },
      })
      return (response.data.member ?? []) as AiSuggestion[]
    },
    enabled: !!entityId && entityId > 0,
    staleTime: 1000 * 60 * 2,
  })
}

export function useResolveAiSuggestion() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: 'accepted' | 'dismissed' }) => {
      const response = await api.patch(
        normalizeIri(id),
        { status },
        {
          headers: { 'Content-Type': 'application/merge-patch+json' },
        },
      )
      return response.data
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.aiSuggestions.all })
      void queryClient.invalidateQueries({ queryKey: queryKeys.contacts.all })
    },
    onError: () => toast.error('Failed to save changes.'),
  })
}

export function useAiSuggestionStats() {
  return useQuery({
    queryKey: queryKeys.aiSuggestions.stats,
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
      void queryClient.invalidateQueries({ queryKey: queryKeys.aiSuggestions.stats })
    },
    onError: () => toast.error('Failed to start AI analysis.'),
  })
}
