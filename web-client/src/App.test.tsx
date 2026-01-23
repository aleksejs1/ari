import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'

import App from './App'
import { AuthProvider } from './contexts/AuthContext'
import { UserPrefsProvider } from './hooks/useUserPrefs'
import { useUserPrefs } from './hooks/useUserPrefs.hook'
import { ContactsPlugin } from './plugins/contacts'
import { DashboardPlugin } from './plugins/dashboard'

// Register plugins for the test
new DashboardPlugin().register()
new ContactsPlugin().register()

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
