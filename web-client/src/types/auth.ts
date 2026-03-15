import type { components } from './schema'

export type User = components['schemas']['User-user.read'] & {
  roles: string[]
}

export interface AuthState {
  user: User | null
  token: string | null
  refreshToken: string | null
  isAuthenticated: boolean
  isLoading: boolean
  arePluginsLoaded: boolean
  /** Non-null when plugin initialisation failed. App is still usable but some features may be missing. */
  pluginLoadError: string | null
}

export interface LoginResponse {
  token: string
  refresh_token: string
}

export interface ActiveSession {
  id: string // or number
  ip: string
  userAgent: string
  createdAt: string
  isCurrent: boolean
  refreshTokenId: number
}
