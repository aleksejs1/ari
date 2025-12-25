import { describe, it, expect, vi, beforeEach } from 'vitest'

import { api } from './axios'

describe('axios api', () => {
  beforeEach(() => {
    vi.stubGlobal('localStorage', {
      getItem: vi.fn(),
      setItem: vi.fn(),
      removeItem: vi.fn(),
      clear: vi.fn(),
    })
  })

  it('has correct base URL and headers', () => {
    expect(api.defaults.baseURL).toBe('/api')
    expect(api.defaults.headers['Content-Type']).toBe('application/ld+json')
    expect(api.defaults.headers['Accept']).toBe('application/ld+json')
  })

  it('adds Authorization header when token is present in localStorage', async () => {
    vi.mocked(localStorage.getItem).mockReturnValue('fake-token')

    // Find the request interceptor
    // @ts-expect-error - accessing internal interceptors for testing
    const interceptor = api.interceptors.request.handlers[0].fulfilled
    const config = { headers: {} }
    const result = interceptor(config)

    expect(result.headers.Authorization).toBe('Bearer fake-token')
  })

  it('does not add Authorization header when token is missing', async () => {
    vi.mocked(localStorage.getItem).mockReturnValue(null)

    // @ts-expect-error - accessing internal interceptors for testing
    const interceptor = api.interceptors.request.handlers[0].fulfilled
    const config = { headers: {} }
    const result = interceptor(config)

    expect(result.headers.Authorization).toBeUndefined()
  })
})
