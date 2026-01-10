import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useUpcomingAnniversaries } from './useUpcomingAnniversaries'

import { api } from '@/lib/axios'

vi.mock('@/lib/axios', () => ({
  api: {
    get: vi.fn(),
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

describe('useUpcomingAnniversaries', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('fetches upcoming anniversaries', async () => {
    const mockData = {
      member: [
        { id: 1, text: 'Birthday', nextAnniversaryDate: '2024-06-15' },
        { id: 2, text: 'Anniversary', nextAnniversaryDate: '2024-07-20' },
      ],
    }
    vi.mocked(api.get).mockResolvedValue({ data: mockData })

    const { result } = renderHook(() => useUpcomingAnniversaries(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(api.get).toHaveBeenCalledWith(
      '/contact_dates?upcomingAnniversary=asc&page=1&itemsPerPage=5',
    )
    expect(result.current.data).toEqual(mockData.member)
  })

  it('handles empty response', async () => {
    vi.mocked(api.get).mockResolvedValue({ data: { member: [] } })

    const { result } = renderHook(() => useUpcomingAnniversaries(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(result.current.data).toEqual([])
  })

  it('handles API error', async () => {
    vi.mocked(api.get).mockRejectedValue(new Error('Network error'))

    const { result } = renderHook(() => useUpcomingAnniversaries(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isError).toBe(true))

    expect(result.current.error).toBeDefined()
  })
})
