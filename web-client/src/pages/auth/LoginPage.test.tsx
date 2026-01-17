import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect, vi, beforeEach } from 'vitest'

import LoginPage from './LoginPage'

import { api } from '@/lib/axios'

// Mock dependencies
const mockLogin = vi.fn()
const mockNavigate = vi.fn()

vi.mock('@/hooks/useAuth', () => ({
  useAuth: () => ({
    login: mockLogin,
  }),
}))

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

vi.mock('@/lib/axios', () => ({
  api: {
    post: vi.fn(),
  },
}))

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}))

// Mock LanguageSwitcher mainly to avoid issues, though it's likely fine
vi.mock('@/components/ui/LanguageSwitcher', () => ({
  LanguageSwitcher: () => <div data-testid="lang-switcher" />,
}))

describe('LoginPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders login form', () => {
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>,
    )

    expect(screen.getByLabelText('auth.username')).toBeInTheDocument()
    expect(screen.getByLabelText('auth.password')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'auth.signIn' })).toBeInTheDocument()
  })

  it('handles successful login', async () => {
    vi.mocked(api.post).mockResolvedValue({
      data: { token: 'fake-token', refresh_token: 'fake-refresh-token' },
    })

    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>,
    )

    fireEvent.change(screen.getByLabelText('auth.username'), { target: { value: 'testuser' } })
    fireEvent.change(screen.getByLabelText('auth.password'), { target: { value: 'password' } })
    fireEvent.click(screen.getByRole('button', { name: 'auth.signIn' }))

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith('/login_check', {
        username: 'testuser',
        // eslint-disable-next-line
        password: 'password',
      })
    })

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('fake-token', 'fake-refresh-token')
      expect(mockNavigate).toHaveBeenCalledWith('/')
    })
  })

  it('handles login failure', async () => {
    // Suppress console error for this test
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {
      /* suppress */
    })

    vi.mocked(api.post).mockRejectedValue(new Error('Unauthorized'))

    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>,
    )

    fireEvent.change(screen.getByLabelText('auth.username'), { target: { value: 'testuser' } })
    fireEvent.change(screen.getByLabelText('auth.password'), { target: { value: 'wrongpass' } })
    fireEvent.click(screen.getByRole('button', { name: 'auth.signIn' }))

    await waitFor(() => {
      expect(screen.getByText('auth.invalidCredentials')).toBeInTheDocument()
    })

    expect(mockLogin).not.toHaveBeenCalled()
    consoleSpy.mockRestore()
  })

  it('displays validation errors for empty fields', async () => {
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>,
    )

    fireEvent.click(screen.getByRole('button', { name: 'auth.signIn' }))

    await waitFor(() => {
      // Zod validation messages
      expect(screen.getByText('auth.usernameRequired')).toBeInTheDocument()
      expect(screen.getByText('auth.passwordRequired')).toBeInTheDocument()
    })
  })

  it('handles successful demo login', async () => {
    vi.mocked(api.post)
      .mockResolvedValueOnce({ data: { username: 'demo-user-123' } }) // /demo-account
      .mockResolvedValueOnce({
        data: { token: 'demo-token', refresh_token: 'demo-refresh-token' },
      }) // /login_check

    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>,
    )

    fireEvent.click(screen.getByRole('button', { name: 'auth.demo' }))

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith('/demo-account', {})
    })

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith('/login_check', {
        username: 'demo-user-123',
        // eslint-disable-next-line sonarjs/no-hardcoded-passwords
        password: 'demo',
      })
    })

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('demo-token', 'demo-refresh-token')
      expect(mockNavigate).toHaveBeenCalledWith('/')
    })
  })

  it('handles demo login failure', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {
      /* suppress */
    })
    vi.mocked(api.post).mockRejectedValueOnce(new Error('API Error'))

    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>,
    )

    fireEvent.click(screen.getByRole('button', { name: 'auth.demo' }))

    await waitFor(() => {
      expect(screen.getByText('auth.invalidCredentials')).toBeInTheDocument()
    })

    expect(mockLogin).not.toHaveBeenCalled()
    consoleSpy.mockRestore()
  })
})
