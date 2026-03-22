import React from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { act, renderHook, waitFor } from '@testing-library/react'
import { toast } from 'sonner'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { api } from '@/lib/axios'

import { ITEMS_PER_PAGE } from '../constants'

import { useApiKeys } from './useApiKeys'

vi.mock('@/lib/axios', () => ({
  api: {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  },
}))

vi.mock('sonner', () => ({ toast: { error: vi.fn() } }))

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  })
  function Wrapper({ children }: { children: React.ReactNode }) {
    return React.createElement(QueryClientProvider, { client: queryClient }, children)
  }
  return Wrapper
}

const mockKey = {
  id: '1',
  name: 'Test Key',
  scopes: ['read'],
  secretLastFour: 'abcd',
  lastUsedAt: null,
  lastUsedIp: null,
  appType: 'claude',
  createdAt: '2024-01-01T00:00:00Z',
}

describe('useApiKeys', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('fetches api keys and computes pagination', async () => {
    vi.mocked(api.get).mockResolvedValue({ data: { member: [mockKey], totalItems: 25 } })

    const { result } = renderHook(() => useApiKeys(1), { wrapper: createWrapper() })

    await waitFor(() => expect(result.current.isLoading).toBe(false))

    expect(api.get).toHaveBeenCalledWith(`/api_keys?page=1&itemsPerPage=${ITEMS_PER_PAGE}`)
    expect(result.current.keys).toEqual([mockKey])
    expect(result.current.totalPages).toBe(Math.ceil(25 / ITEMS_PER_PAGE))
  })

  it('returns empty keys and zero pages on empty response', async () => {
    vi.mocked(api.get).mockResolvedValue({ data: { member: [], totalItems: 0 } })

    const { result } = renderHook(() => useApiKeys(1), { wrapper: createWrapper() })

    await waitFor(() => expect(result.current.isLoading).toBe(false))

    expect(result.current.keys).toEqual([])
    expect(result.current.totalPages).toBe(0)
  })

  it('creates an api key via POST', async () => {
    vi.mocked(api.get).mockResolvedValue({ data: { member: [], totalItems: 0 } })
    vi.mocked(api.post).mockResolvedValue({ data: { ...mockKey, token: 'secret-token' } })

    const { result } = renderHook(() => useApiKeys(1), { wrapper: createWrapper() })
    await waitFor(() => expect(result.current.isLoading).toBe(false))

    await act(async () => {
      await result.current.createMutation.mutateAsync({
        name: 'New Key',
        scopes: ['read'],
        appType: 'claude',
      })
    })

    expect(api.post).toHaveBeenCalledWith('/api_keys', {
      name: 'New Key',
      scopes: ['read'],
      appType: 'claude',
    })
  })

  it('shows toast on create failure', async () => {
    vi.mocked(api.get).mockResolvedValue({ data: { member: [], totalItems: 0 } })
    vi.mocked(api.post).mockRejectedValue(new Error('Network error'))

    const { result } = renderHook(() => useApiKeys(1), { wrapper: createWrapper() })
    await waitFor(() => expect(result.current.isLoading).toBe(false))

    result.current.createMutation.mutate({ name: 'X', scopes: [], appType: 'claude' })

    await waitFor(() => expect(result.current.createMutation.isError).toBe(true))
    expect(toast.error).toHaveBeenCalledWith('Failed to create API key.')
  })

  it('updates an api key via PATCH', async () => {
    vi.mocked(api.get).mockResolvedValue({ data: { member: [mockKey], totalItems: 1 } })
    vi.mocked(api.patch).mockResolvedValue({ data: { ...mockKey, name: 'Updated' } })

    const { result } = renderHook(() => useApiKeys(1), { wrapper: createWrapper() })
    await waitFor(() => expect(result.current.isLoading).toBe(false))

    await act(async () => {
      await result.current.updateMutation.mutateAsync({
        id: '1',
        name: 'Updated',
        scopes: ['read', 'write'],
      })
    })

    expect(api.patch).toHaveBeenCalledWith(
      '/api_keys/1',
      { name: 'Updated', scopes: ['read', 'write'] },
      { headers: { 'Content-Type': 'application/merge-patch+json' } },
    )
  })

  it('shows toast on update failure', async () => {
    vi.mocked(api.get).mockResolvedValue({ data: { member: [mockKey], totalItems: 1 } })
    vi.mocked(api.patch).mockRejectedValue(new Error('Server error'))

    const { result } = renderHook(() => useApiKeys(1), { wrapper: createWrapper() })
    await waitFor(() => expect(result.current.isLoading).toBe(false))

    result.current.updateMutation.mutate({ id: '1', name: 'X', scopes: [] })

    await waitFor(() => expect(result.current.updateMutation.isError).toBe(true))
    expect(toast.error).toHaveBeenCalledWith('Failed to update API key.')
  })

  it('deletes an api key via DELETE', async () => {
    vi.mocked(api.get).mockResolvedValue({ data: { member: [mockKey], totalItems: 1 } })
    vi.mocked(api.delete).mockResolvedValue({})

    const { result } = renderHook(() => useApiKeys(1), { wrapper: createWrapper() })
    await waitFor(() => expect(result.current.isLoading).toBe(false))

    await act(async () => {
      await result.current.deleteMutation.mutateAsync('1')
    })

    expect(api.delete).toHaveBeenCalledWith('/api_keys/1')
  })

  it('shows toast on delete failure', async () => {
    vi.mocked(api.get).mockResolvedValue({ data: { member: [mockKey], totalItems: 1 } })
    vi.mocked(api.delete).mockRejectedValue(new Error('Forbidden'))

    const { result } = renderHook(() => useApiKeys(1), { wrapper: createWrapper() })
    await waitFor(() => expect(result.current.isLoading).toBe(false))

    result.current.deleteMutation.mutate('1')

    await waitFor(() => expect(result.current.deleteMutation.isError).toBe(true))
    expect(toast.error).toHaveBeenCalledWith('Failed to revoke API key.')
  })
})
