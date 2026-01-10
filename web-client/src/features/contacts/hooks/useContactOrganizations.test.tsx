import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import {
  useCreateContactOrganization,
  useUpdateContactOrganization,
  useDeleteContactOrganization,
} from './useContactOrganizations'

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

describe('useContactOrganizations hooks', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('useCreateContactOrganization', () => {
    it('creates organization and invalidates queries', async () => {
      vi.mocked(api.post).mockResolvedValue({ data: { id: 1 } })
      const queryClient = new QueryClient()
      const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries')

      const Wrapper = ({ children }: { children: React.ReactNode }) => (
        <QueryClientProvider client={queryClient}> {children} </QueryClientProvider>
      )
      Wrapper.displayName = 'Wrapper'

      const { result } = renderHook(() => useCreateContactOrganization(), {
        wrapper: Wrapper,
      })

      await result.current.mutateAsync({
        contact: '/api/contacts/123',
        name: 'Acme Corp',
      })

      expect(api.post).toHaveBeenCalledWith('/contact_organizations', {
        contact: '/api/contacts/123',
        name: 'Acme Corp',
      })

      await waitFor(() => {
        expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['contacts'] })
        expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['contacts', '123'] })
      })
    })
  })

  describe('useUpdateContactOrganization', () => {
    it('updates organization with IRI', async () => {
      vi.mocked(api.patch).mockResolvedValue({ data: { id: 1 } })
      const { result } = renderHook(() => useUpdateContactOrganization(), {
        wrapper: createWrapper(),
      })

      await result.current.mutateAsync({
        id: '/api/contact_organizations/1',
        data: { name: 'Updated Corp' },
      })

      expect(api.patch).toHaveBeenCalledWith(
        '/contact_organizations/1',
        { name: 'Updated Corp' },
        { headers: { 'Content-Type': 'application/merge-patch+json' } },
      )
    })

    it('updates organization with simple path', async () => {
      vi.mocked(api.patch).mockResolvedValue({ data: { id: 1 } })
      const { result } = renderHook(() => useUpdateContactOrganization(), {
        wrapper: createWrapper(),
      })

      await result.current.mutateAsync({
        id: '/contact_organizations/1',
        data: { name: 'Updated Corp' },
      })

      expect(api.patch).toHaveBeenCalledWith(
        '/contact_organizations/1',
        { name: 'Updated Corp' },
        { headers: { 'Content-Type': 'application/merge-patch+json' } },
      )
    })
  })

  describe('useDeleteContactOrganization', () => {
    it('deletes organization with IRI', async () => {
      vi.mocked(api.delete).mockResolvedValue({})
      const { result } = renderHook(() => useDeleteContactOrganization(), {
        wrapper: createWrapper(),
      })

      await result.current.mutateAsync('/api/contact_organizations/1')

      expect(api.delete).toHaveBeenCalledWith('/contact_organizations/1')
    })

    it('deletes organization with simple path', async () => {
      vi.mocked(api.delete).mockResolvedValue({})
      const { result } = renderHook(() => useDeleteContactOrganization(), {
        wrapper: createWrapper(),
      })

      await result.current.mutateAsync('/contact_organizations/1')

      expect(api.delete).toHaveBeenCalledWith('/contact_organizations/1')
    })
  })
})
