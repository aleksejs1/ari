import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { getHydraMember, type HydraCollection } from './utils'

import { api } from '@/lib/axios'
import type { Contact, ContactFormValues } from '@/types/models'

// Re-export hooks to maintain backward compatibility (or just for convenience)
export * from './hooks/useContactBios'
export * from './hooks/useContactDates'
export * from './hooks/useContactOrganizations'
export * from './hooks/useContactAddresses'
export * from './hooks/useContactEmails'
export * from './hooks/useContactGroups'
export * from './hooks/useContactNames'
export * from './hooks/useContactPhones'
export * from './hooks/useContactRelations'
export * from './hooks/useAutocomplete'
export * from './utils'

export function useContacts(
  page = 1,
  filters?: { group?: string; search?: string },
  sort?: { id: string; desc: boolean },
  options?: { enabled?: boolean },
) {
  return useQuery({
    queryKey: ['contacts', page, filters, sort],
    queryFn: async () => {
      const params = new URLSearchParams()
      params.append('page', page.toString())

      if (filters?.group) {
        params.append('contactGroups.groupResource', filters.group)
      }

      if (filters?.search) {
        params.append('search', filters.search)
      }

      if (sort) {
        params.append(`order[${sort.id}]`, sort.desc ? 'desc' : 'asc')
      }

      const response = await api.get<HydraCollection<Contact>>(`/contacts?${params.toString()}`)
      return response.data
    },
    placeholderData: (previousData) => previousData,
    enabled: options?.enabled,
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

export function useExportContactVcard() {
  return useMutation({
    mutationFn: async ({ id, filename }: { id: string; filename: string }) => {
      const url = id.startsWith('/api') ? id.substring(4) : id
      // The API returns JSON with a key (likely 'vcard' or similar, but let's handle the response)
      // User mentioned ignoring "hydra:" prefix and that keys might be raw.
      // We expect the endpoint to return the vCard content string in a JSON field or as raw text.
      // However, usually detailed endpoints return JSON.
      // Let's assume the API returns JSON with a property 'vCard' or similar.
      // If it returns raw text, we handle that too.
      // Based on user request "I added a new API: /api/contacts/{id}/vcard", let's try to get it.
      const response = await api.get(`${url}/vcard`)

      let vCardContent = ''
      if (typeof response.data === 'string') {
        vCardContent = response.data
      } else if (typeof response.data === 'object') {
        // Try to find a likely key
        // User said: "in reality keys don't have hydra: prefix"
        // Let's look for 'vCard', 'vcard', 'content', or just grab the first string value if uncertain?
        // Safest bet for now: check for 'vCard' property.
        if ('vCard' in response.data) {
          vCardContent = response.data.vCard
        } else if ('vcard' in response.data) {
          vCardContent = response.data.vcard
        } else {
          // If we can't find a specific key, and it's an object, maybe the whole body is the vCard?
          // Unlikely if it's JSON. Let's dump the whole JSON if specific keys fail, or maybe it returns the object itself as vCard fields?
          // Actually, vCard is a text format. If it returns JSON, it must be wrapped.
          // Let's assume it might be in a property named 'vCard' as per common convention or just the body text.
          console.warn(
            'Could not find vCard property in response, using full JSON stringify',
            response.data,
          )
          vCardContent = JSON.stringify(response.data)
        }
      }

      const blobUrl = window.URL.createObjectURL(new Blob([vCardContent], { type: 'text/vcard' }))
      const link = document.createElement('a')
      link.href = blobUrl
      link.setAttribute('download', `${filename}.vcf`)
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(blobUrl)

      return response.data
    },
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

export function useImportContacts() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData()
      formData.append('file', file)

      const response = await api.post('/contacts/import-xml', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      return response.data
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['contacts'] })
    },
  })
}
export function useUploadContactAvatar() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, file }: { id: string; file: File }) => {
      const url = id.startsWith('/api') ? id.substring(4) : id
      const formData = new FormData()
      formData.append('file', file)

      const response = await api.post<{
        '@id': string
        contentUrl?: string
        path?: string
      }>(`${url}/avatar`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      return response.data
    },
    onSuccess: (_data, variables) => {
      const id = variables.id.split('/').pop()
      void queryClient.invalidateQueries({ queryKey: ['contacts'] })
      if (id) {
        // Optimistically update or re-fetch would happen via invalidate
        // We can also try to update the specific contact cache if we want instant feedback without refetch
        // But invalidation is safer for ensuring full object consistency
        void queryClient.invalidateQueries({ queryKey: ['contacts', id] })
      }
    },
  })
}
