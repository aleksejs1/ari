import { jwtDecode } from 'jwt-decode'
import { useState, type ReactNode } from 'react'

import { AuthContext } from './AuthContextInstance'

import type { User, AuthState } from '@/types/auth'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>(() => {
    const token = localStorage.getItem('token')
    if (token) {
      try {
        const decoded = jwtDecode<{ username: string }>(token)
        const user: User = {
          uuid: decoded.username,
        }
        return { user, token, isAuthenticated: true, isLoading: false }
      } catch {
        localStorage.removeItem('token')
      }
    }
    return {
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
    }
  })

  const login = (token: string) => {
    localStorage.setItem('token', token)
    try {
      const decoded = jwtDecode<{ username: string }>(token)
      const user: User = {
        uuid: decoded.username,
      }
      setState({
        user,
        token,
        isAuthenticated: true,
        isLoading: false,
      })
    } catch (e) {
      console.error('Login failed to decode token', e)
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    setState({ user: null, token: null, isAuthenticated: false, isLoading: false })
  }

  return <AuthContext.Provider value={{ ...state, login, logout }}>{children}</AuthContext.Provider>
}
