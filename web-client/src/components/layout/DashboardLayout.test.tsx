import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'

import DashboardLayout from './DashboardLayout'

import { useAuth } from '@/hooks/useAuth'

vi.mock('@/hooks/useAuth', () => ({
  useAuth: vi.fn(),
}))

describe('DashboardLayout', () => {
  it('renders layout elements correctly', () => {
    vi.mocked(useAuth).mockReturnValue({
      user: { uuid: 'test-user' },
      login: vi.fn(),
      logout: vi.fn(),
      token: 'token',
      isAuthenticated: true,
      isLoading: false,
    })

    render(
      <MemoryRouter>
        <DashboardLayout />
      </MemoryRouter>,
    )

    expect(screen.getByText('Contacts App')).toBeInTheDocument()
    expect(screen.getByText('test-user')).toBeInTheDocument()
    expect(screen.getByText('Logout')).toBeInTheDocument()
  })

  it('navigates when links are clicked', () => {
    vi.mocked(useAuth).mockReturnValue({
      user: { uuid: 'test-user' },
      login: vi.fn(),
      logout: vi.fn(),
      token: 'token',
      isAuthenticated: true,
      isLoading: false,
    })

    render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route element={<DashboardLayout />}>
            <Route path="/" element={<div>Contacts Page</div>} />
          </Route>
        </Routes>
      </MemoryRouter>,
    )

    expect(screen.getByText('Contacts Page')).toBeInTheDocument()
  })

  it('calls logout when logout button is clicked', () => {
    const logout = vi.fn()
    vi.mocked(useAuth).mockReturnValue({
      user: { uuid: 'test-user' },
      login: vi.fn(),
      logout,
      token: 'token',
      isAuthenticated: true,
      isLoading: false,
    })

    render(
      <MemoryRouter>
        <DashboardLayout />
      </MemoryRouter>,
    )

    fireEvent.click(screen.getByText('Logout'))
    expect(logout).toHaveBeenCalled()
  })
})
