import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { act, renderHook, waitFor } from '@testing-library/react'
import { toast } from 'sonner'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { createMutation, normalizeIri } from './createMutation'

vi.mock('sonner', () => ({ toast: { error: vi.fn() } }))

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  })
  function Wrapper({ children }: { children: React.ReactNode }) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  }
  return Wrapper
}

describe('normalizeIri', () => {
  it('strips /api prefix', () => {
    expect(normalizeIri('/api/contacts/1')).toBe('/contacts/1')
  })

  it('leaves paths without /api prefix unchanged', () => {
    expect(normalizeIri('/contacts/1')).toBe('/contacts/1')
  })

  it('leaves plain strings unchanged', () => {
    expect(normalizeIri('contacts/1')).toBe('contacts/1')
  })

  it('does not strip /api without trailing slash (e.g. /api_contacts/1)', () => {
    expect(normalizeIri('/api_contacts/1')).toBe('/api_contacts/1')
  })

  it('does not corrupt bare /api string', () => {
    expect(normalizeIri('/api')).toBe('/api')
  })
})

describe('createMutation', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns a hook function', () => {
    const hook = createMutation(async () => 'result', { invalidateKeys: [] })
    expect(typeof hook).toBe('function')
    expect(hook.name).toBe('useMutationHook')
  })

  it('runs mutationFn and invalidates keys on success', async () => {
    const mutationFn = vi.fn().mockResolvedValue('ok')
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
    })
    const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries')

    const useTestMutation = createMutation<string, string>(mutationFn, {
      invalidateKeys: [['contacts'], ['groups']],
    })

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    )

    const { result } = renderHook(() => useTestMutation(), { wrapper })

    await act(async () => {
      result.current.mutate('input-value')
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(mutationFn).toHaveBeenCalledWith('input-value', expect.any(Object))
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['contacts'] })
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['groups'] })
  })

  it('calls default toast.error on failure', async () => {
    const mutationFn = vi.fn().mockRejectedValue(new Error('network error'))
    const useTestMutation = createMutation<void, void>(mutationFn, { invalidateKeys: [] })

    const { result } = renderHook(() => useTestMutation(), { wrapper: createWrapper() })

    await act(async () => {
      result.current.mutate()
    })

    await waitFor(() => expect(result.current.isError).toBe(true))

    expect(toast.error).toHaveBeenCalledWith('Failed to save changes.')
  })

  it('calls custom onError instead of default toast', async () => {
    const onError = vi.fn()
    const mutationFn = vi.fn().mockRejectedValue(new Error('oops'))
    const useTestMutation = createMutation<void, void>(mutationFn, { invalidateKeys: [], onError })

    const { result } = renderHook(() => useTestMutation(), { wrapper: createWrapper() })

    await act(async () => {
      result.current.mutate()
    })

    await waitFor(() => expect(result.current.isError).toBe(true))

    expect(onError).toHaveBeenCalled()
    expect(toast.error).not.toHaveBeenCalled()
  })

  it('calls custom onSuccess callback after invalidation', async () => {
    const onSuccess = vi.fn()
    const mutationFn = vi.fn().mockResolvedValue('result-data')
    const useTestMutation = createMutation<void, string>(mutationFn, {
      invalidateKeys: [],
      onSuccess,
    })

    const { result } = renderHook(() => useTestMutation(), { wrapper: createWrapper() })

    await act(async () => {
      result.current.mutate()
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(onSuccess).toHaveBeenCalledWith('result-data')
  })
})
