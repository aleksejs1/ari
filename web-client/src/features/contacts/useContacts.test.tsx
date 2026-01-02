import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import {
  useContacts,
  useContact,
  useCreateContact,
  useDeleteContact,
  useUpdateContact,
  useUpdateContactDate,
  useCreateContactDate,
  useGroups,
  useCreateGroup,
  getHydraMember,
  getHydraPagination,
} from './useContacts'

import { api } from '@/lib/axios'

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  })
  const ReactQueryWrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )

  return ReactQueryWrapper
}

vi.mock('@/lib/axios', () => ({
  api: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}))

describe('useContacts Utils', () => {
  it('getHydraMember returns array', () => {
    expect(getHydraMember()).toEqual([])
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect(getHydraMember({ member: [1] } as any)).toEqual([1])
  })

  it('getHydraPagination calculates correctly', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data = { totalItems: 60 } as unknown as any
    const pagination = getHydraPagination(data, 1)
    expect(pagination.totalItems).toBe(60)
    expect(pagination.totalPages).toBe(2)
    expect(pagination.hasNext).toBe(true)
    expect(pagination.hasPrevious).toBe(false)

    const page2 = getHydraPagination(data, 2)
    expect(page2.hasNext).toBe(false)
    expect(page2.hasPrevious).toBe(true)
  })

  it('getHydraPagination handles view links', () => {
    const data = {
      totalItems: 60,
      view: { next: '/api?page=2', previous: '/api?page=1' },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any
    const pagination = getHydraPagination(data, 2)
    expect(pagination.hasNext).toBe(true)
    expect(pagination.hasPrevious).toBe(true)
  })
})

describe('useContacts Hooks', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('useContacts', () => {
    it('fetches contacts with filters', async () => {
      const mockData = { member: [] }
      vi.mocked(api.get).mockResolvedValue({ data: mockData })

      const { result } = renderHook(
        () => useContacts(1, { group: '/api/groups/1', search: 'John' }),
        { wrapper: createWrapper() },
      )

      await waitFor(() => expect(result.current.isSuccess).toBe(true))

      expect(api.get).toHaveBeenCalledWith(
        expect.stringContaining('contactGroups.groupResource=%2Fapi%2Fgroups%2F1'),
      )
      expect(api.get).toHaveBeenCalledWith(expect.stringContaining('search=John'))
    })
  })

  describe('useContact', () => {
    it('fetches single contact by ID', async () => {
      vi.mocked(api.get).mockResolvedValue({ data: { id: 1 } })
      const { result } = renderHook(() => useContact('1'), { wrapper: createWrapper() })
      await waitFor(() => expect(result.current.isSuccess).toBe(true))
      expect(api.get).toHaveBeenCalledWith('/contacts/1')
    })

    it('fetches single contact by IRI', async () => {
      vi.mocked(api.get).mockResolvedValue({ data: { id: 1 } })
      const { result } = renderHook(() => useContact('/api/contacts/1'), {
        wrapper: createWrapper(),
      })
      await waitFor(() => expect(result.current.isSuccess).toBe(true))
      expect(api.get).toHaveBeenCalledWith('/contacts/1')
    })
  })

  describe('useCreateContact', () => {
    it('creates contact successfully', async () => {
      vi.mocked(api.post).mockResolvedValue({ data: { id: 1 } })
      const { result } = renderHook(() => useCreateContact(), { wrapper: createWrapper() })
      await result.current.mutateAsync({ contactNames: [], contactDates: [] })
      expect(api.post).toHaveBeenCalledWith('/contacts', expect.any(Object))
    })
  })

  describe('useUpdateContact', () => {
    it('updates contact successfully with simple ID', async () => {
      vi.mocked(api.put).mockResolvedValue({ data: { id: 1 } })
      const { result } = renderHook(() => useUpdateContact(), { wrapper: createWrapper() })
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await result.current.mutateAsync({ id: '1', data: { contactNames: [] } as any })
      expect(api.put).toHaveBeenCalledWith('1', expect.any(Object))
    })

    it('updates contact successfully with IRI', async () => {
      vi.mocked(api.put).mockResolvedValue({ data: { id: 1 } })
      const { result } = renderHook(() => useUpdateContact(), { wrapper: createWrapper() })
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await result.current.mutateAsync({ id: '/api/contacts/1', data: { contactNames: [] } as any })
      expect(api.put).toHaveBeenCalledWith('/contacts/1', expect.any(Object))
    })
  })

  describe('useDeleteContact', () => {
    it('deletes contact successfully with IRI', async () => {
      vi.mocked(api.delete).mockResolvedValue({})
      const { result } = renderHook(() => useDeleteContact(), { wrapper: createWrapper() })
      await result.current.mutateAsync('/api/contacts/1')
      expect(api.delete).toHaveBeenCalledWith('/contacts/1')
    })
  })

  describe('useUpdateContactDate', () => {
    it('updates contact date successfully', async () => {
      vi.mocked(api.put).mockResolvedValue({ data: {} })
      const { result } = renderHook(() => useUpdateContactDate(), { wrapper: createWrapper() })
      await result.current.mutateAsync({ id: '/api/dates/1', data: { text: 'New' } })
      expect(api.put).toHaveBeenCalledWith('/dates/1', { text: 'New' })
    })
  })

  describe('useCreateContactDate', () => {
    it('creates contact date successfully', async () => {
      vi.mocked(api.post).mockResolvedValue({ data: {} })
      const { result } = renderHook(() => useCreateContactDate(), { wrapper: createWrapper() })
      await result.current.mutateAsync({ date: '2023-01-01', contact: '/api/contacts/1' })
      expect(api.post).toHaveBeenCalledWith(
        '/contact_dates',
        expect.objectContaining({ date: '2023-01-01' }),
      )
    })
  })

  describe('useGroups hooks', () => {
    it('fetches groups', async () => {
      vi.mocked(api.get).mockResolvedValue({ data: { member: [] } })
      const { result } = renderHook(() => useGroups(), { wrapper: createWrapper() })
      await waitFor(() => expect(result.current.isSuccess).toBe(true))
      expect(api.get).toHaveBeenCalledWith('/groups')
    })

    it('creates group', async () => {
      vi.mocked(api.post).mockResolvedValue({ data: {} })
      const { result } = renderHook(() => useCreateGroup(), { wrapper: createWrapper() })
      await result.current.mutateAsync({ name: 'New Group' })
      expect(api.post).toHaveBeenCalledWith('/groups', { name: 'New Group' })
    })
  })
})
