import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'

import { useAuth } from '@/hooks/useAuth'
import { api } from '@/lib/axios'
import type { components } from '@/types/schema'

type UserPref = components['schemas']['UserPref.jsonld-user_pref.read']
type UserPrefType = 'language' | 'dateFormat'

interface UserPrefsContextType {
  language: string
  dateFormat: string
  setLanguage: (lang: string) => Promise<void>
  setDateFormat: (format: string) => Promise<void>
  formatDate: (date: Date | string | null | undefined) => string
  isLoading: boolean
}

const UserPrefsContext = createContext<UserPrefsContextType | null>(null)

export function UserPrefsProvider({ children }: { children: ReactNode }) {
  const { i18n } = useTranslation()
  const { isAuthenticated } = useAuth()
  const queryClient = useQueryClient()
  const [language, setInternalLanguage] = useState<string>('en')
  const [dateFormat, setInternalDateFormat] = useState<string>('mm/dd/yyyy')

  // Fetch prefs
  const { data: prefs, isLoading } = useQuery({
    queryKey: ['user_prefs'],
    queryFn: async () => {
      const response = await api.get('/user_prefs')
      // Handle the "bug" where hydra:member might be just member
      const items = response.data['hydra:member'] || response.data.member || []
      return items as UserPref[]
    },
    enabled: isAuthenticated,
  })

  // Apply prefs when loaded
  useEffect(() => {
    if (prefs) {
      const langPref = prefs.find((p) => p.type === 'language')
      const datePref = prefs.find((p) => p.type === 'dateFormat')

      if (langPref?.value && langPref.value !== language) {
        setInternalLanguage(langPref.value)
        void i18n.changeLanguage(langPref.value)
      }
      if (datePref?.value) {
        setInternalDateFormat(datePref.value)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prefs, i18n])

  // Helpers to find existing pref ID
  const getPrefId = (type: UserPrefType) => {
    return prefs?.find((p) => p.type === type)?.['@id']
  }

  const getPrefRealId = (type: UserPrefType) => {
    const atId = getPrefId(type)
    return atId ? atId.split('/').pop() : null
  }

  // Mutation to save pref
  const savePrefMutation = useMutation({
    mutationFn: async ({ type, value }: { type: UserPrefType; value: string }) => {
      const id = getPrefRealId(type)
      if (id) {
        // PATCH
        await api.patch(
          `/user_prefs/${id}`,
          { value },
          {
            headers: { 'Content-Type': 'application/merge-patch+json' },
          },
        )
      } else {
        // PUT (Upsert)
        await api.put(`/user_prefs/${type}`, { value })
      }
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['user_prefs'] })
    },
  })

  const setLanguage = async (lang: string) => {
    setInternalLanguage(lang)
    await i18n.changeLanguage(lang)
    await savePrefMutation.mutateAsync({ type: 'language', value: lang })
  }

  const setDateFormat = async (format: string) => {
    setInternalDateFormat(format)
    await savePrefMutation.mutateAsync({ type: 'dateFormat', value: format })
  }

  const formatDate = (date: Date | string | null | undefined): string => {
    if (!date) {
      return ''
    }
    const d = new Date(date)
    if (isNaN(d.getTime())) {
      return ''
    }

    const day = String(d.getDate()).padStart(2, '0')
    const month = String(d.getMonth() + 1).padStart(2, '0')
    const year = d.getFullYear()

    if (dateFormat === 'dd.mm.yyyy') {
      return `${day}.${month}.${year}`
    }
    // Default mm/dd/yyyy
    return `${month}/${day}/${year}`
  }

  return (
    <UserPrefsContext.Provider
      value={{
        language,
        dateFormat,
        setLanguage,
        setDateFormat,
        formatDate,
        isLoading,
      }}
    >
      {children}
    </UserPrefsContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useUserPrefs() {
  const context = useContext(UserPrefsContext)
  if (!context) {
    throw new Error('useUserPrefs must be used within a UserPrefsProvider')
  }
  return context
}
