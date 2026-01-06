import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { getHydraMember, type HydraCollection } from './utils'

import { api } from '@/lib/axios'
import type { Contact, ContactFormValues } from '@/types/models'

// Re-export hooks to maintain backward compatibility (or just for convenience)
export * from './hooks/useContactBios'
export * from './hooks/useContactDates'
export * from './hooks/useContactOrganizations'
export * from './hooks/useContactEmails'
export * from './hooks/useContactGroups'
export * from './hooks/useContactNames'
export * from './hooks/useContactPhones'
export * from './hooks/useContactRelations'
export * from './utils'

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

export function useSimilarContacts(id: string) {
  return useQuery({
    queryKey: ['contacts', id, 'similar'],
    queryFn: async () => {
      const url = id.startsWith('/api') ? id.substring(4) : id
      const fullUrl = `${url}/similar`
      const response = await api.get<HydraCollection<Contact>>(fullUrl)
      return getHydraMember(response.data)
    },
    enabled: !!id,
  })
}

export function useExportContacts() {
  return useMutation({
    mutationFn: async () => {
      const response = await api.get('/contacts/export', {
        responseType: 'blob',
      })

      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute(
        'download',
        `ari_contacts_export_${new Date().toISOString().split('T')[0]}.xml`,
      )
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)

      return response.data
    },
  })
}
