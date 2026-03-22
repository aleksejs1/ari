import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { AiSettings } from './AiSettings.component'

vi.mock('@/plugins/contacts/hooks/useAiSuggestions', () => ({
  useAiSuggestionStats: vi.fn(() => ({
    data: null,
    isLoading: false,
  })),
  useTriggerBatchAiAnalysis: vi.fn(() => ({
    mutate: vi.fn(),
    isPending: false,
    isSuccess: false,
  })),
}))

function renderWithQuery(ui: React.ReactElement) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return render(<QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>)
}

describe('AiSettings', () => {
  it('renders the GDPR disclaimer alert', () => {
    renderWithQuery(<AiSettings />)

    // The GDPR alert is always present
    expect(screen.getByRole('alert')).toBeInTheDocument()
  })

  it('renders the batch analysis button', () => {
    renderWithQuery(<AiSettings />)

    // A button should be rendered for triggering batch analysis
    const buttons = screen.getAllByRole('button')
    expect(buttons.length).toBeGreaterThan(0)
  })

  it('shows loading state when stats are being fetched', async () => {
    const { useAiSuggestionStats } = await import('@/plugins/contacts/hooks/useAiSuggestions')
    vi.mocked(useAiSuggestionStats).mockReturnValue({ data: null, isLoading: true } as any)

    renderWithQuery(<AiSettings />)

    // Loader spinner should be present during loading
    const spinner = screen.getByTestId('loading-spinner')
    expect(spinner).toBeInTheDocument()
  })

  it('shows statistics section when stats are available', async () => {
    const { useAiSuggestionStats } = await import('@/plugins/contacts/hooks/useAiSuggestions')
    vi.mocked(useAiSuggestionStats).mockReturnValue({
      data: {
        pending: 5,
        accepted: 10,
        dismissed: 2,
        error: 1,
        skipped: 3,
        tokensPrompt: 1500,
        tokensCompletion: 500,
      },
      isLoading: false,
    } as any)

    renderWithQuery(<AiSettings />)

    // Stats values are displayed
    expect(screen.getByText('5')).toBeInTheDocument() // pending count
    expect(screen.getByText('10')).toBeInTheDocument() // accepted count
    // Token counts with locale formatting
    expect(screen.getByText('1,500')).toBeInTheDocument()
  })
})
