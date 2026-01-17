import axios from 'axios'

export const api = axios.create({
  baseURL: import.meta.env.PROD ? '/api' : 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/ld+json',
    Accept: 'application/ld+json',
  },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

const failedQueue: ((token: string) => void)[] = []
let isRefreshing = false

const processQueue = (error: Error | null, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      // If refresh failed, we reject the queued requests
      // But here we stored callbacks that resolve the promise with a token
      // logic below handles the actual retry
    } else if (token) {
      prom(token)
    }
  })
  failedQueue.length = 0
}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise(function (resolve) {
          failedQueue.push((token: string) => {
            originalRequest.headers.Authorization = `Bearer ${token}`
            resolve(api(originalRequest))
          })
        })
      }

      originalRequest._retry = true
      isRefreshing = true

      const refreshToken = localStorage.getItem('refresh_token')

      if (!refreshToken) {
        localStorage.removeItem('token')
        localStorage.removeItem('refresh_token')
        window.location.href = '/login'
        return Promise.reject(error)
      }

      try {
        const { data } = await axios.post(
          `${api.defaults.baseURL}/token/refresh`,
          {
            refresh_token: refreshToken,
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
        originalRequest.headers.Authorization = `Bearer ${token}`

        processQueue(null, token)

        return api(originalRequest)
      } catch (err) {
        processQueue(err as Error, null)
        localStorage.removeItem('token')
        localStorage.removeItem('refresh_token')
        window.location.href = '/login'
        return Promise.reject(err)
      } finally {
        isRefreshing = false
      }
    }

    return Promise.reject(error)
  },
)
