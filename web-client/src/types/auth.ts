import type { components } from './schema'

export type User = components['schemas']['User-user.read']

export interface AuthState {
  user: User | null
  token: string | null
  refreshToken: string | null
  isAuthenticated: boolean
  isLoading: boolean
  arePluginsLoaded: boolean
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
