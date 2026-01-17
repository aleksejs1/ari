import { createContext } from 'react'

import type { AuthState } from '@/types/auth'

export interface AuthContextType extends AuthState {
  login: (token: string, refreshToken: string) => void
  logout: () => Promise<void>
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)
