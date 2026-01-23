import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { api } from '@/lib/axios'

import { useCreateContactName, useDeleteContactName, useUpdateContactName } from './useContactNames'

vi.mock('@/lib/axios', () => ({
  api: {
    post: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
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

describe('useContactNames hooks', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('useCreateContactName', () => {
    it('creates name and invalidates queries', async () => {
      vi.mocked(api.post).mockResolvedValue({ data: { id: 1 } })
      const queryClient = new QueryClient()
      const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries')

      const Wrapper = ({ children }: { children: React.ReactNode }) => (
        <QueryClientProvider client={queryClient}> {children} </QueryClientProvider>
      )
      Wrapper.displayName = 'Wrapper'

      const { result } = renderHook(() => useCreateContactName(), {
        wrapper: Wrapper,
      })

      await result.current.mutateAsync({
        contact: '/api/contacts/123',
        given: 'John',
        family: 'Doe',
      })

      expect(api.post).toHaveBeenCalledWith('/contact_names', {
        contact: '/api/contacts/123',
        given: 'John',
        family: 'Doe',
      })

      await waitFor(() => {
        expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['contacts'] })
        expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['contacts', '123'] })
      })
    })
  })

  describe('useUpdateContactName', () => {
    it('updates name with IRI', async () => {
      vi.mocked(api.patch).mockResolvedValue({ data: { id: 1 } })
      const { result } = renderHook(() => useUpdateContactName(), {
        wrapper: createWrapper(),
      })

      await result.current.mutateAsync({
        id: '/api/contact_names/1',
        data: { given: 'Jane' },
      })

      expect(api.patch).toHaveBeenCalledWith(
        '/contact_names/1',
        { given: 'Jane' },
        { headers: { 'Content-Type': 'application/merge-patch+json' } },
      )
    })

    it('updates name with simple path', async () => {
      vi.mocked(api.patch).mockResolvedValue({ data: { id: 1 } })
      const { result } = renderHook(() => useUpdateContactName(), {
        wrapper: createWrapper(),
      })

      await result.current.mutateAsync({
        id: '/contact_names/1',
        data: { given: 'Jane' },
      })

      expect(api.patch).toHaveBeenCalledWith(
        '/contact_names/1',
        { given: 'Jane' },
        { headers: { 'Content-Type': 'application/merge-patch+json' } },
      )
    })
  })

  describe('useDeleteContactName', () => {
    it('deletes name with IRI', async () => {
      vi.mocked(api.delete).mockResolvedValue({})
      const { result } = renderHook(() => useDeleteContactName(), {
        wrapper: createWrapper(),
      })

      await result.current.mutateAsync('/api/contact_names/1')

      expect(api.delete).toHaveBeenCalledWith('/contact_names/1')
    })

    it('deletes name with simple path', async () => {
      vi.mocked(api.delete).mockResolvedValue({})
      const { result } = renderHook(() => useDeleteContactName(), {
        wrapper: createWrapper(),
      })

      await result.current.mutateAsync('/contact_names/1')

      expect(api.delete).toHaveBeenCalledWith('/contact_names/1')
    })
  })
})
