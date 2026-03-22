import type { QueryKey } from '@tanstack/react-query'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

/**
 * Factory for simple CRUD mutation hooks that only need cache invalidation on success.
 *
 * Use this for hooks whose onSuccess does nothing beyond invalidating query keys.
 * Hooks with navigation, structured error handling, or variables-dependent invalidation
 * should remain explicit useMutation calls.
 *
 * **Limitation**: `invalidateKeys` are captured at factory creation time (module load),
 * not at hook call time. Dynamic keys that depend on mutation variables are not supported —
 * use explicit `useMutation` for those cases (e.g. `useCreateContact*` hooks that
 * invalidate `queryKeys.contacts.detail(contactId)` after extracting the id from variables).
 *
 * @example
 * export const useDeleteContactName = createMutation(
 *   (id: string) => api.delete(normalizeIri(id)).then(() => undefined),
 *   { invalidateKeys: [queryKeys.contacts.all] },
 * )
 */
export function createMutation<TInput, TOutput>(
  mutationFn: (data: TInput) => Promise<TOutput>,
  config: {
    invalidateKeys: QueryKey[]
    onSuccess?: (data: TOutput) => void
    onError?: (error: unknown) => void
  },
) {
  return function useMutationHook() {
    const queryClient = useQueryClient()
    return useMutation({
      mutationFn,
      onSuccess: (data) => {
        config.invalidateKeys.forEach(
          (key) => void queryClient.invalidateQueries({ queryKey: key }),
        )
        config.onSuccess?.(data)
      },
      onError: config.onError ?? (() => toast.error('Failed to save changes.')),
    })
  }
}

/** Normalize an IRI or plain path: strips leading /api prefix. */
export function normalizeIri(id: string): string {
  return id.startsWith('/api/') ? id.substring(4) : id
}
