import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import RegisterPage from './RegisterPage'

import { useAuth } from '@/hooks/useAuth'
import { api } from '@/lib/axios'

vi.mock('@/hooks/useAuth', () => ({
  useAuth: vi.fn(),
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
    expect(screen.getByLabelText('UUID / Username')).toBeInTheDocument()
    expect(screen.getByLabelText('auth.password')).toBeInTheDocument()
    expect(screen.getByLabelText('auth.confirmPassword')).toBeInTheDocument()
  })

  it('shows error when passwords do not match', async () => {
    render(
      <MemoryRouter>
        <RegisterPage />
      </MemoryRouter>,
    )

    fireEvent.change(screen.getByLabelText('UUID / Username'), { target: { value: 'testuser' } })
    fireEvent.change(screen.getByLabelText('auth.password'), { target: { value: 'password123' } })
    fireEvent.change(screen.getByLabelText('auth.confirmPassword'), {
      target: { value: 'password456' },
    })

    fireEvent.click(screen.getByRole('button', { name: 'auth.signUp' }))

    expect(await screen.findByText("Passwords don't match")).toBeInTheDocument()
  })

  it('handles successful registration', async () => {
    vi.mocked(api.post).mockResolvedValueOnce({}) // Create User
    vi.mocked(api.post).mockResolvedValueOnce({ data: { token: 'fake-token' } }) // Login

    render(
      <MemoryRouter>
        <RegisterPage />
      </MemoryRouter>,
    )

    fireEvent.change(screen.getByLabelText('UUID / Username'), { target: { value: 'testuser' } })
    fireEvent.change(screen.getByLabelText('auth.password'), { target: { value: 'password123' } })
    fireEvent.change(screen.getByLabelText('auth.confirmPassword'), {
      target: { value: 'password123' },
    })

    fireEvent.click(screen.getByRole('button', { name: 'auth.signUp' }))

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith('/users', {
        uuid: 'testuser',
        plainPassword: 'password123',
      })
      expect(api.post).toHaveBeenCalledWith('/login_check', {
        username: 'testuser',
        password: 'password123',
      })
      expect(login).toHaveBeenCalledWith('fake-token')
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

    fireEvent.change(screen.getByLabelText('UUID / Username'), { target: { value: 'testuser' } })
    fireEvent.change(screen.getByLabelText('auth.password'), { target: { value: 'password123' } })
    fireEvent.change(screen.getByLabelText('auth.confirmPassword'), {
      target: { value: 'password123' },
    })

    fireEvent.click(screen.getByRole('button', { name: 'auth.signUp' }))

    expect(await screen.findByText('Registration failed. Please try again.')).toBeInTheDocument()
  })
})
