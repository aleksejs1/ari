import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

import { api } from './axios'

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
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('has correct base URL and headers', () => {
    expect(api.defaults.baseURL).toBe('/api')
    expect(api.defaults.headers['Content-Type']).toBe('application/ld+json')
    expect(api.defaults.headers['Accept']).toBe('application/ld+json')
  })

  it('adds Authorization header when token is present in localStorage', () => {
    vi.mocked(localStorage.getItem).mockReturnValue('fake-token')

    // @ts-expect-error - accessing internal interceptors for testing
    const interceptor = api.interceptors.request.handlers[0].fulfilled
    const config = { headers: {} }
    // @ts-expect-error - mock config structure
    const result = interceptor(config)

    expect(result.headers.Authorization).toBe('Bearer fake-token')
  })

  it('does not add Authorization header when token is missing', () => {
    vi.mocked(localStorage.getItem).mockReturnValue(null)

    // @ts-expect-error - accessing internal interceptors for testing
    const interceptor = api.interceptors.request.handlers[0].fulfilled
    const config = { headers: {} }
    // @ts-expect-error - mock config structure
    const result = interceptor(config)

    expect(result.headers.Authorization).toBeUndefined()
  })

  it('redirects to login on 401 response', async () => {
    // Access the response error interceptor (it's the second callback of the first handler)
    // handler[0] might be request or response depending on registration order and array structure
    // Axios stores handlers in an array. We just added one response interceptor.
    // @ts-expect-error - accessing internal interceptors for testing
    const errorInterceptor = api.interceptors.response.handlers[0].rejected

    const error = {
      response: { status: 401 },
    }

    try {
      await errorInterceptor(error)
    } catch {
      // Expected to reject
    }

    expect(localStorage.removeItem).toHaveBeenCalledWith('token')
    expect(window.location.href).toBe('/login')
  })

  it('passes through other errors', async () => {
    // @ts-expect-error - accessing internal interceptors for testing
    const errorInterceptor = api.interceptors.response.handlers[0].rejected

    const error = {
      response: { status: 500 },
    }

    await expect(errorInterceptor(error)).rejects.toEqual(error)
    expect(localStorage.removeItem).not.toHaveBeenCalled()
    expect(window.location.href).toBe('')
  })
})
