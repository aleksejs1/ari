import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { useQuery } from '@tanstack/react-query'

import { useAuth } from '@/hooks/useAuth'
import { usePreferencesStorage } from '@/hooks/usePreferencesStorage'
import { api } from '@/lib/axios'
import { queryKeys } from '@/lib/queryKeys'
import { storage, STORAGE_KEYS } from '@/lib/storage'
import type { components } from '@/types/schema'

type UserPref = components['schemas']['UserPref.jsonld-user_pref.read']
type Theme = 'light' | 'dark' | 'system'

export interface UIPrefsContextType {
  theme: Theme
  showLogo: string
  dashboardSettings: string
  contactTableSettings: string
  setTheme: (theme: Theme) => Promise<void>
  setShowLogo: (value: string) => Promise<void>
  setDashboardSettings: (value: string) => Promise<void>
  setContactTableSettings: (value: string) => Promise<void>
  isLoading: boolean
}

const UIPrefsContext = createContext<UIPrefsContextType>({
  theme: 'system',
  showLogo: '1',
  dashboardSettings: '{}',
  contactTableSettings: '{}',
  setTheme: async () => {
    /* noop */
  },
  setShowLogo: async () => {
    /* noop */
  },
  setDashboardSettings: async () => {
    /* noop */
  },
  setContactTableSettings: async () => {
    /* noop */
  },
  isLoading: true,
})

export function UIPrefsProvider({ children }: { children: ReactNode }) {
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

  const showLogo = getPref('show_logo', '1')
  const dashboardSettings = getPref('dashboard_settings', '{}')
  const contactTableSettings = getPref('contact_table_settings', '{}')
  const themeFromPrefs = getPref('theme', '') as Theme | ''

  const [theme, setThemeState] = useState<Theme>(() => {
    const local = storage.get(STORAGE_KEYS.THEME)
    const validThemes: Theme[] = ['light', 'dark', 'system']
    if (local && validThemes.includes(local as Theme)) {
      return local as Theme
    }
    if (themeFromPrefs !== '') {
      return themeFromPrefs
    }
    return 'system'
  })

  useEffect(() => {
    if (themeFromPrefs && themeFromPrefs !== theme) {
      setThemeState(themeFromPrefs)
      storage.set(STORAGE_KEYS.THEME, themeFromPrefs)
    }
  }, [themeFromPrefs]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const root = window.document.documentElement
    root.classList.remove('light', 'dark')
    const applyTheme = (t: Theme) => {
      if (t === 'system') {
        root.classList.add(
          window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light',
        )
      } else {
        root.classList.add(t)
      }
    }
    applyTheme(theme)
    if (theme === 'system') {
      const mq = window.matchMedia('(prefers-color-scheme: dark)')
      const handler = () => applyTheme('system')
      mq.addEventListener('change', handler)
      return () => mq.removeEventListener('change', handler)
    }
  }, [theme])

  const setTheme = useCallback(
    async (newTheme: Theme) => {
      setThemeState(newTheme)
      storage.set(STORAGE_KEYS.THEME, newTheme)
      if (isAuthenticated) {
        await saveMutation.mutateAsync({ type: 'theme', value: newTheme })
      }
    },
    [isAuthenticated, saveMutation],
  )
  const setShowLogo = useCallback(
    async (value: string) => {
      await saveMutation.mutateAsync({ type: 'show_logo', value })
    },
    [saveMutation],
  )
  const setDashboardSettings = useCallback(
    async (value: string) => {
      await saveMutation.mutateAsync({ type: 'dashboard_settings', value })
    },
    [saveMutation],
  )
  const setContactTableSettings = useCallback(
    async (value: string) => {
      await saveMutation.mutateAsync({ type: 'contact_table_settings', value })
    },
    [saveMutation],
  )

  const value = useMemo(
    () => ({
      theme,
      showLogo,
      dashboardSettings,
      contactTableSettings,
      setTheme,
      setShowLogo,
      setDashboardSettings,
      setContactTableSettings,
      isLoading,
    }),
    [
      theme,
      showLogo,
      dashboardSettings,
      contactTableSettings,
      setTheme,
      setShowLogo,
      setDashboardSettings,
      setContactTableSettings,
      isLoading,
    ],
  )

  return <UIPrefsContext.Provider value={value}>{children}</UIPrefsContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useUIPrefs(): UIPrefsContextType {
  const ctx = useContext(UIPrefsContext)
  if (!ctx) {
    throw new Error('useUIPrefs must be used within UIPrefsProvider')
  }
  return ctx
}
