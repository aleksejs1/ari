import { createContext, type ReactNode, useCallback, useContext, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useQuery } from '@tanstack/react-query'

import { useAuth } from '@/hooks/useAuth'
import { usePreferencesStorage } from '@/hooks/usePreferencesStorage'
import { api } from '@/lib/axios'
import type { DateInput } from '@/lib/dateFormatting'
import { formatDate as formatDateFn, formatTime as formatTimeFn } from '@/lib/dateFormatting'
import { queryKeys } from '@/lib/queryKeys'
import type { components } from '@/types/schema'

type UserPref = components['schemas']['UserPref.jsonld-user_pref.read']

export interface RegionalPrefsContextType {
  language: string
  dateFormat: string
  timeFormat: string
  timezone: string
  formatDate: (date: DateInput) => string
  formatTime: (date: DateInput) => string
  setLanguage: (lang: string) => Promise<void>
  setDateFormat: (format: string) => Promise<void>
  setTimeFormat: (format: string) => Promise<void>
  setTimezone: (tz: string) => Promise<void>
  isLoading: boolean
}

const RegionalPrefsContext = createContext<RegionalPrefsContextType>({
  language: 'en',
  dateFormat: 'mm/dd/yyyy',
  timeFormat: '24h',
  timezone: 'UTC',
  formatDate: () => '',
  formatTime: () => '',
  setLanguage: async () => {
    /* noop */
  },
  setDateFormat: async () => {
    /* noop */
  },
  setTimeFormat: async () => {
    /* noop */
  },
  setTimezone: async () => {
    /* noop */
  },
  isLoading: true,
})

export function RegionalPrefsProvider({ children }: { children: ReactNode }) {
  const { i18n } = useTranslation()
  const { isAuthenticated } = useAuth()

  const { data: prefs, isLoading } = useQuery({
    queryKey: queryKeys.userPrefs,
    queryFn: async () => {
      const response = await api.get('/user_prefs')
      return (response.data.member || []) as UserPref[]
    },
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000,
  })

  const saveMutation = usePreferencesStorage(prefs)
  const getPref = useCallback(
    (type: string, defaultVal: string) => prefs?.find((p) => p.type === type)?.value || defaultVal,
    [prefs],
  )

  const language = getPref('language', 'en')
  const dateFormat = getPref('dateFormat', 'mm/dd/yyyy')
  const rawTimeFormat = getPref('timeFormat', '24h')
  // Validate against allowlist to prevent unexpected format strings reaching formatTimeFn
  const timeFormat = rawTimeFormat === '12h' || rawTimeFormat === '24h' ? rawTimeFormat : '24h'
  const rawTimezone = getPref('timezone', Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC')
  // Validate timezone via Intl to guard against stale/invalid values stored in DB
  const timezone = (() => {
    try {
      Intl.DateTimeFormat(undefined, { timeZone: rawTimezone })
      return rawTimezone
    } catch {
      return 'UTC'
    }
  })()

  useEffect(() => {
    i18n.changeLanguage(language).catch((err: unknown) => {
      console.error('[RegionalPrefs] Failed to change language:', err)
    })
  }, [language, i18n])

  const setLanguage = useCallback(
    async (lang: string) => {
      await i18n.changeLanguage(lang)
      await saveMutation.mutateAsync({ type: 'language', value: lang })
    },
    [i18n, saveMutation],
  )
  const setDateFormat = useCallback(
    async (format: string) => {
      await saveMutation.mutateAsync({ type: 'dateFormat', value: format })
    },
    [saveMutation],
  )
  const setTimeFormat = useCallback(
    async (format: string) => {
      await saveMutation.mutateAsync({ type: 'timeFormat', value: format })
    },
    [saveMutation],
  )
  const setTimezone = useCallback(
    async (tz: string) => {
      await saveMutation.mutateAsync({ type: 'timezone', value: tz })
    },
    [saveMutation],
  )
  const formatDate = useCallback((date: DateInput) => formatDateFn(date, dateFormat), [dateFormat])
  const formatTime = useCallback((date: DateInput) => formatTimeFn(date, timeFormat), [timeFormat])

  const value = useMemo(
    () => ({
      language,
      dateFormat,
      timeFormat,
      timezone,
      formatDate,
      formatTime,
      setLanguage,
      setDateFormat,
      setTimeFormat,
      setTimezone,
      isLoading,
    }),
    [
      language,
      dateFormat,
      timeFormat,
      timezone,
      formatDate,
      formatTime,
      setLanguage,
      setDateFormat,
      setTimeFormat,
      setTimezone,
      isLoading,
    ],
  )

  return <RegionalPrefsContext.Provider value={value}>{children}</RegionalPrefsContext.Provider>
}

export function useRegionalPrefs(): RegionalPrefsContextType {
  const ctx = useContext(RegionalPrefsContext)
  if (!ctx) {
    throw new Error('useRegionalPrefs must be used within RegionalPrefsProvider')
  }
  return ctx
}
