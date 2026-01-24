import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { RouteRegistry } from '@/lib/routing/RouteRegistry'
import { SidebarRegistry } from '@/lib/ui/sidebar/SidebarRegistry'
import { TopMenuRegistry } from '@/lib/ui/topmenu/TopMenuRegistry'
import { UserMenuRegistry } from '@/lib/ui/usermenu/UserMenuRegistry'
import { widgetRegistry } from '@/lib/widgets/WidgetRegistry'

import { AuthProvider } from './contexts/AuthContext'
import { UserPrefsProvider } from './hooks/useUserPrefs'
import { useUserPrefs } from './hooks/useUserPrefs.hook'
import { ContactsPlugin } from './plugins/contacts'
import { DashboardPlugin } from './plugins/dashboard'
import App from './App'

// Register plugins for the test
const context = {
  routeRegistry: RouteRegistry.getInstance(),
  sidebarRegistry: SidebarRegistry.getInstance(),
  userMenuRegistry: UserMenuRegistry.getInstance(),
  topMenuRegistry: TopMenuRegistry.getInstance(),
  widgetRegistry: widgetRegistry,
  settingsRegistry: {} as any,
  i18n: { addResourceBundle: vi.fn() } as any,
  api: { get: vi.fn(), post: vi.fn() } as any,
}

new DashboardPlugin().register(context)
new ContactsPlugin().register(context)

// Mock useUserPrefs hook but keep UserPrefsProvider
vi.mock('./hooks/useUserPrefs.hook', () => ({
  useUserPrefs: vi.fn(),
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
    ;(useUserPrefs as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      formatDate: (date: string) => new Date(date).toLocaleDateString('en-US'),
      language: 'en',
      dateFormat: 'mm/dd/yyyy',
      showLogo: '1',
      setLanguage: vi.fn(),
      setDateFormat: vi.fn(),
      setShowLogo: vi.fn(),
    })

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
