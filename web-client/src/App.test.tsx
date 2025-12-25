import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'

import App from './App'
import { AuthProvider } from './contexts/AuthContext'

describe('App Smoke Test', () => {
  it('renders login page by default', () => {
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
          <App />
        </AuthProvider>
      </QueryClientProvider>,
    )

    // Check for Login button
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument()
  })
})
