import axios from 'axios'
import { jwtDecode } from 'jwt-decode'

export const API_ORIGIN = import.meta.env.PROD ? '' : 'http://localhost:8000'

export const api = axios.create({
  baseURL: `${API_ORIGIN}/api`,
  headers: {
    'Content-Type': 'application/ld+json',
    Accept: 'application/ld+json',
  },
})

const failedQueue: { resolve: (token: string) => void; reject: (error: Error) => void }[] = []
let isRefreshing = false

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

const refreshToken = async (): Promise<string> => {
  if (isRefreshing) {
    return new Promise((resolve, reject) => {
      failedQueue.push({ resolve, reject })
    })
  }

  isRefreshing = true
  const currentRefreshToken = localStorage.getItem('refresh_token')

  if (!currentRefreshToken) {
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
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
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
