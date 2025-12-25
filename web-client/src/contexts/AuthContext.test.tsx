import { act, render, screen } from '@testing-library/react'
import { jwtDecode } from 'jwt-decode'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { AuthProvider } from './AuthContext'

import { useAuth } from '@/hooks/useAuth'

vi.mock('jwt-decode', () => ({
  jwtDecode: vi.fn(),
}))

const TestComponent = () => {
  const { user, isAuthenticated, login, logout } = useAuth()
  return (
    <div>
      <div data-testid="user">{user?.uuid}</div>
      <div data-testid="auth">{isAuthenticated.toString()}</div>
      <button onClick={() => login('new-token')}>Login</button>
      <button onClick={() => logout()}>Logout</button>
    </div>
  )
}

describe('AuthProvider', () => {
  beforeEach(() => {
    vi.stubGlobal('localStorage', {
      getItem: vi.fn(),
      setItem: vi.fn(),
      removeItem: vi.fn(),
      clear: vi.fn(),
    })
    vi.clearAllMocks()
  })

  it('initializes with null user when no token in localStorage', () => {
    vi.mocked(localStorage.getItem).mockReturnValue(null)

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>,
    )

    expect(screen.getByTestId('auth')).toHaveTextContent('false')
    expect(screen.getByTestId('user')).toHaveTextContent('')
  })

  it('initializes with user when valid token in localStorage', () => {
    vi.mocked(localStorage.getItem).mockReturnValue('valid-token')
    vi.mocked(jwtDecode).mockReturnValue({ username: 'test-user' })

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>,
    )

    expect(screen.getByTestId('auth')).toHaveTextContent('true')
    expect(screen.getByTestId('user')).toHaveTextContent('test-user')
  })

  it('handles login correctly', () => {
    vi.mocked(localStorage.getItem).mockReturnValue(null)
    vi.mocked(jwtDecode).mockReturnValue({ username: 'logged-in-user' })

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>,
    )

    act(() => {
      screen.getByText('Login').click()
    })

    expect(localStorage.setItem).toHaveBeenCalledWith('token', 'new-token')
    expect(screen.getByTestId('auth')).toHaveTextContent('true')
    expect(screen.getByTestId('user')).toHaveTextContent('logged-in-user')
  })

  it('handles logout correctly', () => {
    vi.mocked(localStorage.getItem).mockReturnValue('token')
    vi.mocked(jwtDecode).mockReturnValue({ username: 'user' })

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>,
    )

    act(() => {
      screen.getByText('Logout').click()
    })

    expect(localStorage.removeItem).toHaveBeenCalledWith('token')
    expect(screen.getByTestId('auth')).toHaveTextContent('false')
    expect(screen.getByTestId('user')).toHaveTextContent('')
  })
})
