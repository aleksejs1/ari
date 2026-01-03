import { createContext } from 'react'

export interface UserPrefsContextType {
  language: string
  dateFormat: string
  setLanguage: (lang: string) => Promise<void>
  setDateFormat: (format: string) => Promise<void>
  formatDate: (date: Date | string | null | undefined) => string
  isLoading: boolean
}

export const UserPrefsContext = createContext<UserPrefsContextType | null>(null)
