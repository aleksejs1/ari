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
        const decoded = jwtDecode<{ username: string; roles: string[] }>(token)
        const user: User = {
          uuid: decoded.username,
          roles: decoded.roles ?? [],
        }
        return {
          user,
          token,
          refreshToken,
          isAuthenticated: true,
          isLoading: false,
          arePluginsLoaded: false,
          pluginLoadError: null,
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
      pluginLoadError: null,
    }
  })

  const login = (token: string, refreshToken: string) => {
    localStorage.setItem('token', token)
    localStorage.setItem('refresh_token', refreshToken)
    try {
      const decoded = jwtDecode<{ username: string; roles: string[] }>(token)
      const user: User = {
        uuid: decoded.username,
        roles: decoded.roles ?? [],
      }
      setState({
        user,
        token,
        refreshToken,
        isAuthenticated: true,
        isLoading: false,
        arePluginsLoaded: false,
        pluginLoadError: null,
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
      pluginLoadError: null,
    })
  }

  useEffect(() => {
    if (state.isAuthenticated && !state.arePluginsLoaded) {
      PluginLoader.getInstance()
        .init()
        .then(() => {
          setState((prev) => ({ ...prev, arePluginsLoaded: true, pluginLoadError: null }))
        })
        .catch((error: unknown) => {
          console.error('Failed to load plugins:', error)
          const message = error instanceof Error ? error.message : 'Unknown error'
          // Keep the user logged in (arePluginsLoaded: true so the app renders),
          // but surface the error so the UI can show a recovery banner.
          setState((prev) => ({ ...prev, arePluginsLoaded: true, pluginLoadError: message }))
        })
    }
  }, [state.isAuthenticated, state.arePluginsLoaded])

  return <AuthContext.Provider value={{ ...state, login, logout }}>{children}</AuthContext.Provider>
}
