import { createContext } from 'react'

export interface UserPrefsContextType {
  language: string
  dateFormat: string
  timeFormat: string
  favouriteGroupName: string
  setLanguage: (lang: string) => Promise<void>
  setDateFormat: (format: string) => Promise<void>
  setTimeFormat: (format: string) => Promise<void>
  setFavouriteGroupName: (name: string) => Promise<void>
  formatDate: (date: Date | string | null | undefined) => string
  formatTime: (date: Date | string | null | undefined) => string
  isLoading: boolean
}

export const UserPrefsContext = createContext<UserPrefsContextType>({
  language: 'en',
  dateFormat: 'mm/dd/yyyy',
  timeFormat: '24h',
  favouriteGroupName: 'favourites',
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
  formatDate: () => '',
  formatTime: () => '',
  isLoading: true,
})
