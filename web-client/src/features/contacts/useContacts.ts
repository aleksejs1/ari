import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

import { api } from '@/lib/axios'
import { type Contact, type ContactFormValues, type ContactDate, type Group } from '@/types/models'

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
  if (!data) {
    return []
  }
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

export function useContacts(page = 1, filters?: { group?: string; search?: string }) {
  return useQuery({
    queryKey: ['contacts', page, filters],
    queryFn: async () => {
      const params = new URLSearchParams()
      params.append('page', page.toString())

      if (filters?.group) {
        params.append('contactGroups.groupResource', filters.group)
      }

      if (filters?.search) {
        params.append('search', filters.search)
      }

      const response = await api.get<HydraCollection<Contact>>(`/contacts?${params.toString()}`)
      return response.data
    },
    placeholderData: (previousData) => previousData,
  })
}

export function useContact(id: string) {
  return useQuery({
    queryKey: ['contacts', id],
    queryFn: async () => {
      const url = id.startsWith('/api') ? id.substring(4) : `/contacts/${id}`
      const response = await api.get<Contact>(url)
      return response.data
    },
    enabled: !!id,
    staleTime: 30000, // 30 seconds
  })
}

export function useCreateContact() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: ContactFormValues) => {
      const response = await api.post('/contacts', data)
      return response.data
    },
    onSuccess: (newContact) => {
      void queryClient.invalidateQueries({ queryKey: ['contacts'] })
      if (newContact.id) {
        queryClient.setQueryData(['contacts', newContact.id.toString()], newContact)
      }
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
    onSuccess: (updatedContact, variables) => {
      const id = variables.id.split('/').pop()
      void queryClient.invalidateQueries({ queryKey: ['contacts'] })
      if (id) {
        queryClient.setQueryData(['contacts', id], updatedContact)
        void queryClient.invalidateQueries({ queryKey: ['contacts', id, 'timeline'] })
      }
    },
  })
}

export function usePatchContact() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Contact> }) => {
      const url = id.startsWith('/api') ? id.substring(4) : id
      const response = await api.patch(url, data, {
        headers: {
          'Content-Type': 'application/merge-patch+json',
        },
      })
      return response.data
    },
    onSuccess: (updatedContact, variables) => {
      const id = variables.id.split('/').pop()
      void queryClient.invalidateQueries({ queryKey: ['contacts'] })
      if (id) {
        queryClient.setQueryData(['contacts', id], updatedContact)
        void queryClient.invalidateQueries({ queryKey: ['contacts', id, 'timeline'] })
      }
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
      void queryClient.invalidateQueries({ queryKey: ['contacts'] })
    },
  })
}

export function useUpdateContactDate() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<ContactDate> }) => {
      const url = id.startsWith('/api') ? id.substring(4) : id
      const response = await api.put(url, data)
      return response.data
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['contacts'] })
    },
  })
}

export function useCreateContactDate() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: Omit<Partial<ContactDate>, 'contact'> & { contact: string }) => {
      const response = await api.post('/contact_dates', data)
      return response.data
    },
    onSuccess: (_, variables) => {
      const contactId = variables.contact.split('/').pop()
      void queryClient.invalidateQueries({ queryKey: ['contacts'] })
      if (contactId) {
        void queryClient.invalidateQueries({ queryKey: ['contacts', contactId, 'timeline'] })
      }
    },
  })
}
export function useGroups() {
  return useQuery({
    queryKey: ['groups'],
    queryFn: async () => {
      const response = await api.get<HydraCollection<Group>>('/groups')
      return getHydraMember(response.data)
    },
  })
}

export function useCreateGroup() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: Partial<Group>) => {
      const response = await api.post<Group>('/groups', data)
      return response.data
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['groups'] })
    },
  })
}

export function useUpdateContactGroups() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ contactId, groupIds }: { contactId: string; groupIds: string[] }) => {
      // We can't batch update groups easily with the current API structure if it's strict REST.
      // However, usually we might update the contact entity itself with the new list of groups.
      // Assuming the contact entity allows writing to `contactGroups` or similar, OR we have to manage relations.
      //
      // If the backend expects an array of group IRIs to replace the current set:
      // PUT /contacts/{id} { contactGroups: [ "iri1", "iri2" ] }
      //
      // Let's assume the backend supports updating the contactGroups collection on the contact resource.

      const url = contactId.startsWith('/api') ? contactId.substring(4) : contactId

      // Use PATCH with merge-patch+json to avoid overwriting other fields.
      const response = await api.patch(
        url,
        {
          contactGroups: groupIds.map((id) => ({ groupResource: id })),
        },
        {
          headers: {
            'Content-Type': 'application/merge-patch+json',
          },
        },
      )
      return response.data
    },
    onSuccess: (_, variables) => {
      const id = variables.contactId.split('/').pop()
      void queryClient.invalidateQueries({ queryKey: ['contacts'] })
      if (id) {
        void queryClient.invalidateQueries({ queryKey: ['contacts', id] })
      }
    },
  })
}

export function useSimilarContacts(id: string) {
  return useQuery({
    queryKey: ['contacts', id, 'similar'],
    queryFn: async () => {
      const url = id.startsWith('/api') ? id.substring(4) : id
      // The endpoint is /api/contacts/{id}/similar.
      // If id is numeric "1", url should be "/contacts/1/similar".
      // If id is "/api/contacts/1", url (substring) is "/contacts/1".
      // Then append "/similar".
      const fullUrl = `${url}/similar`
      const response = await api.get<HydraCollection<Contact>>(fullUrl)
      // User noted that keys might lack "hydra:" prefix.
      // getHydraMember parses "member" key, which matches the "no prefix" scenario.
      return getHydraMember(response.data)
    },
    enabled: !!id,
  })
}

export function useCreateContactRelation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: { contact: string; relatedContact: string; type: string }) => {
      const response = await api.post('/contact_relations', data)
      return response.data
    },
    onSuccess: (_, variables) => {
      const contactId = variables.contact.split('/').pop()
      const relatedId = variables.relatedContact.split('/').pop()
      void queryClient.invalidateQueries({ queryKey: ['contacts', contactId] })
      if (relatedId) {
        void queryClient.invalidateQueries({ queryKey: ['contacts', relatedId] })
      }
    },
  })
}
