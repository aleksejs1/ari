import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const TEST_PASSWORD = crypto.randomUUID()
const TEST_DIFFERENT_PASSWORD = crypto.randomUUID()

import RegisterPage from './RegisterPage'

import { useAuth } from '@/hooks/useAuth'
import { useUserPrefs } from '@/hooks/useUserPrefs.hook'
import { api } from '@/lib/axios'

vi.mock('@/hooks/useAuth', () => ({
  useAuth: vi.fn(),
}))

vi.mock('@/hooks/useUserPrefs.hook', () => ({
  useUserPrefs: vi.fn(),
}))

vi.mock('@/lib/axios', () => ({
  api: {
    post: vi.fn(),
  },
}))

const navigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => navigate,
  }
})

describe('RegisterPage', () => {
  const login = vi.fn()

  beforeEach(() => {
    ;(useUserPrefs as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      formatDate: (date: string) => new Date(date).toLocaleDateString('en-US'),
      language: 'en',
      dateFormat: 'mm/dd/yyyy',
      setLanguage: vi.fn(),
      setDateFormat: vi.fn(),
    })
    vi.mocked(useAuth).mockReturnValue({
      login,
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      logout: vi.fn(),
    })
    vi.clearAllMocks()
  })

  it('renders correctly', () => {
    render(
      <MemoryRouter>
        <RegisterPage />
      </MemoryRouter>,
    )
    expect(screen.getByText('auth.register')).toBeInTheDocument()
    expect(screen.getByLabelText('auth.uuid')).toBeInTheDocument()
    expect(screen.getByLabelText('auth.password')).toBeInTheDocument()
    expect(screen.getByLabelText('auth.confirmPassword')).toBeInTheDocument()
  })

  it('shows error when passwords do not match', async () => {
    render(
      <MemoryRouter>
        <RegisterPage />
      </MemoryRouter>,
    )

    fireEvent.change(screen.getByLabelText('auth.uuid'), { target: { value: 'testuser' } })
    fireEvent.change(screen.getByLabelText('auth.password'), {
      target: { value: TEST_PASSWORD },
    })
    fireEvent.change(screen.getByLabelText('auth.confirmPassword'), {
      target: { value: TEST_DIFFERENT_PASSWORD },
    })

    fireEvent.click(screen.getByRole('button', { name: 'auth.signUp' }))

    expect(await screen.findByText('auth.passwordsMatch')).toBeInTheDocument()
  })

  it('handles successful registration', async () => {
    vi.mocked(api.post).mockResolvedValueOnce({}) // Create User
    vi.mocked(api.post).mockResolvedValueOnce({
      data: { token: 'fake-token', refresh_token: 'fake-refresh-token' },
    }) // Login

    render(
      <MemoryRouter>
        <RegisterPage />
      </MemoryRouter>,
    )

    fireEvent.change(screen.getByLabelText('auth.uuid'), { target: { value: 'testuser' } })
    fireEvent.change(screen.getByLabelText('auth.password'), {
      target: { value: TEST_PASSWORD },
    })
    fireEvent.change(screen.getByLabelText('auth.confirmPassword'), {
      target: { value: TEST_PASSWORD },
    })

    fireEvent.click(screen.getByRole('button', { name: 'auth.signUp' }))

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith('/users', {
        uuid: 'testuser',
        plainPassword: TEST_PASSWORD,
      })
      expect(api.post).toHaveBeenCalledWith('/login_check', {
        username: 'testuser',
        password: TEST_PASSWORD,
      })
      expect(login).toHaveBeenCalledWith('fake-token', 'fake-refresh-token')
      expect(navigate).toHaveBeenCalledWith('/')
    })
  })

  it('handles registration failure', async () => {
    vi.mocked(api.post).mockRejectedValueOnce(new Error('Failed'))

    render(
      <MemoryRouter>
        <RegisterPage />
      </MemoryRouter>,
    )

    fireEvent.change(screen.getByLabelText('auth.uuid'), { target: { value: 'testuser' } })
    fireEvent.change(screen.getByLabelText('auth.password'), {
      target: { value: TEST_PASSWORD },
    })
    fireEvent.change(screen.getByLabelText('auth.confirmPassword'), {
      target: { value: TEST_PASSWORD },
    })

    fireEvent.click(screen.getByRole('button', { name: 'auth.signUp' }))

    expect(await screen.findByText('auth.registrationFailed')).toBeInTheDocument()
  })
})
