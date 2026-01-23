import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import {
  useCreateContactPhone,
  useUpdateContactPhone,
  useDeleteContactPhone,
} from './useContactPhones'

import { api } from '@/lib/axios'

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

describe('useContactPhones hooks', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('useCreateContactPhone', () => {
    it('creates phone and invalidates queries', async () => {
      vi.mocked(api.post).mockResolvedValue({ data: { id: 1 } })
      const queryClient = new QueryClient()
      const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries')

      const Wrapper = ({ children }: { children: React.ReactNode }) => (
        <QueryClientProvider client={queryClient}> {children} </QueryClientProvider>
      )
      Wrapper.displayName = 'Wrapper'

      const { result } = renderHook(() => useCreateContactPhone(), {
        wrapper: Wrapper,
      })

      await result.current.mutateAsync({
        contact: '/api/contacts/123',
        value: '+1234567890',
      })

      expect(api.post).toHaveBeenCalledWith('/contact_phone_numbers', {
        contact: '/api/contacts/123',
        value: '+1234567890',
      })

      await waitFor(() => {
        expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['contacts'] })
        expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['contacts', '123'] })
      })
    })
  })

  describe('useUpdateContactPhone', () => {
    it('updates phone with IRI', async () => {
      vi.mocked(api.patch).mockResolvedValue({ data: { id: 1 } })
      const { result } = renderHook(() => useUpdateContactPhone(), {
        wrapper: createWrapper(),
      })

      await result.current.mutateAsync({
        id: '/api/contact_phone_numbers/1',
        data: { value: '+0987654321' },
      })

      expect(api.patch).toHaveBeenCalledWith(
        '/contact_phone_numbers/1',
        { value: '+0987654321' },
        { headers: { 'Content-Type': 'application/merge-patch+json' } },
      )
    })

    it('updates phone with simple path', async () => {
      vi.mocked(api.patch).mockResolvedValue({ data: { id: 1 } })
      const { result } = renderHook(() => useUpdateContactPhone(), {
        wrapper: createWrapper(),
      })

      await result.current.mutateAsync({
        id: '/contact_phone_numbers/1',
        data: { value: '+0987654321' },
      })

      expect(api.patch).toHaveBeenCalledWith(
        '/contact_phone_numbers/1',
        { value: '+0987654321' },
        { headers: { 'Content-Type': 'application/merge-patch+json' } },
      )
    })
  })

  describe('useDeleteContactPhone', () => {
    it('deletes phone with IRI', async () => {
      vi.mocked(api.delete).mockResolvedValue({})
      const { result } = renderHook(() => useDeleteContactPhone(), {
        wrapper: createWrapper(),
      })

      await result.current.mutateAsync('/api/contact_phone_numbers/1')

      expect(api.delete).toHaveBeenCalledWith('/contact_phone_numbers/1')
    })

    it('deletes phone with simple path', async () => {
      vi.mocked(api.delete).mockResolvedValue({})
      const { result } = renderHook(() => useDeleteContactPhone(), {
        wrapper: createWrapper(),
      })

      await result.current.mutateAsync('/contact_phone_numbers/1')

      expect(api.delete).toHaveBeenCalledWith('/contact_phone_numbers/1')
    })
  })
})
