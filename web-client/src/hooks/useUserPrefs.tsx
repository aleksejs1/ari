import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { parseISO } from 'date-fns'
import { useEffect, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'

import { useAuth } from '@/hooks/useAuth'
import { UserPrefsContext, type UserPrefsContextType } from '@/hooks/useUserPrefsContext'
import { api } from '@/lib/axios'
import type { components } from '@/types/schema'

type UserPref = components['schemas']['UserPref.jsonld-user_pref.read']
type UserPrefType =
  | 'language'
  | 'dateFormat'
  | 'timeFormat'
  | 'favourite_group_name'
  | 'googleSyncOnUpdate'
  | 'dashboard_notification_policy'
type DateInput = Date | string | null | undefined

interface UserPrefsProviderProps {
  children: ReactNode
}

const formatDateHelper = (date: DateInput, dateFormat: string): string => {
  if (!date) {
    return ''
  }
  const d = typeof date === 'string' ? parseISO(date) : new Date(date)
  if (isNaN(d.getTime())) {
    return ''
  }

  const day = String(d.getDate()).padStart(2, '0')
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const year = d.getFullYear()

  if (dateFormat === 'dd.mm.yyyy') {
    return `${day}.${month}.${year}`
  }
  return `${month}/${day}/${year}`
}

const parseTimeString = (dateStr: string): { hours: number; minutes: string } | null => {
  if (/^\d{1,2}:\d{2}$/.test(dateStr)) {
    const [hStr, mStr] = dateStr.split(':')
    return {
      hours: parseInt(hStr, 10),
      minutes: mStr,
    }
  }
  return null
}

const formatTimeHelper = (date: DateInput, timeFormat: string): string => {
  if (!date) {
    return ''
  }

  let hours: number
  let minutes: string

  if (typeof date === 'string') {
    const parsed = parseTimeString(date)
    if (parsed) {
      hours = parsed.hours
      minutes = parsed.minutes
    } else {
      const d = parseISO(date)
      if (isNaN(d.getTime())) {
        return ''
      }
      hours = d.getHours()
      minutes = String(d.getMinutes()).padStart(2, '0')
    }
  } else {
    // Date object
    if (isNaN(date.getTime())) {
      return ''
    }
    hours = date.getHours()
    minutes = String(date.getMinutes()).padStart(2, '0')
  }

  if (timeFormat === '12h') {
    const period = hours >= 12 ? 'PM' : 'AM'
    const h = hours % 12 || 12
    return `${h}:${minutes} ${period}`
  }

  return `${String(hours).padStart(2, '0')}:${minutes}`
}

const useFetchUserPrefs = (isAuthenticated: boolean) => {
  return useQuery({
    queryKey: ['user_prefs'],
    queryFn: async () => {
      const response = await api.get('/user_prefs')
      const items = response.data.member || []
      return items as UserPref[]
    },
    enabled: isAuthenticated,
  })
}

const useSaveUserPref = (prefs: UserPref[] | undefined) => {
  const queryClient = useQueryClient()

  const getPrefRealId = (type: UserPrefType) => {
    const atId = prefs?.find((p) => p.type === type)?.['@id']
    return atId ? atId.split('/').pop() : null
  }

  return useMutation({
    mutationFn: async ({ type, value }: { type: UserPrefType; value: string }) => {
      const id = getPrefRealId(type)
      if (id) {
        await api.patch(
          `/user_prefs/${id}`,
          { value },
          { headers: { 'Content-Type': 'application/merge-patch+json' } },
        )
      } else {
        await api.put(`/user_prefs/${type}`, { value })
      }
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['user_prefs'] })
    },
  })
}

const getPrefValue = (
  prefs: UserPref[] | undefined,
  type: UserPrefType,
  defaultVal: string,
): string => {
  return prefs?.find((p) => p.type === type)?.value || defaultVal
}

const useUserPrefsLogic = () => {
  const { i18n } = useTranslation()
  const { isAuthenticated } = useAuth()

  const { data: prefs, isLoading } = useFetchUserPrefs(isAuthenticated)
  const savePrefMutation = useSaveUserPref(prefs)

  // Derive preferences
  const language = getPrefValue(prefs, 'language', 'en')
  const dateFormat = getPrefValue(prefs, 'dateFormat', 'mm/dd/yyyy')
  const timeFormat = getPrefValue(prefs, 'timeFormat', '24h')
  const favouriteGroupName = getPrefValue(prefs, 'favourite_group_name', 'favourites')
  const googleSyncOnUpdate = getPrefValue(prefs, 'googleSyncOnUpdate', '0')
  const dashboardNotificationPolicy = getPrefValue(prefs, 'dashboard_notification_policy', '')

  useEffect(() => {
    void i18n.changeLanguage(language)
  }, [language, i18n])

  return {
    language,
    dateFormat,
    timeFormat,
    favouriteGroupName,
    googleSyncOnUpdate,
    dashboardNotificationPolicy,
    isLoading,
    savePrefMutation,
    i18n,
  }
}

export function UserPrefsProvider({ children }: UserPrefsProviderProps) {
  const {
    language,
    dateFormat,
    timeFormat,
    favouriteGroupName,
    googleSyncOnUpdate,
    dashboardNotificationPolicy, // Added
    isLoading,
    savePrefMutation,
    i18n,
  } = useUserPrefsLogic()

  const setLanguage = async (lang: string) => {
    await i18n.changeLanguage(lang)
    await savePrefMutation.mutateAsync({ type: 'language', value: lang })
  }

  const setDateFormat = async (format: string) => {
    await savePrefMutation.mutateAsync({ type: 'dateFormat', value: format })
  }

  const setTimeFormat = async (format: string) => {
    await savePrefMutation.mutateAsync({ type: 'timeFormat', value: format })
  }

  const setFavouriteGroupName = async (name: string) => {
    await savePrefMutation.mutateAsync({ type: 'favourite_group_name', value: name })
  }

  const setGoogleSyncOnUpdate = async (value: string) => {
    await savePrefMutation.mutateAsync({ type: 'googleSyncOnUpdate', value })
  }

  const setDashboardNotificationPolicy = async (value: string) => {
    await savePrefMutation.mutateAsync({ type: 'dashboard_notification_policy', value })
  }

  const formatDate = (date: DateInput): string => {
    return formatDateHelper(date, dateFormat)
  }

  const formatTime = (date: DateInput): string => {
    return formatTimeHelper(date, timeFormat)
  }

  return (
    <UserPrefsProviderContext
      value={{
        language,
        dateFormat,
        timeFormat,
        favouriteGroupName,
        googleSyncOnUpdate,
        dashboardNotificationPolicy,
        setLanguage,
        setDateFormat,
        setTimeFormat,
        setFavouriteGroupName,
        setGoogleSyncOnUpdate,
        setDashboardNotificationPolicy,
        formatDate,
        formatTime,
        isLoading,
      }}
    >
      {children}
    </UserPrefsProviderContext>
  )
}

function UserPrefsProviderContext({
  children,
  value,
}: {
  children: ReactNode
  value: UserPrefsContextType
}) {
  return <UserPrefsContext.Provider value={value}>{children}</UserPrefsContext.Provider>
}
