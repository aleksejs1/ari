import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'

import { useGroups, useCreateGroup, useUpdateGroup, useDeleteGroup } from './useGroups'

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

describe('useGroups', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('fetches groups', async () => {
    const mockData = {
      member: [{ id: 1, name: 'Group 1' }],
    }
    vi.mocked(api.get).mockResolvedValueOnce({ data: mockData })

    const { result } = renderHook(() => useGroups(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(result.current.data).toEqual(mockData.member)
    expect(api.get).toHaveBeenCalledWith('/groups')
  })

  it('creates a group', async () => {
    const newGroup = { name: 'New Group' }
    const responseGroup = { id: 1, ...newGroup }
    vi.mocked(api.post).mockResolvedValueOnce({ data: responseGroup })

    const { result } = renderHook(() => useCreateGroup(), {
      wrapper: createWrapper(),
    })

    await result.current.mutateAsync(newGroup)

    expect(api.post).toHaveBeenCalledWith('/groups', newGroup)
  })

  it('updates a group', async () => {
    const updateData = { id: 1, data: { name: 'Updated' } }
    const responseGroup = { id: 1, name: 'Updated' }
    vi.mocked(api.put).mockResolvedValueOnce({ data: responseGroup })

    const { result } = renderHook(() => useUpdateGroup(), {
      wrapper: createWrapper(),
    })

    await result.current.mutateAsync(updateData)

    expect(api.put).toHaveBeenCalledWith('/groups/1', updateData.data)
  })

  it('updates a group with IRI', async () => {
    const updateData = { id: '/api/groups/1', data: { name: 'Updated' } }
    const responseGroup = { id: 1, name: 'Updated' }
    vi.mocked(api.put).mockResolvedValueOnce({ data: responseGroup })

    const { result } = renderHook(() => useUpdateGroup(), {
      wrapper: createWrapper(),
    })

    await result.current.mutateAsync(updateData)

    expect(api.put).toHaveBeenCalledWith('/groups/1', updateData.data)
  })

  it('deletes a group', async () => {
    vi.mocked(api.delete).mockResolvedValueOnce({})

    const { result } = renderHook(() => useDeleteGroup(), {
      wrapper: createWrapper(),
    })

    await result.current.mutateAsync(1)

    expect(api.delete).toHaveBeenCalledWith('/groups/1')
  })

  it('deletes a group with IRI', async () => {
    vi.mocked(api.delete).mockResolvedValueOnce({})

    const { result } = renderHook(() => useDeleteGroup(), {
      wrapper: createWrapper(),
    })

    await result.current.mutateAsync('/api/groups/1')

    expect(api.delete).toHaveBeenCalledWith('/groups/1')
  })
})
