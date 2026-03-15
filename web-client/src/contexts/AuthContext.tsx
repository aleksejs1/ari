import { type ReactNode, useEffect, useState } from 'react'
import { jwtDecode } from 'jwt-decode'

import { api } from '@/lib/axios'
import { PluginLoader } from '@/lib/core/PluginLoader'
import { storage, STORAGE_KEYS } from '@/lib/storage'
import type { AuthState, User } from '@/types/auth'

import { AuthContext } from './AuthContextInstance'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>(() => {
    const token = storage.get(STORAGE_KEYS.TOKEN)
    const refreshToken = storage.get(STORAGE_KEYS.REFRESH_TOKEN)
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
        storage.remove(STORAGE_KEYS.TOKEN)
        storage.remove(STORAGE_KEYS.REFRESH_TOKEN)
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
    storage.set(STORAGE_KEYS.TOKEN, token)
    storage.set(STORAGE_KEYS.REFRESH_TOKEN, refreshToken)
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
    const refreshToken = storage.get(STORAGE_KEYS.REFRESH_TOKEN)

    if (refreshToken) {
      try {
        await api.post('/logout', { refresh_token: refreshToken }, {
          _skipAuthRefresh: true,
        } as object)
      } catch (error) {
        console.error('Logout failed:', error)
      }
    }

    storage.remove(STORAGE_KEYS.TOKEN)
    storage.remove(STORAGE_KEYS.REFRESH_TOKEN)
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
