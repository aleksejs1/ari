import axios from 'axios'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

import { api } from './axios'

vi.mock('axios', async () => {
  const actual = await vi.importActual<typeof axios>('axios')
  return {
    ...actual,
    default: {
      ...actual.default,
      post: vi.fn(),
    },
  }
})

describe('axios api', () => {
  beforeEach(() => {
    vi.stubGlobal('localStorage', {
      getItem: vi.fn(),
      setItem: vi.fn(),
      removeItem: vi.fn(),
      clear: vi.fn(),
    })
    // Mock window.location
    Object.defineProperty(window, 'location', {
      writable: true,
      value: { href: '' },
    })
    // Ensure atob is available for jwt-decode in test environment
    if (typeof atob === 'undefined') {
      vi.stubGlobal('atob', (str: string) => Buffer.from(str, 'base64').toString('binary'))
    }
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('has correct base URL and headers', () => {
    expect(api.defaults.baseURL).toBe('http://localhost:8000/api')
    expect(api.defaults.headers['Content-Type']).toBe('application/ld+json')
    expect(api.defaults.headers['Accept']).toBe('application/ld+json')
  })

  it('adds Authorization header when token is present and valid', async () => {
    const validToken = `header.${btoa(JSON.stringify({ exp: Date.now() / 1000 + 1000 }))}.signature`
    vi.mocked(localStorage.getItem).mockReturnValue(validToken)

    // @ts-expect-error - accessing internal interceptors for testing
    const interceptor = api.interceptors.request.handlers[0].fulfilled
    const config = { headers: {} }
    const result = await interceptor(config)

    expect(result.headers.Authorization).toBe(`Bearer ${validToken}`)
  })

  it('refreshes token proactively if it is about to expire', async () => {
    const aboutToExpireToken = `header.${btoa(JSON.stringify({ exp: Date.now() / 1000 + 10 }))}.signature`
    const newToken = 'new-valid-token'
    const newRefreshToken = 'new-refresh-token'

    vi.mocked(localStorage.getItem).mockImplementation((key) => {
      if (key === 'token') {
        return aboutToExpireToken
      }
      if (key === 'refresh_token') {
        return 'old-refresh'
      }
      return null
    })

    vi.mocked(axios.post).mockResolvedValueOnce({
      data: { token: newToken, refresh_token: newRefreshToken },
    })

    // @ts-expect-error - accessing internal interceptors for testing
    const interceptor = api.interceptors.request.handlers[0].fulfilled
    const config = { headers: {} }
    const result = await interceptor(config)

    expect(axios.post).toHaveBeenCalledWith(
      expect.stringContaining('/token/refresh'),
      {
        refresh_token: 'old-refresh',
      },
      expect.any(Object),
    )
    expect(localStorage.setItem).toHaveBeenCalledWith('token', newToken)
    expect(result.headers.Authorization).toBe(`Bearer ${newToken}`)
  })

  it('redirects to login if refresh fails during proactive check', async () => {
    // exp: 1000 (Very far in the past)
    // eslint-disable-next-line sonarjs/no-hardcoded-secrets
    const expiredToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjEwMDB9.signature'

    vi.mocked(localStorage.getItem).mockImplementation((key) => {
      if (key === 'token') {
        return expiredToken
      }
      if (key === 'refresh_token') {
        return 'old-refresh'
      }
      return null
    })

    vi.mocked(axios.post).mockRejectedValue(new Error('Refresh failed'))

    // @ts-expect-error - accessing internal interceptors for testing
    const interceptor = api.interceptors.request.handlers[0].fulfilled
    const config = { headers: {} }

    await expect(interceptor(config)).rejects.toThrow('Refresh failed')
    expect(window.location.href).toBe('/login')
    expect(localStorage.removeItem).toHaveBeenCalledWith('token')
  })

  it('queues multiple requests during refresh', async () => {
    const expiredToken = `header.${btoa(JSON.stringify({ exp: Date.now() / 1000 - 1000 }))}.signature`
    const newToken = 'new-token'

    vi.mocked(localStorage.getItem).mockImplementation((key) => {
      if (key === 'token') {
        return expiredToken
      }
      if (key === 'refresh_token') {
        return 'old-refresh'
      }
      return null
    })

    let resolveRefresh: any
    const refreshPromise = new Promise((resolve) => {
      resolveRefresh = resolve
    })

    vi.mocked(axios.post).mockReturnValueOnce(refreshPromise as any)

    // @ts-expect-error - accessing internal interceptors for testing
    const interceptor = api.interceptors.request.handlers[0].fulfilled

    const config1 = { headers: {} }
    const config2 = { headers: {} }

    const promise1 = interceptor(config1)
    const promise2 = interceptor(config2)

    resolveRefresh({ data: { token: newToken, refresh_token: 'new-refresh' } })

    const [result1, result2] = await Promise.all([promise1, promise2])

    expect(axios.post).toHaveBeenCalledTimes(1)
    expect(result1.headers.Authorization).toBe(`Bearer ${newToken}`)
    expect(result2.headers.Authorization).toBe(`Bearer ${newToken}`)
  })
})
