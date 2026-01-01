import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'

import {
  useNotificationChannels,
  useCreateNotificationChannel,
  useUpdateNotificationChannel,
  useDeleteNotificationChannel,
} from './useNotificationChannels'

import { api } from '@/lib/axios'

vi.mock('@/lib/axios', () => ({
  api: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}))

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  })
  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
  Wrapper.displayName = 'QueryClientWrapper'
  return Wrapper
}

describe('useNotificationChannels', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('fetches notification channels', async () => {
    const mockData = {
      member: [{ id: 1, type: 'telegram', value: '123' }],
      totalItems: 1,
    }
    vi.mocked(api.get).mockResolvedValueOnce({ data: mockData })

    const { result } = renderHook(() => useNotificationChannels(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(result.current.data).toEqual(mockData)
    expect(api.get).toHaveBeenCalledWith('/notification_channels?page=1')
  })

  it('creates a notification channel', async () => {
    const newChannel = { type: 'telegram', value: '123' }
    const responseChannel = { id: 1, ...newChannel }
    vi.mocked(api.post).mockResolvedValueOnce({ data: responseChannel })

    const { result } = renderHook(() => useCreateNotificationChannel(), {
      wrapper: createWrapper(),
    })

    await result.current.mutateAsync(newChannel)

    expect(api.post).toHaveBeenCalledWith('/notification_channels', newChannel)
  })

  it('updates a notification channel', async () => {
    const updateData = { id: '1', data: { type: 'slack', value: '456' } }
    const responseChannel = { id: 1, ...updateData.data }
    vi.mocked(api.put).mockResolvedValueOnce({ data: responseChannel })

    const { result } = renderHook(() => useUpdateNotificationChannel(), {
      wrapper: createWrapper(),
    })

    await result.current.mutateAsync(updateData)

    expect(api.put).toHaveBeenCalledWith('1', updateData.data)
  })

  it('updates a notification channel with IRI', async () => {
    const updateData = { id: '/api/notification_channels/1', data: { type: 'slack', value: '456' } }
    const responseChannel = { id: 1, ...updateData.data }
    vi.mocked(api.put).mockResolvedValueOnce({ data: responseChannel })

    const { result } = renderHook(() => useUpdateNotificationChannel(), {
      wrapper: createWrapper(),
    })

    await result.current.mutateAsync(updateData)

    expect(api.put).toHaveBeenCalledWith('/notification_channels/1', updateData.data)
  })

  it('deletes a notification channel', async () => {
    vi.mocked(api.delete).mockResolvedValueOnce({})

    const { result } = renderHook(() => useDeleteNotificationChannel(), {
      wrapper: createWrapper(),
    })

    await result.current.mutateAsync('1')

    expect(api.delete).toHaveBeenCalledWith('1')
  })

  it('deletes a notification channel with IRI', async () => {
    vi.mocked(api.delete).mockResolvedValueOnce({})

    const { result } = renderHook(() => useDeleteNotificationChannel(), {
      wrapper: createWrapper(),
    })

    await result.current.mutateAsync('/api/notification_channels/1')

    expect(api.delete).toHaveBeenCalledWith('/notification_channels/1')
  })
})
