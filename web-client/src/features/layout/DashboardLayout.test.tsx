import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { type UseQueryResult } from '@tanstack/react-query'
import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { useAuth } from '@/hooks/useAuth'
import { useUserPrefs } from '@/hooks/useUserPrefs.hook'
import { type Group } from '@/types/models'

import { AuditLogsPlugin } from '@/plugins/audit-logs'
import { GoogleImportPlugin } from '@/plugins/google-import'
import { useGroups } from '@/plugins/groups/hooks/useGroups'
import { NotificationsPlugin } from '@/plugins/notifications'
import { SettingsPlugin } from '@/plugins/settings/index'

import DashboardLayout from './DashboardLayout'

vi.mock('@/plugins/groups/hooks/useGroups', () => ({
  useGroups: vi.fn(),
}))

vi.mock('@/hooks/useAuth', () => ({
  useAuth: vi.fn(),
}))

vi.mock('@/hooks/useUserPrefs.hook', () => ({
  useUserPrefs: vi.fn(),
}))

vi.mock('@/features/activity-feed/useNotifications', () => ({
  useNotifications: vi.fn(),
  useUnreadCount: vi.fn().mockReturnValue({ data: 0 }),
  useMarkAsRead: vi.fn(),
}))

vi.mock('@/features/search/components/GlobalSearch', () => ({
  GlobalSearch: () => <div data-testid="global-search-mock">Global Search</div>,
}))

import { RouteRegistry } from '@/lib/routing/RouteRegistry'
import { SidebarRegistry } from '@/lib/ui/sidebar/SidebarRegistry'
import { TopMenuRegistry } from '@/lib/ui/topmenu/TopMenuRegistry'
import { UserMenuRegistry } from '@/lib/ui/usermenu/UserMenuRegistry'
import { widgetRegistry } from '@/lib/widgets/WidgetRegistry'

// ...

describe('DashboardLayout', () => {
  beforeAll(() => {
    ;(useUserPrefs as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      formatDate: (date: string) => new Date(date).toLocaleDateString('en-US'),
      language: 'en',
      dateFormat: 'mm/dd/yyyy',
      showLogo: '1',
      setLanguage: vi.fn(),
      setDateFormat: vi.fn(),
      setShowLogo: vi.fn(),
    })

    const context = {
      routeRegistry: RouteRegistry.getInstance(),
      sidebarRegistry: SidebarRegistry.getInstance(),
      userMenuRegistry: UserMenuRegistry.getInstance(),
      topMenuRegistry: TopMenuRegistry.getInstance(),
      widgetRegistry: widgetRegistry,
      layoutPresetRegistry: { register: vi.fn(), get: vi.fn(), getAll: () => [] } as any,
      settingsRegistry: { registerTab: vi.fn() } as any,
      i18n: { addResourceBundle: vi.fn() } as any,
      api: { get: vi.fn(), post: vi.fn() } as any,
    }

    new AuditLogsPlugin().register(context)
    new GoogleImportPlugin().register(context)
    new NotificationsPlugin().register(context)
    new SettingsPlugin().register(context)
  })

  it('renders layout elements correctly', () => {
    vi.mocked(useAuth).mockReturnValue({
      user: { uuid: 'test-user', roles: ['ROLE_USER'] },
      login: vi.fn(),
      logout: vi.fn(),
      refreshToken: null,
      token: 'token',
      isAuthenticated: true,
      isLoading: false,
      arePluginsLoaded: true,
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
    // Sidebar items should be present
    expect(screen.getByText('app.navigation.sidebar.auditLogs')).toBeInTheDocument()
    expect(screen.getByText('app.navigation.sidebar.groups')).toBeInTheDocument()
    expect(screen.getByText('app.navigation.sidebar.notificationChannels')).toBeInTheDocument()
    expect(screen.getByText('app.navigation.sidebar.notificationPolicies')).toBeInTheDocument()
    expect(screen.getByText('app.navigation.sidebar.googleImport')).toBeInTheDocument()
    expect(screen.getByText('app.navigation.sidebar.settings')).toBeInTheDocument()

    // Removed elements checks
    expect(screen.queryByText('app.navigation.sidebar.home')).not.toBeInTheDocument()
    expect(screen.queryByText('app.navigation.sidebar.contacts')).not.toBeInTheDocument()
    expect(screen.queryByText('test-user')).not.toBeInTheDocument()
    expect(screen.queryByText('auth.logout')).not.toBeInTheDocument()
  })

  it('navigates when links are clicked', () => {
    vi.mocked(useAuth).mockReturnValue({
      user: { uuid: 'test-user', roles: ['ROLE_USER'] },
      login: vi.fn(),
      logout: vi.fn(),
      refreshToken: null,
      token: 'token',
      isAuthenticated: true,
      isLoading: false,
      arePluginsLoaded: true,
    })

    vi.mocked(useGroups).mockReturnValue({
      data: [],
      isLoading: false,
      isError: false,
    } as unknown as UseQueryResult<Group[]>)

    render(
      <MemoryRouter initialEntries={['/audit-logs']}>
        <Routes>
          <Route element={<DashboardLayout />}>
            <Route path="/audit-logs" element={<div>Audit Logs Page</div>} />
          </Route>
        </Routes>
      </MemoryRouter>,
    )

    expect(screen.getByText('Audit Logs Page')).toBeInTheDocument()
  })

  it('logo links to home page', () => {
    vi.mocked(useAuth).mockReturnValue({
      user: { uuid: 'test-user', roles: ['ROLE_USER'] },
      login: vi.fn(),
      logout: vi.fn(),
      refreshToken: null,
      token: 'token',
      isAuthenticated: true,
      isLoading: false,
      arePluginsLoaded: true,
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

    const logo = screen.getByText('app.title')
    expect(logo.closest('a')).toHaveAttribute('href', '/')
  })

  it('renders mobile menu button', () => {
    vi.mocked(useAuth).mockReturnValue({
      user: { uuid: 'test-user', roles: ['ROLE_USER'] },
      login: vi.fn(),
      logout: vi.fn(),
      refreshToken: null,
      token: 'token',
      isAuthenticated: true,
      isLoading: false,
      arePluginsLoaded: true,
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

    expect(screen.getByRole('button', { name: 'app.navigation.toggleMenu' })).toBeInTheDocument()
  })
})
