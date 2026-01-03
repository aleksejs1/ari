import { type UseQueryResult } from '@tanstack/react-query'
import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'

import DashboardLayout from './DashboardLayout'

import { useGroups } from '@/features/groups/useGroups'
import { useAuth } from '@/hooks/useAuth'
import { useUserPrefs } from '@/hooks/useUserPrefs.hook'
import { type Group } from '@/types/models'

vi.mock('@/features/groups/useGroups', () => ({
  useGroups: vi.fn(),
}))

vi.mock('@/hooks/useAuth', () => ({
  useAuth: vi.fn(),
}))

vi.mock('@/hooks/useUserPrefs.hook', () => ({
  useUserPrefs: vi.fn(),
}))

describe('DashboardLayout', () => {
  beforeAll(() => {
    ;(useUserPrefs as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      formatDate: (date: string) => new Date(date).toLocaleDateString('en-US'),
      language: 'en',
      dateFormat: 'mm/dd/yyyy',
      setLanguage: vi.fn(),
      setDateFormat: vi.fn(),
    })
  })

  it('renders layout elements correctly', () => {
    vi.mocked(useAuth).mockReturnValue({
      user: { uuid: 'test-user' },
      login: vi.fn(),
      logout: vi.fn(),
      token: 'token',
      isAuthenticated: true,
      isLoading: false,
    })

    vi.mocked(useGroups).mockReturnValue({
      data: [],
      isLoading: false,
      isError: false,
    } as unknown as UseQueryResult<Group[]>)

    render(
      <MemoryRouter>
        <DashboardLayout />
      </MemoryRouter>,
    )

    expect(screen.getByText('app.title')).toBeInTheDocument()
    expect(screen.getByText('test-user')).toBeInTheDocument()
    expect(screen.getByText('auth.logout')).toBeInTheDocument()
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

    vi.mocked(useGroups).mockReturnValue({
      data: [],
      isLoading: false,
      isError: false,
    } as unknown as UseQueryResult<Group[]>)

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

    vi.mocked(useGroups).mockReturnValue({
      data: [],
      isLoading: false,
      isError: false,
    } as unknown as UseQueryResult<Group[]>)

    render(
      <MemoryRouter>
        <DashboardLayout />
      </MemoryRouter>,
    )

    fireEvent.click(screen.getByText('auth.logout'))
    expect(logout).toHaveBeenCalled()
  })
  it('toggles groups list and shows groups', () => {
    vi.mocked(useAuth).mockReturnValue({
      user: { uuid: 'test-user' },
      login: vi.fn(),
      logout: vi.fn(),
      token: 'token',
      isAuthenticated: true,
      isLoading: false,
    })

    const mockGroups = [
      { '@id': '/groups/1', '@type': 'Group', id: 1, name: 'Family', color: 'red' },
      { '@id': '/groups/2', '@type': 'Group', id: 2, name: 'Work', color: 'blue' },
    ] as Group[]

    vi.mocked(useGroups).mockReturnValue({
      data: mockGroups,
      isLoading: false,
      isError: false,
    } as unknown as UseQueryResult<Group[]>)

    render(
      <MemoryRouter>
        <DashboardLayout />
      </MemoryRouter>,
    )

    // Initially groups should not be visible (collapsed)
    expect(screen.queryByText('Family')).not.toBeInTheDocument()

    // Click to expand
    // The button text is "app.navigation.groups" which is mocked or translated.
    // In the component: <span>{t('app.navigation.groups', 'Groups')}</span>
    // So we look for 'app.navigation.groups' based on how DashboardLayout renders currently (using t function).
    // The existing test expects 'app.title', so I assume i18n mock returns the key.

    // Find the toggle button. It contains the text.
    fireEvent.click(screen.getByText('app.navigation.groups'))

    // Now groups should be visible
    expect(screen.getByText('Family')).toBeInTheDocument()
    expect(screen.getByText('Work')).toBeInTheDocument()
    expect(screen.getByText('app.navigation.manageGroups')).toBeInTheDocument()
  })
})
