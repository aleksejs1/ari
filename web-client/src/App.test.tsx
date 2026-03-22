import { createMemoryRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { RouteRegistry } from '@/lib/routing/RouteRegistry'

vi.mock('react-router-dom', async (importOriginal) => {
  const actual = (await importOriginal()) as Record<string, unknown>
  return {
    ...actual,
    createBrowserRouter: (routes: Parameters<typeof createMemoryRouter>[0]) =>
      createMemoryRouter(routes, { initialEntries: ['/login'] }),
  }
})
import { SidebarRegistry } from '@/lib/ui/sidebar/SidebarRegistry'
import { UserMenuRegistry } from '@/lib/ui/usermenu/UserMenuRegistry'
import { widgetRegistry } from '@/lib/widgets/WidgetRegistry'

import { AuthProvider } from './contexts/AuthContext'
import { UserPrefsProvider } from './hooks/useUserPrefs'
import { ContactsPlugin } from './plugins/contacts'
import { DashboardPlugin } from './plugins/dashboard'
import App from './App'

// Register plugins for the test
const context = {
  routeRegistry: RouteRegistry.getInstance(),
  sidebarRegistry: SidebarRegistry.getInstance(),
  userMenuRegistry: UserMenuRegistry.getInstance(),
  widgetRegistry: widgetRegistry,
  layoutPresetRegistry: { register: vi.fn(), get: vi.fn(), getAll: () => [] } as any,
  settingsRegistry: {} as any,
  i18n: { addResourceBundle: vi.fn() } as any,
  api: { get: vi.fn(), post: vi.fn() } as any,
}

new DashboardPlugin().register(context)
new ContactsPlugin().register(context)

// Mock focused prefs hooks
vi.mock('@/contexts/RegionalPrefsContext', () => ({
  useRegionalPrefs: vi.fn(() => ({
    formatDate: (date: string) => new Date(date).toLocaleDateString('en-US'),
    language: 'en',
    dateFormat: 'mm/dd/yyyy',
    setLanguage: vi.fn(),
    setDateFormat: vi.fn(),
  })),
  RegionalPrefsProvider: ({ children }: { children: React.ReactNode }) => children,
}))

vi.mock('@/contexts/UIPrefsContext', () => ({
  useUIPrefs: vi.fn(() => ({
    showLogo: '1',
    setShowLogo: vi.fn(),
  })),
  UIPrefsProvider: ({ children }: { children: React.ReactNode }) => children,
}))

vi.mock('@/contexts/FeaturePrefsContext', () => ({
  useFeaturePrefs: vi.fn(() => ({})),
  FeaturePrefsProvider: ({ children }: { children: React.ReactNode }) => children,
}))

// Import UserPrefsProvider from the actual module (not mocked)
vi.mock('./hooks/useUserPrefs', async (importOriginal) => {
  const actual = (await importOriginal()) as Record<string, unknown>
  return {
    ...actual,
  }
})

describe('App Smoke Test', () => {
  it('renders login page by default', async () => {
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    })

    render(
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <UserPrefsProvider>
            <App />
          </UserPrefsProvider>
        </AuthProvider>
      </QueryClientProvider>,
    )

    // Check for Login button
    expect(await screen.findByRole('button', { name: 'auth.signIn' })).toBeInTheDocument()
  })
})
