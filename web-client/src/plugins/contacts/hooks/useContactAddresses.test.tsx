import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { api } from '@/lib/axios'

import {
  useCreateContactAddress,
  useDeleteContactAddress,
  useUpdateContactAddress,
} from './useContactAddresses'

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

describe('useContactAddresses hooks', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('useCreateContactAddress', () => {
    it('creates address and invalidates queries', async () => {
      vi.mocked(api.post).mockResolvedValue({ data: { id: 1 } })
      const queryClient = new QueryClient()
      const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries')

      const Wrapper = ({ children }: { children: React.ReactNode }) => (
        <QueryClientProvider client={queryClient}> {children} </QueryClientProvider>
      )
      Wrapper.displayName = 'Wrapper'

      const { result } = renderHook(() => useCreateContactAddress(), {
        wrapper: Wrapper,
      })

      await result.current.mutateAsync({
        contact: '/api/contacts/123',
        street: '123 Main St',
      })

      expect(api.post).toHaveBeenCalledWith('/contact_addresses', {
        contact: '/api/contacts/123',
        street: '123 Main St',
      })

      await waitFor(() => {
        expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['contacts'] })
        expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['contacts', '123'] })
      })
    })
  })

  describe('useUpdateContactAddress', () => {
    it('updates address with IRI', async () => {
      vi.mocked(api.patch).mockResolvedValue({ data: { id: 1 } })
      const { result } = renderHook(() => useUpdateContactAddress(), {
        wrapper: createWrapper(),
      })

      await result.current.mutateAsync({
        id: '/api/contact_addresses/1',
        data: { street: 'Updated St' },
      })

      expect(api.patch).toHaveBeenCalledWith(
        '/contact_addresses/1',
        { street: 'Updated St' },
        { headers: { 'Content-Type': 'application/merge-patch+json' } },
      )
    })

    it('updates address with simple ID', async () => {
      vi.mocked(api.patch).mockResolvedValue({ data: { id: 1 } })
      const { result } = renderHook(() => useUpdateContactAddress(), {
        wrapper: createWrapper(),
      })

      await result.current.mutateAsync({
        id: '/contact_addresses/1',
        data: { street: 'Updated St' },
      })

      expect(api.patch).toHaveBeenCalledWith(
        '/contact_addresses/1',
        { street: 'Updated St' },
        { headers: { 'Content-Type': 'application/merge-patch+json' } },
      )
    })
  })

  describe('useDeleteContactAddress', () => {
    it('deletes address with IRI', async () => {
      vi.mocked(api.delete).mockResolvedValue({})
      const { result } = renderHook(() => useDeleteContactAddress(), {
        wrapper: createWrapper(),
      })

      await result.current.mutateAsync('/api/contact_addresses/1')

      expect(api.delete).toHaveBeenCalledWith('/contact_addresses/1')
    })

    it('deletes address with simple path', async () => {
      vi.mocked(api.delete).mockResolvedValue({})
      const { result } = renderHook(() => useDeleteContactAddress(), {
        wrapper: createWrapper(),
      })

      await result.current.mutateAsync('/contact_addresses/1')

      expect(api.delete).toHaveBeenCalledWith('/contact_addresses/1')
    })
  })
})
