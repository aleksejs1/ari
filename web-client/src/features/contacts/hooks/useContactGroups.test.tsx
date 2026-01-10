import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useGroups, useCreateGroup, useUpdateContactGroups } from './useContactGroups'

import { api } from '@/lib/axios'

vi.mock('@/lib/axios', () => ({
  api: {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
  },
}))

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  function ReactQueryWrapper({ children }: { children: React.ReactNode }) {
    return <QueryClientProvider client={queryClient}> {children} </QueryClientProvider>
  }
  return ReactQueryWrapper
}

describe('useContactGroups hooks', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('useGroups', () => {
    it('fetches groups successfully', async () => {
      vi.mocked(api.get).mockResolvedValue({
        data: {
          member: [
            { '@id': '/api/groups/1', name: 'Family' },
            { '@id': '/api/groups/2', name: 'Work' },
          ],
        },
      })

      const { result } = renderHook(() => useGroups(), { wrapper: createWrapper() })

      await waitFor(() => expect(result.current.isSuccess).toBe(true))

      expect(api.get).toHaveBeenCalledWith('/groups')
      expect(result.current.data).toEqual([
        { '@id': '/api/groups/1', name: 'Family' },
        { '@id': '/api/groups/2', name: 'Work' },
      ])
    })
  })

  describe('useCreateGroup', () => {
    it('creates group and invalidates queries', async () => {
      vi.mocked(api.post).mockResolvedValue({
        data: { '@id': '/api/groups/3', name: 'Friends' },
      })
      const queryClient = new QueryClient()
      const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries')

      const Wrapper = ({ children }: { children: React.ReactNode }) => (
        <QueryClientProvider client={queryClient}> {children} </QueryClientProvider>
      )
      Wrapper.displayName = 'Wrapper'

      const { result } = renderHook(() => useCreateGroup(), { wrapper: Wrapper })

      await result.current.mutateAsync({ name: 'Friends' })

      expect(api.post).toHaveBeenCalledWith('/groups', { name: 'Friends' })

      await waitFor(() => {
        expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['groups'] })
      })
    })
  })

  describe('useUpdateContactGroups', () => {
    it('updates contact groups with IRI', async () => {
      vi.mocked(api.patch).mockResolvedValue({ data: {} })
      const queryClient = new QueryClient()
      const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries')

      const Wrapper = ({ children }: { children: React.ReactNode }) => (
        <QueryClientProvider client={queryClient}> {children} </QueryClientProvider>
      )
      Wrapper.displayName = 'Wrapper'

      const { result } = renderHook(() => useUpdateContactGroups(), { wrapper: Wrapper })

      await result.current.mutateAsync({
        contactId: '/api/contacts/123',
        groupIds: ['/api/groups/1', '/api/groups/2'],
      })

      expect(api.patch).toHaveBeenCalledWith(
        '/contacts/123',
        {
          contactGroups: [{ groupResource: '/api/groups/1' }, { groupResource: '/api/groups/2' }],
        },
        { headers: { 'Content-Type': 'application/merge-patch+json' } },
      )

      await waitFor(() => {
        expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['contacts'] })
        expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['contacts', '123'] })
      })
    })

    it('handles contact ID without /api prefix', async () => {
      vi.mocked(api.patch).mockResolvedValue({ data: {} })

      const { result } = renderHook(() => useUpdateContactGroups(), {
        wrapper: createWrapper(),
      })

      await result.current.mutateAsync({
        contactId: '/contacts/456',
        groupIds: ['/api/groups/1'],
      })

      expect(api.patch).toHaveBeenCalledWith(
        '/contacts/456',
        { contactGroups: [{ groupResource: '/api/groups/1' }] },
        { headers: { 'Content-Type': 'application/merge-patch+json' } },
      )
    })
  })
})
