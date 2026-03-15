import axios, { type InternalAxiosRequestConfig } from 'axios'
import { jwtDecode } from 'jwt-decode'

export const API_ORIGIN = import.meta.env.PROD ? '' : 'http://localhost:8000'

export const api = axios.create({
  baseURL: `${API_ORIGIN}/api`,
  headers: {
    'Content-Type': 'application/ld+json',
    Accept: 'application/ld+json',
  },
})

// ---------------------------------------------------------------------------
// Typed extension for requests that must not trigger a 401 refresh retry.
// Set { _skipAuthRefresh: true } in the Axios request config instead of
// relying on URL string matching.
// ---------------------------------------------------------------------------
interface SkipRefreshConfig extends InternalAxiosRequestConfig {
  _skipAuthRefresh?: boolean
  _retry?: boolean
}

// ---------------------------------------------------------------------------
// Per-tab in-flight refresh state.
//
// C3 known limitation: module-level state is per JavaScript execution context
// (i.e. per browser tab). Two tabs can both enter the refresh flow. The
// cross-tab race is mitigated via a "lazy re-read" check at the start of
// refreshToken(): if another tab already refreshed and wrote a still-valid
// token to localStorage, we use it and skip the network call.
// ---------------------------------------------------------------------------
const failedQueue: { resolve: (token: string) => void; reject: (error: Error) => void }[] = []
let isRefreshing = false
let refreshTimeoutId: ReturnType<typeof setTimeout> | null = null

/** How long to wait for the refresh endpoint before aborting all queued requests. */
const REFRESH_TIMEOUT_MS = 15_000

const processQueue = (error: Error | null, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error)
    } else if (token) {
      prom.resolve(token)
    }
  })
  failedQueue.length = 0
}

/** True when the given JWT is valid for more than 30 seconds from now. */
function isTokenStillFresh(token: string): boolean {
  try {
    const { exp } = jwtDecode<{ exp: number }>(token)
    return !!exp && Math.floor(Date.now() / 1000) < exp - 30
  } catch {
    return false
  }
}

const refreshToken = async (): Promise<string> => {
  // Cross-tab mitigation: re-read from localStorage first. If another tab
  // already refreshed and stored a valid token, use it without hitting the
  // network. This closes the most common multi-tab race window.
  const storedToken = localStorage.getItem('token')
  if (storedToken && isTokenStillFresh(storedToken)) {
    api.defaults.headers.common.Authorization = `Bearer ${storedToken}`
    return storedToken
  }

  // Within-tab deduplication: queue any additional callers while a refresh
  // is already in flight.
  if (isRefreshing) {
    return new Promise((resolve, reject) => {
      failedQueue.push({ resolve, reject })
    })
  }

  isRefreshing = true

  // Safety net: if the refresh endpoint never responds, drain the queue with
  // an error after REFRESH_TIMEOUT_MS so callers don't hang indefinitely.
  refreshTimeoutId = setTimeout(() => {
    processQueue(new Error('Token refresh timed out'), null)
    isRefreshing = false
    refreshTimeoutId = null
  }, REFRESH_TIMEOUT_MS)

  const currentRefreshToken = localStorage.getItem('refresh_token')

  if (!currentRefreshToken) {
    clearTimeout(refreshTimeoutId)
    refreshTimeoutId = null
    isRefreshing = false
    localStorage.removeItem('token')
    localStorage.removeItem('refresh_token')
    window.location.href = '/login'
    throw new Error('No refresh token')
  }

  try {
    const { data } = await axios.post(
      `${api.defaults.baseURL}/token/refresh`,
      {
        refresh_token: currentRefreshToken,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    )

    const { token, refresh_token: newRefreshToken } = data

    localStorage.setItem('token', token)
    localStorage.setItem('refresh_token', newRefreshToken)

    api.defaults.headers.common.Authorization = `Bearer ${token}`

    processQueue(null, token)
    return token
  } catch (err) {
    processQueue(err as Error, null)
    localStorage.removeItem('token')
    localStorage.removeItem('refresh_token')
    window.location.href = '/login'
    throw err
  } finally {
    // clearTimeout(null | undefined) is a safe no-op in browsers.
    clearTimeout(refreshTimeoutId ?? undefined)
    refreshTimeoutId = null
    isRefreshing = false
  }
}

api.interceptors.request.use(async (config) => {
  let token = localStorage.getItem('token')

  if (token) {
    const { exp } = jwtDecode<{ exp: number }>(token)
    if (exp) {
      const now = Math.floor(Date.now() / 1000)
      // If token expires in less than 30 seconds, refresh it
      if (now >= exp - 30) {
        token = await refreshToken()
      }
    }
  }

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  async (error: { config: SkipRefreshConfig; response?: { status: number } }) => {
    const originalRequest = error.config

    // Requests explicitly marked with _skipAuthRefresh (e.g. /login_check,
    // /token/refresh) must never trigger a refresh retry loop.
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest._skipAuthRefresh
    ) {
      originalRequest._retry = true

      try {
        const token = await refreshToken()
        originalRequest.headers.Authorization = `Bearer ${token}`
        return api(originalRequest)
      } catch (err) {
        return Promise.reject(err)
      }
    }

    return Promise.reject(error)
  },
)
