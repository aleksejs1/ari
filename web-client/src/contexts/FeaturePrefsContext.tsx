import { createContext, type ReactNode, useCallback, useContext, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'

import { useAuth } from '@/hooks/useAuth'
import { usePreferencesStorage } from '@/hooks/usePreferencesStorage'
import { api } from '@/lib/axios'
import { queryKeys } from '@/lib/queryKeys'
import type { components } from '@/types/schema'

type UserPref = components['schemas']['UserPref.jsonld-user_pref.read']

export interface FeaturePrefsContextType {
  aiContextLocale: string
  favouriteGroupName: string
  googleSyncOnUpdate: string
  dashboardNotificationPolicy: string
  setAiContextLocale: (locale: string) => Promise<void>
  setFavouriteGroupName: (name: string) => Promise<void>
  setGoogleSyncOnUpdate: (value: string) => Promise<void>
  setDashboardNotificationPolicy: (value: string) => Promise<void>
  isLoading: boolean
}

const FeaturePrefsContext = createContext<FeaturePrefsContextType>({
  aiContextLocale: '',
  favouriteGroupName: 'favourites',
  googleSyncOnUpdate: '0',
  dashboardNotificationPolicy: '',
  setAiContextLocale: async () => {
    /* noop */
  },
  setFavouriteGroupName: async () => {
    /* noop */
  },
  setGoogleSyncOnUpdate: async () => {
    /* noop */
  },
  setDashboardNotificationPolicy: async () => {
    /* noop */
  },
  isLoading: true,
})

export function FeaturePrefsProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth()

  const { data: prefs, isLoading } = useQuery({
    queryKey: queryKeys.userPrefs,
    queryFn: async () => {
      const response = await api.get('/user_prefs')
      return (response.data.member || []) as UserPref[]
    },
    enabled: isAuthenticated,
  })

  const saveMutation = usePreferencesStorage(prefs)
  const getPref = (type: string, defaultVal: string) =>
    prefs?.find((p) => p.type === type)?.value || defaultVal

  const aiContextLocale = getPref('ai_context_locale', '')
  const favouriteGroupName = getPref('favourite_group_name', 'favourites')
  const googleSyncOnUpdate = getPref('googleSyncOnUpdate', '0')
  const dashboardNotificationPolicy = getPref('dashboard_notification_policy', '')

  const setAiContextLocale = useCallback(
    async (locale: string) => {
      await saveMutation.mutateAsync({ type: 'ai_context_locale', value: locale })
    },
    [saveMutation],
  )
  const setFavouriteGroupName = useCallback(
    async (name: string) => {
      await saveMutation.mutateAsync({ type: 'favourite_group_name', value: name })
    },
    [saveMutation],
  )
  const setGoogleSyncOnUpdate = useCallback(
    async (value: string) => {
      await saveMutation.mutateAsync({ type: 'googleSyncOnUpdate', value })
    },
    [saveMutation],
  )
  const setDashboardNotificationPolicy = useCallback(
    async (value: string) => {
      await saveMutation.mutateAsync({ type: 'dashboard_notification_policy', value })
    },
    [saveMutation],
  )

  const value = useMemo(
    () => ({
      aiContextLocale,
      favouriteGroupName,
      googleSyncOnUpdate,
      dashboardNotificationPolicy,
      setAiContextLocale,
      setFavouriteGroupName,
      setGoogleSyncOnUpdate,
      setDashboardNotificationPolicy,
      isLoading,
    }),
    [
      aiContextLocale,
      favouriteGroupName,
      googleSyncOnUpdate,
      dashboardNotificationPolicy,
      setAiContextLocale,
      setFavouriteGroupName,
      setGoogleSyncOnUpdate,
      setDashboardNotificationPolicy,
      isLoading,
    ],
  )

  return <FeaturePrefsContext.Provider value={value}>{children}</FeaturePrefsContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useFeaturePrefs(): FeaturePrefsContextType {
  const ctx = useContext(FeaturePrefsContext)
  if (!ctx) {
    throw new Error('useFeaturePrefs must be used within FeaturePrefsProvider')
  }
  return ctx
}
