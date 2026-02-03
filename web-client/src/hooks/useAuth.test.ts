import { useContext } from 'react'
import { renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { useAuth, useIsAdmin } from './useAuth'

vi.mock('react', async () => {
  const actual = await vi.importActual<Record<string, unknown>>('react')
  return {
    ...actual,
    useContext: vi.fn(),
  }
})

describe('useAuth', () => {
  it('returns context when used within AuthProvider', () => {
    const mockContext = { user: null, token: null, login: vi.fn(), logout: vi.fn() }
    vi.mocked(useContext).mockReturnValue(mockContext)

    const { result } = renderHook(() => useAuth())
    expect(result.current).toBe(mockContext)
  })

  it('throws error when used outside of AuthProvider', () => {
    vi.mocked(useContext).mockReturnValue(undefined)

    expect(() => renderHook(() => useAuth())).toThrow('useAuth must be used within an AuthProvider')
  })
})

describe('useIsAdmin', () => {
  it('returns true if user has ROLE_ADMIN', () => {
    const mockContext = { user: { uuid: 'test', roles: ['ROLE_USER', 'ROLE_ADMIN'] } }
    vi.mocked(useContext).mockReturnValue(mockContext)

    const { result } = renderHook(() => useIsAdmin())
    expect(result.current).toBe(true)
  })

  it('returns false if user does not have ROLE_ADMIN', () => {
    const mockContext = { user: { uuid: 'test', roles: ['ROLE_USER'] } }
    vi.mocked(useContext).mockReturnValue(mockContext)

    const { result } = renderHook(() => useIsAdmin())
    expect(result.current).toBe(false)
  })

  it('returns false if user is null', () => {
    const mockContext = { user: null }
    vi.mocked(useContext).mockReturnValue(mockContext)

    const { result } = renderHook(() => useIsAdmin())
    expect(result.current).toBe(false)
  })
})
