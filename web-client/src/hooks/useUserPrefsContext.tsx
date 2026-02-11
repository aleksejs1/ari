import { createContext } from 'react'

export interface UserPrefsContextType {
  language: string
  dateFormat: string
  timeFormat: string
  favouriteGroupName: string
  googleSyncOnUpdate: string
  dashboardNotificationPolicy: string
  contactTableSettings: string
  dashboardSettings: string
  showLogo: string
  theme: 'light' | 'dark' | 'system'
  setLanguage: (lang: string) => Promise<void>
  setDateFormat: (format: string) => Promise<void>
  setTimeFormat: (format: string) => Promise<void>
  setFavouriteGroupName: (name: string) => Promise<void>
  setGoogleSyncOnUpdate: (value: string) => Promise<void>
  setDashboardNotificationPolicy: (value: string) => Promise<void>
  setContactTableSettings: (value: string) => Promise<void>
  setDashboardSettings: (value: string) => Promise<void>
  setShowLogo: (value: string) => Promise<void>
  setTheme: (theme: 'light' | 'dark' | 'system') => Promise<void>
  formatDate: (date: Date | string | null | undefined) => string
  formatTime: (date: Date | string | null | undefined) => string
  isLoading: boolean
}

export const UserPrefsContext = createContext<UserPrefsContextType>({
  language: 'en',
  dateFormat: 'mm/dd/yyyy',
  timeFormat: '24h',
  favouriteGroupName: 'favourites',
  googleSyncOnUpdate: '0',
  dashboardNotificationPolicy: '',
  contactTableSettings: '{}',
  dashboardSettings: '{}',
  showLogo: '1',
  theme: 'system',
  setLanguage: async () => {
    /* noop */
  },
  setDateFormat: async () => {
    /* noop */
  },
  setTimeFormat: async () => {
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
  setContactTableSettings: async () => {
    /* noop */
  },
  setDashboardSettings: async () => {
    /* noop */
  },
  setShowLogo: async () => {
    /* noop */
  },
  setTheme: async () => {
    /* noop */
  },
  formatDate: () => '',
  formatTime: () => '',
  isLoading: true,
})
