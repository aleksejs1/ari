import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { type UseQueryResult } from '@tanstack/react-query'
import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { useAuth } from '@/hooks/useAuth'
import { RouteRegistry } from '@/lib/routing/RouteRegistry'
import { SidebarRegistry } from '@/lib/ui/sidebar/SidebarRegistry'
import { UserMenuRegistry } from '@/lib/ui/usermenu/UserMenuRegistry'
import { widgetRegistry } from '@/lib/widgets/WidgetRegistry'
import { type Group } from '@/types/models'

import { useGroups } from '@/plugins/groups/hooks/useGroups'
import { SettingsPlugin } from '@/plugins/settings/index'

import AppLayout from './AppLayout'

vi.mock('@/plugins/groups/hooks/useGroups', () => ({
  useGroups: vi.fn().mockReturnValue({
    data: [],
    isLoading: false,
    isError: false,
  }),
}))

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

describe('AppLayout', () => {
  beforeAll(() => {
    const context = {
      routeRegistry: RouteRegistry.getInstance(),
      sidebarRegistry: SidebarRegistry.getInstance(),
      userMenuRegistry: UserMenuRegistry.getInstance(),
      widgetRegistry: widgetRegistry,
      layoutPresetRegistry: { register: vi.fn(), get: vi.fn(), getAll: () => [] } as any,
      settingsRegistry: { registerTab: vi.fn() } as any,
      i18n: { addResourceBundle: vi.fn() } as any,
      api: { get: vi.fn(), post: vi.fn() } as any,
    }

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
      pluginLoadError: null,
    })

    vi.mocked(useGroups).mockReturnValue({
      data: [],
      isLoading: false,
      isError: false,
    } as unknown as UseQueryResult<Group[]>)

    render(
      <MemoryRouter>
        <AppLayout />
      </MemoryRouter>,
    )

    // Sidebar items should be present
    expect(screen.getByText('app.navigation.sidebar.settings')).toBeInTheDocument()

    // Removed elements checks
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
      pluginLoadError: null,
    })

    vi.mocked(useGroups).mockReturnValue({
      data: [],
      isLoading: false,
      isError: false,
    } as unknown as UseQueryResult<Group[]>)

    render(
      <MemoryRouter initialEntries={['/test-page']}>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/test-page" element={<div>Test Page Content</div>} />
          </Route>
        </Routes>
      </MemoryRouter>,
    )

    expect(screen.getByText('Test Page Content')).toBeInTheDocument()
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
      pluginLoadError: null,
    })

    vi.mocked(useGroups).mockReturnValue({
      data: [],
      isLoading: false,
      isError: false,
    } as unknown as UseQueryResult<Group[]>)

    render(
      <MemoryRouter>
        <AppLayout />
      </MemoryRouter>,
    )

    expect(screen.getByRole('button', { name: 'app.navigation.toggleMenu' })).toBeInTheDocument()
  })
})
