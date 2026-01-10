import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import {
  useCreateContactBiography,
  useUpdateContactBiography,
  useDeleteContactBiography,
} from './useContactBios'

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

describe('useContactBios hooks', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('useCreateContactBiography', () => {
    it('creates biography and invalidates queries', async () => {
      vi.mocked(api.post).mockResolvedValue({ data: { id: 1 } })
      const queryClient = new QueryClient()
      const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries')

      const Wrapper = ({ children }: { children: React.ReactNode }) => (
        <QueryClientProvider client={queryClient}> {children} </QueryClientProvider>
      )
      Wrapper.displayName = 'Wrapper'

      const { result } = renderHook(() => useCreateContactBiography(), {
        wrapper: Wrapper,
      })

      await result.current.mutateAsync({
        contact: '/api/contacts/123',
        value: 'Bio text',
      })

      expect(api.post).toHaveBeenCalledWith('/contact_biographies', {
        contact: '/api/contacts/123',
        value: 'Bio text',
      })

      await waitFor(() => {
        expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['contacts'] })
        expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['contacts', '123'] })
      })
    })
  })

  describe('useUpdateContactBiography', () => {
    it('updates biography with IRI', async () => {
      vi.mocked(api.patch).mockResolvedValue({ data: { id: 1 } })
      const { result } = renderHook(() => useUpdateContactBiography(), {
        wrapper: createWrapper(),
      })

      await result.current.mutateAsync({
        id: '/api/contact_biographies/1',
        data: { value: 'Updated bio' },
      })

      expect(api.patch).toHaveBeenCalledWith(
        '/contact_biographies/1',
        { value: 'Updated bio' },
        { headers: { 'Content-Type': 'application/merge-patch+json' } },
      )
    })

    it('updates biography with simple path', async () => {
      vi.mocked(api.patch).mockResolvedValue({ data: { id: 1 } })
      const { result } = renderHook(() => useUpdateContactBiography(), {
        wrapper: createWrapper(),
      })

      await result.current.mutateAsync({
        id: '/contact_biographies/1',
        data: { value: 'Updated bio' },
      })

      expect(api.patch).toHaveBeenCalledWith(
        '/contact_biographies/1',
        { value: 'Updated bio' },
        { headers: { 'Content-Type': 'application/merge-patch+json' } },
      )
    })
  })

  describe('useDeleteContactBiography', () => {
    it('deletes biography with IRI', async () => {
      vi.mocked(api.delete).mockResolvedValue({})
      const { result } = renderHook(() => useDeleteContactBiography(), {
        wrapper: createWrapper(),
      })

      await result.current.mutateAsync('/api/contact_biographies/1')

      expect(api.delete).toHaveBeenCalledWith('/contact_biographies/1')
    })

    it('deletes biography with simple path', async () => {
      vi.mocked(api.delete).mockResolvedValue({})
      const { result } = renderHook(() => useDeleteContactBiography(), {
        wrapper: createWrapper(),
      })

      await result.current.mutateAsync('/contact_biographies/1')

      expect(api.delete).toHaveBeenCalledWith('/contact_biographies/1')
    })
  })
})
