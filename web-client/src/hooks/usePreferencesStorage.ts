import { useMutation, useQueryClient } from '@tanstack/react-query'

import { api } from '@/lib/axios'
import { queryKeys } from '@/lib/queryKeys'
import type { components } from '@/types/schema'

type UserPref = components['schemas']['UserPref.jsonld-user_pref.read']

/**
 * Internal hook shared by RegionalPrefsContext, UIPrefsContext, and FeaturePrefsContext.
 * Handles patching an existing user pref or creating a new one via PUT.
 */
export function usePreferencesStorage(prefs: UserPref[] | undefined) {
  const queryClient = useQueryClient()

  const getPrefRealId = (type: string) => {
    const atId = prefs?.find((p) => p.type === type)?.['@id']
    return atId ? atId.split('/').pop() : null
  }

  return useMutation({
    mutationFn: async ({ type, value }: { type: string; value: string }) => {
      const id = getPrefRealId(type)
      if (id) {
        await api.patch(
          `/user_prefs/${id}`,
          { value },
          { headers: { 'Content-Type': 'application/merge-patch+json' } },
        )
      } else {
        await api.put(`/user_prefs/${encodeURIComponent(type)}`, { value })
      }
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.userPrefs })
    },
  })
}
