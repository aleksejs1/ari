import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

import { api } from '@/lib/axios'
import { type Contact, type ContactFormValues, type ContactName } from '@/types/models'

export interface HydraCollection<T> {
  member: T[]
  totalItems?: number
  view?: {
    '@id': string
    '@type': string
    first: string
    last: string
    next?: string
    previous?: string
  }
  [key: string]: unknown
}

export function getHydraMember<T>(data?: HydraCollection<T>): T[] {
  if (!data) return []
  return data['member'] ?? data.member ?? []
}

export function getHydraPagination<T>(data?: HydraCollection<T>, page = 1) {
  const totalItems = data?.['totalItems'] ?? data?.totalItems ?? 0
  const totalPages = Math.ceil(totalItems / 30)
  const view = data?.['view']

  return {
    totalItems,
    totalPages,
    hasNext: hasNextPage(view, totalPages, page),
    hasPrevious: hasPreviousPage(view, page),
  }
}

function hasNextPage(view: HydraCollection<unknown>['view'], totalPages: number, page: number) {
  return !!view?.['next'] || totalPages > page
}

function hasPreviousPage(view: HydraCollection<unknown>['view'], page: number) {
  return !!view?.['previous'] || page > 1
}

export function useContacts(page = 1) {
  return useQuery({
    queryKey: ['contacts', page],
    queryFn: async () => {
      const response = await api.get<HydraCollection<Contact>>(`/contacts?page=${page}`)
      return response.data
    },
    placeholderData: (previousData) => previousData,
  })
}

export function useCreateContact() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: ContactFormValues) => {
      // API Platform usually handles nested resources creation if Cascade Persist is on
      // Otherwise, might need to create Contact then POST names/dates.
      // Assuming standard POST /api/contacts accepts names/dates
      const response = await api.post('/contacts', data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] })
    },
  })
}

export function useUpdateContact() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: ContactFormValues }) => {
      const url = id.startsWith('/api') ? id.substring(4) : id
      const response = await api.put(url, data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] })
    },
  })
}

export function useDeleteContact() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      // id is IRI
      const url = id.startsWith('/api') ? id.substring(4) : id
      await api.delete(url)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] })
    },
  })
}

export function useUpdateContactName() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<ContactName> }) => {
      const url = id.startsWith('/api') ? id.substring(4) : id
      // Ensure we don't send @id/@type/id in the body if not needed, or just send what's changed
      // But usually PUT requires full object or PATCH for partial.
      // API Platform standard PUT replaces resource.
      const response = await api.put(url, data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] })
    },
  })
}

export function useCreateContactName() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: Partial<ContactName> & { contact: string }) => {
      const response = await api.post('/contact_names', data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] })
    },
  })
}

export function useDeleteContactName() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const url = id.startsWith('/api') ? id.substring(4) : id
      await api.delete(url)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] })
    },
  })
}
