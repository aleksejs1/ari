import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import {
  useCreateContactEmail,
  useUpdateContactEmail,
  useDeleteContactEmail,
} from './useContactEmails'

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

describe('useContactEmails hooks', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('useCreateContactEmail', () => {
    it('creates email and invalidates queries', async () => {
      vi.mocked(api.post).mockResolvedValue({ data: { id: 1 } })
      const queryClient = new QueryClient()
      const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries')

      const Wrapper = ({ children }: { children: React.ReactNode }) => (
        <QueryClientProvider client={queryClient}> {children} </QueryClientProvider>
      )
      Wrapper.displayName = 'Wrapper'

      const { result } = renderHook(() => useCreateContactEmail(), {
        wrapper: Wrapper,
      })

      await result.current.mutateAsync({
        contact: '/api/contacts/123',
        email: 'test@example.com',
      })

      expect(api.post).toHaveBeenCalledWith('/contact_email_adresses', {
        contact: '/api/contacts/123',
        email: 'test@example.com',
      })

      await waitFor(() => {
        expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['contacts'] })
        expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['contacts', '123'] })
      })
    })
  })

  describe('useUpdateContactEmail', () => {
    it('updates email with IRI', async () => {
      vi.mocked(api.patch).mockResolvedValue({ data: { id: 1 } })
      const { result } = renderHook(() => useUpdateContactEmail(), {
        wrapper: createWrapper(),
      })

      await result.current.mutateAsync({
        id: '/api/contact_email_adresses/1',
        data: { email: 'updated@example.com' },
      })

      expect(api.patch).toHaveBeenCalledWith(
        '/contact_email_adresses/1',
        { email: 'updated@example.com' },
        { headers: { 'Content-Type': 'application/merge-patch+json' } },
      )
    })

    it('updates email with simple path', async () => {
      vi.mocked(api.patch).mockResolvedValue({ data: { id: 1 } })
      const { result } = renderHook(() => useUpdateContactEmail(), {
        wrapper: createWrapper(),
      })

      await result.current.mutateAsync({
        id: '/contact_email_adresses/1',
        data: { email: 'updated@example.com' },
      })

      expect(api.patch).toHaveBeenCalledWith(
        '/contact_email_adresses/1',
        { email: 'updated@example.com' },
        { headers: { 'Content-Type': 'application/merge-patch+json' } },
      )
    })
  })

  describe('useDeleteContactEmail', () => {
    it('deletes email with IRI', async () => {
      vi.mocked(api.delete).mockResolvedValue({})
      const { result } = renderHook(() => useDeleteContactEmail(), {
        wrapper: createWrapper(),
      })

      await result.current.mutateAsync('/api/contact_email_adresses/1')

      expect(api.delete).toHaveBeenCalledWith('/contact_email_adresses/1')
    })

    it('deletes email with simple path', async () => {
      vi.mocked(api.delete).mockResolvedValue({})
      const { result } = renderHook(() => useDeleteContactEmail(), {
        wrapper: createWrapper(),
      })

      await result.current.mutateAsync('/contact_email_adresses/1')

      expect(api.delete).toHaveBeenCalledWith('/contact_email_adresses/1')
    })
  })
})
