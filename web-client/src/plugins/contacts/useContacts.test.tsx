import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { api } from '@/lib/axios'
import { type ContactFormValues } from '@/types/models'

import {
  getHydraMember,
  getHydraPagination,
  type HydraCollection,
  useContact,
  useContacts,
  useCreateContact,
  useCreateContactDate,
  useCreateGroup,
  useDeleteContact,
  useGroups,
  useUpdateContact,
  useUpdateContactDate,
} from './useContacts'

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

const MOCK_CONTACT_DATA: ContactFormValues = {
  contactNames: [{ given: 'John', family: 'Doe' }],
  contactDates: [],
  phoneNumbers: [],
  contactEmailAdresses: [],
  contactAddresses: [],
}

describe('useContacts Utils', () => {
  it('getHydraMember returns array', () => {
    expect(getHydraMember()).toEqual([])
    expect(getHydraMember({ member: [1] } as HydraCollection<number>)).toEqual([1])
  })

  it('getHydraPagination calculates correctly', () => {
    const data = { member: [], totalItems: 60 } as HydraCollection<unknown>
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
    } as HydraCollection<unknown>
    const pagination = getHydraPagination(data, 2)
    expect(pagination.hasNext).toBe(true)
    expect(pagination.hasPrevious).toBe(true)
  })

  it('getHydraPagination handles missing view and totalItems', () => {
    const data = { member: [] } as HydraCollection<unknown>
    const pagination = getHydraPagination(data, 1)
    expect(pagination.totalItems).toBe(0)
    expect(pagination.totalPages).toBe(0)
    expect(pagination.hasNext).toBe(false)
    expect(pagination.hasPrevious).toBe(false)
  })

  it('getHydraPagination calculates hasNext based on pages', () => {
    const data = { member: [], totalItems: 60 } as HydraCollection<unknown>
    // Page 1 of 2. hasNext should be true because totalPages (2) > page (1)
    const pagination = getHydraPagination(data, 1)
    expect(pagination.hasNext).toBe(true)
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
      await result.current.mutateAsync(MOCK_CONTACT_DATA)
      expect(api.post).toHaveBeenCalledWith('/contacts', expect.any(Object))
    })

    it('invalidates queries on success', async () => {
      const queryClient = new QueryClient()
      const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries')
      const setQueryDataSpy = vi.spyOn(queryClient, 'setQueryData')

      vi.mocked(api.post).mockResolvedValue({ data: { id: 100 } })

      const { result } = renderHook(() => useCreateContact(), {
        wrapper: ({ children }) => (
          <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
        ),
      })

      await result.current.mutateAsync(MOCK_CONTACT_DATA)

      await waitFor(() => {
        expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['contacts'] })
        expect(setQueryDataSpy).toHaveBeenCalledWith(
          ['contacts', '100'],
          expect.objectContaining({ id: 100 }),
        )
      })
    })
  })

  describe('useUpdateContact', () => {
    it('updates contact successfully with simple ID', async () => {
      vi.mocked(api.put).mockResolvedValue({ data: { id: 1 } })
      const { result } = renderHook(() => useUpdateContact(), { wrapper: createWrapper() })
      await result.current.mutateAsync({ id: '1', data: MOCK_CONTACT_DATA })
      expect(api.put).toHaveBeenCalledWith('1', expect.any(Object))
    })

    it('updates contact successfully with IRI', async () => {
      vi.mocked(api.put).mockResolvedValue({ data: { id: 1 } })
      const { result } = renderHook(() => useUpdateContact(), { wrapper: createWrapper() })
      await result.current.mutateAsync({ id: '/api/contacts/1', data: MOCK_CONTACT_DATA })
      expect(api.put).toHaveBeenCalledWith('/contacts/1', expect.any(Object))
    })

    it('invalidates queries on success', async () => {
      const queryClient = new QueryClient()
      const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries')
      const setQueryDataSpy = vi.spyOn(queryClient, 'setQueryData')

      vi.mocked(api.put).mockResolvedValue({ data: { id: 1 } })

      const { result } = renderHook(() => useUpdateContact(), {
        wrapper: ({ children }) => (
          <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
        ),
      })

      await result.current.mutateAsync({ id: '/api/contacts/1', data: MOCK_CONTACT_DATA })

      await waitFor(() => {
        expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['contacts'] })
        expect(setQueryDataSpy).toHaveBeenCalledWith(['contacts', '1'], expect.any(Object))
        expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['contacts', '1', 'timeline'] })
      })
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

    it('invalidates queries on success', async () => {
      const queryClient = new QueryClient()
      const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries')

      vi.mocked(api.post).mockResolvedValue({ data: {} })

      const { result } = renderHook(() => useCreateContactDate(), {
        wrapper: ({ children }) => (
          <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
        ),
      })

      await result.current.mutateAsync({ date: '2023-01-01', contact: '/api/contacts/1' })

      await waitFor(() => {
        expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['contacts'] })
        expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['contacts', '1', 'timeline'] })
      })
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
