import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { AiSuggestionBadge } from './AiSuggestionBadge'

// Mock the hook
vi.mock('../hooks/useAiSuggestions', () => ({
  useAiSuggestions: vi.fn(),
  useResolveAiSuggestion: vi.fn(() => ({
    mutateAsync: vi.fn(),
    isPending: false,
  })),
}))

const { useAiSuggestions } = await import('../hooks/useAiSuggestions')
const mockUseAiSuggestions = vi.mocked(useAiSuggestions)

function renderWithQuery(ui: React.ReactElement) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return render(<QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>)
}

describe('AiSuggestionBadge', () => {
  it('renders nothing when there are no suggestions', () => {
    mockUseAiSuggestions.mockReturnValue({
      data: [],
      isLoading: false,
      isError: false,
    } as any)

    const { container } = renderWithQuery(<AiSuggestionBadge nameId={1} />)

    expect(container.firstChild).toBeNull()
  })

  it('renders nothing when all suggestions are dismissed', () => {
    mockUseAiSuggestions.mockReturnValue({
      data: [
        {
          '@id': '/api/ai_suggestions/1',
          id: 1,
          status: 'dismissed',
          payload: {
            detectedLocale: 'ru',
            suggestedLocale: 'lv',
            given: 'Jānis',
            family: 'Bērziņš',
          },
        },
      ],
      isLoading: false,
      isError: false,
    } as any)

    const { container } = renderWithQuery(<AiSuggestionBadge nameId={1} />)

    expect(container.firstChild).toBeNull()
  })

  it('renders the sparkle icon when a pending suggestion exists', () => {
    mockUseAiSuggestions.mockReturnValue({
      data: [
        {
          '@id': '/api/ai_suggestions/1',
          id: 1,
          status: 'pending',
          payload: {
            detectedLocale: 'ru',
            suggestedLocale: 'lv',
            given: 'Jānis',
            family: 'Bērziņš',
          },
        },
      ],
      isLoading: false,
      isError: false,
    } as any)

    renderWithQuery(<AiSuggestionBadge nameId={1} />)

    // The sparkle icon button should be rendered
    const button = screen.getByRole('button')
    expect(button).toBeInTheDocument()
  })

  it('passes nameId to useAiSuggestions with contact_name entityType', () => {
    mockUseAiSuggestions.mockReturnValue({ data: [], isLoading: false, isError: false } as any)

    renderWithQuery(<AiSuggestionBadge nameId={42} />)

    expect(mockUseAiSuggestions).toHaveBeenCalledWith('contact_name', 42)
  })
})
