import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { api } from '@/lib/axios'

import { useMarkAsRead, useNotifications, useUnreadCount } from './useNotifications'

vi.mock('@/lib/axios', () => ({
  api: {
    get: vi.fn(),
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

describe('useNotifications hooks', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('useNotifications', () => {
    it('fetches notifications with Hydra response', async () => {
      const mockData = {
        member: [{ id: 1, message: 'Test' }],
        totalItems: 1,
      }
      vi.mocked(api.get).mockResolvedValue({ data: mockData })

      const { result } = renderHook(() => useNotifications(1), {
        wrapper: createWrapper(),
      })

      await waitFor(() => expect(result.current.isSuccess).toBe(true))

      expect(api.get).toHaveBeenCalledWith('/activity-feed?page=1')
      expect(result.current.data).toEqual([{ id: 1, message: 'Test' }])
    })

    it('fetches notifications with array response', async () => {
      const mockData = [{ id: 1, message: 'Test' }]
      vi.mocked(api.get).mockResolvedValue({ data: mockData })

      const { result } = renderHook(() => useNotifications(2), {
        wrapper: createWrapper(),
      })

      await waitFor(() => expect(result.current.isSuccess).toBe(true))

      expect(api.get).toHaveBeenCalledWith('/activity-feed?page=2')
      expect(result.current.data).toEqual([{ id: 1, message: 'Test' }])
    })
  })

  describe('useUnreadCount', () => {
    it('handles number response', async () => {
      vi.mocked(api.get).mockResolvedValue({ data: 5 })

      const { result } = renderHook(() => useUnreadCount(), {
        wrapper: createWrapper(),
      })

      await waitFor(() => expect(result.current.isSuccess).toBe(true))

      expect(api.get).toHaveBeenCalledWith('/activity-feed/unread-count')
      expect(result.current.data).toBe(5)
    })

    it('handles array response', async () => {
      vi.mocked(api.get).mockResolvedValue({ data: [1, 2, 3] })

      const { result } = renderHook(() => useUnreadCount(), {
        wrapper: createWrapper(),
      })

      await waitFor(() => expect(result.current.isSuccess).toBe(true))

      expect(result.current.data).toBe(3)
    })

    it('handles object with totalItems', async () => {
      vi.mocked(api.get).mockResolvedValue({ data: { totalItems: 10 } })

      const { result } = renderHook(() => useUnreadCount(), {
        wrapper: createWrapper(),
      })

      await waitFor(() => expect(result.current.isSuccess).toBe(true))

      expect(result.current.data).toBe(10)
    })

    it('handles object with hydra:totalItems', async () => {
      vi.mocked(api.get).mockResolvedValue({ data: { 'hydra:totalItems': 7 } })

      const { result } = renderHook(() => useUnreadCount(), {
        wrapper: createWrapper(),
      })

      await waitFor(() => expect(result.current.isSuccess).toBe(true))

      expect(result.current.data).toBe(7)
    })

    it('handles object with count property', async () => {
      vi.mocked(api.get).mockResolvedValue({ data: { count: 15 } })

      const { result } = renderHook(() => useUnreadCount(), {
        wrapper: createWrapper(),
      })

      await waitFor(() => expect(result.current.isSuccess).toBe(true))

      expect(result.current.data).toBe(15)
    })

    it('handles object with member array', async () => {
      vi.mocked(api.get).mockResolvedValue({ data: { member: [1, 2, 3, 4] } })

      const { result } = renderHook(() => useUnreadCount(), {
        wrapper: createWrapper(),
      })

      await waitFor(() => expect(result.current.isSuccess).toBe(true))

      expect(result.current.data).toBe(4)
    })

    it('handles object with hydra:member array', async () => {
      vi.mocked(api.get).mockResolvedValue({ data: { 'hydra:member': [1, 2] } })

      const { result } = renderHook(() => useUnreadCount(), {
        wrapper: createWrapper(),
      })

      await waitFor(() => expect(result.current.isSuccess).toBe(true))

      expect(result.current.data).toBe(2)
    })

    it('handles empty object', async () => {
      vi.mocked(api.get).mockResolvedValue({ data: {} })

      const { result } = renderHook(() => useUnreadCount(), {
        wrapper: createWrapper(),
      })

      await waitFor(() => expect(result.current.isSuccess).toBe(true))

      expect(result.current.data).toBe(0)
    })

    it('handles string number in totalItems', async () => {
      vi.mocked(api.get).mockResolvedValue({ data: { totalItems: '25' } })

      const { result } = renderHook(() => useUnreadCount(), {
        wrapper: createWrapper(),
      })

      await waitFor(() => expect(result.current.isSuccess).toBe(true))

      expect(result.current.data).toBe(25)
    })
  })

  describe('useMarkAsRead', () => {
    it('marks notification as read and invalidates queries', async () => {
      vi.mocked(api.patch).mockResolvedValue({})
      const queryClient = new QueryClient()
      const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries')

      const Wrapper = ({ children }: { children: React.ReactNode }) => (
        <QueryClientProvider client={queryClient}> {children} </QueryClientProvider>
      )
      Wrapper.displayName = 'Wrapper'

      const { result } = renderHook(() => useMarkAsRead(), {
        wrapper: Wrapper,
      })

      await result.current.mutateAsync(123)

      expect(api.patch).toHaveBeenCalledWith(
        '/activity-feed/read',
        { ids: [123] },
        { headers: { 'Content-Type': 'application/merge-patch+json' } },
      )

      await waitFor(() => {
        expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['notifications'] })
        expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['notifications', 'unread-count'] })
      })
    })
  })
})
