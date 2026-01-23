import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { api } from '@/lib/axios'

import { useCreateContactRelation } from './useContactRelations'

vi.mock('@/lib/axios', () => ({
  api: {
    post: vi.fn(),
  },
}))

describe('useContactRelations hooks', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('useCreateContactRelation', () => {
    it('creates relation and invalidates both contact queries', async () => {
      vi.mocked(api.post).mockResolvedValue({ data: { id: 1 } })
      const queryClient = new QueryClient()
      const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries')

      const Wrapper = ({ children }: { children: React.ReactNode }) => (
        <QueryClientProvider client={queryClient}> {children} </QueryClientProvider>
      )
      Wrapper.displayName = 'Wrapper'

      const { result } = renderHook(() => useCreateContactRelation(), {
        wrapper: Wrapper,
      })

      await result.current.mutateAsync({
        contact: '/api/contacts/123',
        relatedContact: '/api/contacts/456',
        type: 'friend',
      })

      expect(api.post).toHaveBeenCalledWith('/contact_relations', {
        contact: '/api/contacts/123',
        relatedContact: '/api/contacts/456',
        type: 'friend',
      })

      await waitFor(() => {
        expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['contacts', '123'] })
        expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['contacts', '456'] })
      })
    })

    it('handles relation creation without related contact ID extraction issue', async () => {
      vi.mocked(api.post).mockResolvedValue({ data: { id: 1 } })
      const queryClient = new QueryClient()
      const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries')

      const Wrapper = ({ children }: { children: React.ReactNode }) => (
        <QueryClientProvider client={queryClient}> {children} </QueryClientProvider>
      )
      Wrapper.displayName = 'Wrapper'

      const { result } = renderHook(() => useCreateContactRelation(), {
        wrapper: Wrapper,
      })

      await result.current.mutateAsync({
        contact: '/api/contacts/1',
        relatedContact: '/api/contacts/2',
        type: 'colleague',
      })

      await waitFor(() => {
        expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['contacts', '1'] })
        expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['contacts', '2'] })
      })
    })
  })
})
