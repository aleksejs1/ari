import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { useAuth } from '@/hooks/useAuth'
import { TopMenuRegistry } from '@/lib/ui/topmenu/TopMenuRegistry'

import { ContactsTopNavSection } from '@/plugins/contacts/extensions/ContactsTopNavSection'

import SidebarLessLayout from './SidebarLessLayout'

// Mocks
vi.mock('@/hooks/useAuth', () => ({
  useAuth: vi.fn(),
}))

vi.mock('@/features/activity-feed/useNotifications', () => ({
  useNotifications: vi.fn(),
  useUnreadCount: vi.fn().mockReturnValue({ data: 0 }),
  useMarkAsRead: vi.fn(),
}))

vi.mock('@/features/search/components/GlobalSearch', () => ({
  GlobalSearch: () => <div data-testid="global-search-mock">Global Search</div>,
}))

describe('SidebarLessLayout', () => {
  beforeEach(() => {
    TopMenuRegistry.getInstance().clear()
  })

  it('renders layout elements correctly', () => {
    vi.mocked(useAuth).mockReturnValue({
      user: { id: 1, uuid: 'test-uuid' },
      login: vi.fn(),
      logout: vi.fn(),
      refreshToken: null,
      token: 'token',
      isAuthenticated: true,
      isLoading: false,
      arePluginsLoaded: true,
    })

    render(
      <MemoryRouter>
        <SidebarLessLayout />
      </MemoryRouter>,
    )

    expect(screen.getByText('app.title')).toBeInTheDocument()
    expect(screen.getByTestId('global-search-mock')).toBeInTheDocument()
    // UserMenu trigger is accessible by name "Open user menu" or generic button if no label
    expect(screen.getByRole('button', { name: /open user menu/i })).toBeInTheDocument()
  })

  it('renders child routes', () => {
    vi.mocked(useAuth).mockReturnValue({
      user: { uuid: 'test-user' },
      login: vi.fn(),
      logout: vi.fn(),
      refreshToken: null,
      token: 'token',
      isAuthenticated: true,
      isLoading: false,
      arePluginsLoaded: true,
    })

    render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route element={<SidebarLessLayout />}>
            <Route path="/" element={<div>Child Content</div>} />
          </Route>
        </Routes>
      </MemoryRouter>,
    )

    expect(screen.getByText('Child Content')).toBeInTheDocument()
  })

  it('logo links to home page', () => {
    vi.mocked(useAuth).mockReturnValue({
      user: { uuid: 'test-user' },
      login: vi.fn(),
      logout: vi.fn(),
      refreshToken: null,
      token: 'token',
      isAuthenticated: true,
      isLoading: false,
      arePluginsLoaded: true,
    })

    render(
      <MemoryRouter>
        <SidebarLessLayout />
      </MemoryRouter>,
    )

    const logo = screen.getByText('app.title')
    expect(logo.closest('a')).toHaveAttribute('href', '/')
  })

  it('renders contacts link in header', () => {
    vi.mocked(useAuth).mockReturnValue({
      user: { uuid: 'test-user' },
      login: vi.fn(),
      logout: vi.fn(),
      refreshToken: null,
      token: 'token',
      isAuthenticated: true,
      isLoading: false,
      arePluginsLoaded: true,
    })

    TopMenuRegistry.getInstance().register({
      id: 'contacts',
      component: ContactsTopNavSection,
      order: 1,
    })

    render(
      <MemoryRouter>
        <SidebarLessLayout />
      </MemoryRouter>,
    )

    const contactsLink = screen.getByRole('link', { name: 'title' })
    expect(contactsLink).toBeInTheDocument()
    expect(contactsLink).toHaveAttribute('href', '/contacts')
  })

  it('renders mobile menu button', () => {
    vi.mocked(useAuth).mockReturnValue({
      user: { uuid: 'test-user' },
      login: vi.fn(),
      logout: vi.fn(),
      refreshToken: null,
      token: 'token',
      isAuthenticated: true,
      isLoading: false,
      arePluginsLoaded: true,
    })

    render(
      <MemoryRouter>
        <SidebarLessLayout />
      </MemoryRouter>,
    )

    expect(screen.getByRole('button', { name: 'app.navigation.toggleMenu' })).toBeInTheDocument()
  })
})
