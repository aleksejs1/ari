import { type ReactNode, useEffect, useState } from 'react'
import { jwtDecode } from 'jwt-decode'

import { api } from '@/lib/axios'
import { PluginLoader } from '@/lib/core/PluginLoader'
import type { AuthState, User } from '@/types/auth'

import { AuthContext } from './AuthContextInstance'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>(() => {
    const token = localStorage.getItem('token')
    const refreshToken = localStorage.getItem('refresh_token')
    if (token) {
      try {
        const decoded = jwtDecode<{ username: string }>(token)
        const user: User = {
          uuid: decoded.username,
        }
        return {
          user,
          token,
          refreshToken,
          isAuthenticated: true,
          isLoading: false,
          arePluginsLoaded: false,
        }
      } catch {
        localStorage.removeItem('token')
        localStorage.removeItem('refresh_token')
      }
    }
    return {
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,
      arePluginsLoaded: false,
    }
  })

  const login = (token: string, refreshToken: string) => {
    localStorage.setItem('token', token)
    localStorage.setItem('refresh_token', refreshToken)
    try {
      const decoded = jwtDecode<{ username: string }>(token)
      const user: User = {
        uuid: decoded.username,
      }
      setState({
        user,
        token,
        refreshToken,
        isAuthenticated: true,
        isLoading: false,
        arePluginsLoaded: false,
      })
    } catch (e) {
      console.error('Login failed to decode token', e)
    }
  }

  const logout = async () => {
    const refreshToken = localStorage.getItem('refresh_token')

    if (refreshToken) {
      try {
        await api.post('/logout', { refresh_token: refreshToken })
      } catch (error) {
        console.error('Logout failed:', error)
      }
    }

    localStorage.removeItem('token')
    localStorage.removeItem('refresh_token')
    setState({
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,
      arePluginsLoaded: false,
    })
  }

  useEffect(() => {
    if (state.isAuthenticated && !state.arePluginsLoaded) {
      PluginLoader.getInstance()
        .init()
        .then(() => {
          setState((prev) => ({ ...prev, arePluginsLoaded: true }))
        })
        .catch((error) => {
          console.error('Failed to load plugins:', error)
          // Even if plugins fail, we should probably let the user in, or handle error state
          setState((prev) => ({ ...prev, arePluginsLoaded: true }))
        })
    }
  }, [state.isAuthenticated, state.arePluginsLoaded])

  return <AuthContext.Provider value={{ ...state, login, logout }}>{children}</AuthContext.Provider>
}
