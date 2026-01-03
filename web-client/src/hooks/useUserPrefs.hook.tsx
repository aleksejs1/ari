import { useContext } from 'react'

import { UserPrefsContext, type UserPrefsContextType } from './useUserPrefsContext'

export function useUserPrefs(): UserPrefsContextType {
  const context = useContext(UserPrefsContext)
  if (!context) {
    throw new Error('useUserPrefs must be used within a UserPrefsProvider')
  }
  return context
}
