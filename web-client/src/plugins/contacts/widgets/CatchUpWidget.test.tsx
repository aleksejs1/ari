import { MemoryRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import CatchUpWidget from './CatchUpWidget'

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (k: string, opts?: any) => (opts?.count !== undefined ? `${k}:${opts.count}` : k),
  }),
}))

vi.mock('../hooks/useInteractions', () => ({
  useNeedsAttention: vi.fn(),
  useCreateInteraction: vi.fn(() => ({ mutateAsync: vi.fn(), isPending: false })),
}))

vi.mock('../components/InteractionEditDrawer', () => ({
  InteractionEditDrawer: ({
    open,
    onOpenChange,
  }: {
    open: boolean
    onOpenChange: (v: boolean) => void
  }) =>
    open ? (
      <div data-testid="drawer">
        <button onClick={() => onOpenChange(false)}>Close</button>
      </div>
    ) : null,
}))

import * as interactionsHook from '../hooks/useInteractions'

function renderWidget() {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        <CatchUpWidget />
      </MemoryRouter>
    </QueryClientProvider>,
  )
}

describe('CatchUpWidget', () => {
  it('renders loading state', () => {
    vi.mocked(interactionsHook.useNeedsAttention).mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
    } as any)

    renderWidget()
    expect(screen.getByText('loading')).toBeInTheDocument()
  })

  it('renders error state', () => {
    vi.mocked(interactionsHook.useNeedsAttention).mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
    } as any)

    renderWidget()
    expect(screen.getByText('error')).toBeInTheDocument()
  })

  it('renders "all caught up" when no overdue contacts', () => {
    vi.mocked(interactionsHook.useNeedsAttention).mockReturnValue({
      data: [],
      isLoading: false,
      isError: false,
    } as any)

    renderWidget()
    expect(screen.getByText('widgets.catchUp.allCaughtUp')).toBeInTheDocument()
  })

  it('renders overdue contacts with names and badges', () => {
    vi.mocked(interactionsHook.useNeedsAttention).mockReturnValue({
      data: [
        {
          '@id': '/api/contacts/1',
          id: 1,
          displayName: 'Alice',
          overdueDays: 10,
          lastInteractionAt: '2024-01-01T00:00:00+00:00',
        },
        {
          '@id': '/api/contacts/2',
          id: 2,
          displayName: 'Bob',
          overdueDays: 5,
          lastInteractionAt: null,
        },
      ],
      isLoading: false,
      isError: false,
    } as any)

    renderWidget()
    expect(screen.getByText('Alice')).toBeInTheDocument()
    expect(screen.getByText('Bob')).toBeInTheDocument()
    expect(screen.getAllByText(/interactions\.overdueByDays/)).toHaveLength(2)
  })

  it('shows "view all" link when overdue contacts are present', () => {
    vi.mocked(interactionsHook.useNeedsAttention).mockReturnValue({
      data: [
        {
          '@id': '/api/contacts/1',
          id: 1,
          displayName: 'Alice',
          overdueDays: 5,
          lastInteractionAt: null,
        },
      ],
      isLoading: false,
      isError: false,
    } as any)

    renderWidget()
    const link = screen.getByText('widgets.catchUp.viewAll')
    expect(link).toBeInTheDocument()
    expect(link.closest('a')).toHaveAttribute('href', '/contacts?needsAttention=true')
  })

  it('does not show "view all" link when no overdue contacts', () => {
    vi.mocked(interactionsHook.useNeedsAttention).mockReturnValue({
      data: [],
      isLoading: false,
      isError: false,
    } as any)

    renderWidget()
    expect(screen.queryByText('widgets.catchUp.viewAll')).not.toBeInTheDocument()
  })

  it('opens InteractionEditDrawer when "Log" button is clicked', () => {
    vi.mocked(interactionsHook.useNeedsAttention).mockReturnValue({
      data: [
        {
          '@id': '/api/contacts/1',
          id: 1,
          displayName: 'Alice',
          overdueDays: 5,
          lastInteractionAt: null,
        },
      ],
      isLoading: false,
      isError: false,
    } as any)

    renderWidget()
    expect(screen.queryByTestId('drawer')).not.toBeInTheDocument()
    fireEvent.click(screen.getByText('interactions.log'))
    expect(screen.getByTestId('drawer')).toBeInTheDocument()
  })

  it('shows "never" label when lastInteractionAt is null', () => {
    vi.mocked(interactionsHook.useNeedsAttention).mockReturnValue({
      data: [
        {
          '@id': '/api/contacts/1',
          id: 1,
          displayName: 'Alice',
          overdueDays: 30,
          lastInteractionAt: null,
        },
      ],
      isLoading: false,
      isError: false,
    } as any)

    renderWidget()
    expect(screen.getByText('widgets.catchUp.never')).toBeInTheDocument()
  })
})
