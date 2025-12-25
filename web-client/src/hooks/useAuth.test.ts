import { renderHook } from '@testing-library/react'
import { useContext } from 'react'
import { describe, expect, it, vi } from 'vitest'

import { useAuth } from './useAuth'

vi.mock('react', async () => {
  const actual = await vi.importActual('react')
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
