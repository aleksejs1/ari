import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useEffect, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'

import { useAuth } from '@/hooks/useAuth'
import { UserPrefsContext } from '@/hooks/useUserPrefsContext'
import { api } from '@/lib/axios'
import type { components } from '@/types/schema'

type UserPref = components['schemas']['UserPref.jsonld-user_pref.read']
type UserPrefType = 'language' | 'dateFormat' | 'favourite_group_name'

export function UserPrefsProvider({ children }: { children: ReactNode }) {
  const { i18n } = useTranslation()
  const { isAuthenticated } = useAuth()
  const queryClient = useQueryClient()

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

  // Derive language and dateFormat from prefs (no separate state needed)
  const language = prefs?.find((p) => p.type === 'language')?.value || 'en'
  const dateFormat = prefs?.find((p) => p.type === 'dateFormat')?.value || 'mm/dd/yyyy'
  const favouriteGroupName =
    prefs?.find((p) => p.type === 'favourite_group_name')?.value || 'favourites'

  // Sync i18n language when derived language changes
  useEffect(() => {
    void i18n.changeLanguage(language)
  }, [language, i18n])

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
    await i18n.changeLanguage(lang)
    await savePrefMutation.mutateAsync({ type: 'language', value: lang })
  }

  const setDateFormat = async (format: string) => {
    await savePrefMutation.mutateAsync({ type: 'dateFormat', value: format })
  }

  const setFavouriteGroupName = async (name: string) => {
    await savePrefMutation.mutateAsync({ type: 'favourite_group_name', value: name })
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
        favouriteGroupName,
        setLanguage,
        setDateFormat,
        setFavouriteGroupName,
        formatDate,
        isLoading,
      }}
    >
      {children}
    </UserPrefsContext.Provider>
  )
}
