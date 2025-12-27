import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useContacts, useCreateContact, useDeleteContact, useUpdateContact } from './useContacts'

import { api } from '@/lib/axios'

// Setup React Query Wrapper
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  })
  // eslint-disable-next-line react/display-name
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}

vi.mock('@/lib/axios', () => ({
  api: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}))

describe('useContacts Hooks', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('useContacts', () => {
    it('fetches contacts successfully', async () => {
      const mockData = { member: [] }
      vi.mocked(api.get).mockResolvedValue({ data: mockData })

      const { result } = renderHook(() => useContacts(1), { wrapper: createWrapper() })

      await waitFor(() => expect(result.current.isSuccess).toBe(true))

      expect(result.current.data).toEqual(mockData)
      expect(result.current.isPlaceholderData).toBeDefined()
      expect(api.get).toHaveBeenCalledWith('/contacts?page=1')
    })
  })

  describe('useCreateContact', () => {
    it('creates contact successfully', async () => {
      vi.mocked(api.post).mockResolvedValue({ data: { id: 1 } })

      const { result } = renderHook(() => useCreateContact(), { wrapper: createWrapper() })

      await result.current.mutateAsync({ contactNames: [], contactDates: [] })

      expect(api.post).toHaveBeenCalledWith('/contacts', { contactNames: [], contactDates: [] })
    })
  })

  describe('useUpdateContact', () => {
    it('updates contact successfully', async () => {
      vi.mocked(api.put).mockResolvedValue({ data: { id: 1 } })

      const { result } = renderHook(() => useUpdateContact(), { wrapper: createWrapper() })

      await result.current.mutateAsync({
        id: '/api/contacts/1',
        data: { contactNames: [], contactDates: [] },
      })

      expect(api.put).toHaveBeenCalledWith('/contacts/1', { contactNames: [], contactDates: [] })
    })
  })

  describe('useDeleteContact', () => {
    it('deletes contact successfully', async () => {
      vi.mocked(api.delete).mockResolvedValue({})

      const { result } = renderHook(() => useDeleteContact(), { wrapper: createWrapper() })

      await result.current.mutateAsync('/api/contacts/1')

      expect(api.delete).toHaveBeenCalledWith('/contacts/1')
    })
  })
})
