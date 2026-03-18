import { MemoryRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import type { Contact } from '@/types/models'

import { KeepInTouchSection } from './KeepInTouchSection'

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (k: string, opts?: any) => (opts?.count !== undefined ? `${k}:${opts.count}` : k),
  }),
}))

vi.mock('../../hooks/useInteractions', () => ({
  useCreateInteraction: vi.fn(() => ({ mutateAsync: vi.fn(), isPending: false })),
  useUpdateInteraction: vi.fn(() => ({ mutateAsync: vi.fn(), isPending: false })),
  useDeleteInteraction: vi.fn(() => ({ mutateAsync: vi.fn(), isPending: false })),
  useUpdateContactCadence: vi.fn(() => ({ mutateAsync: vi.fn(), isPending: false })),
}))

vi.mock('../../components/InteractionTimeline', () => ({
  InteractionTimeline: ({ interactions }: { interactions: any[] }) => (
    <div data-testid="timeline">{interactions.length} interactions</div>
  ),
}))

vi.mock('../../components/InteractionEditDrawer', () => ({
  InteractionEditDrawer: ({ open }: { open: boolean }) =>
    open ? <div data-testid="drawer">Drawer</div> : null,
}))

function renderWithProviders(ui: React.ReactElement) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>{ui}</MemoryRouter>
    </QueryClientProvider>,
  )
}

const BASE_CONTACT: Contact = {
  '@id': '/api/contacts/1',
  id: 1,
  displayName: 'Alice',
  cadenceDays: null,
  contactInteractions: [],
} as unknown as Contact

describe('KeepInTouchSection', () => {
  it('returns null when contact has no @id', () => {
    const { container } = renderWithProviders(
      <KeepInTouchSection contact={{ ...BASE_CONTACT, '@id': undefined } as any} />,
    )
    expect(container.firstChild).toBeNull()
  })

  it('shows "Set cadence" text when cadenceDays is null', () => {
    renderWithProviders(<KeepInTouchSection contact={BASE_CONTACT} />)
    expect(screen.getByText('interactions.setCadence')).toBeInTheDocument()
  })

  it('shows "every N days" text when cadenceDays is set', () => {
    renderWithProviders(<KeepInTouchSection contact={{ ...BASE_CONTACT, cadenceDays: 30 }} />)
    expect(screen.getByText(/interactions\.everyNDays/)).toBeInTheDocument()
  })

  it('does not show overdue badge when not overdue', () => {
    const recentTs = new Date(Date.now() - 5 * 86_400_000).toISOString()
    const contact: Contact = {
      ...BASE_CONTACT,
      cadenceDays: 30,
      contactInteractions: [
        { '@id': '/api/contact_interactions/1', type: 'call', timestamp: recentTs },
      ],
    } as unknown as Contact
    renderWithProviders(<KeepInTouchSection contact={contact} />)
    expect(screen.queryByText(/interactions\.overdueByDays/)).not.toBeInTheDocument()
  })

  it('shows overdue badge when overdue', () => {
    const oldTs = new Date(Date.now() - 40 * 86_400_000).toISOString()
    const contact: Contact = {
      ...BASE_CONTACT,
      cadenceDays: 30,
      contactInteractions: [
        { '@id': '/api/contact_interactions/1', type: 'call', timestamp: oldTs },
      ],
    } as unknown as Contact
    renderWithProviders(<KeepInTouchSection contact={contact} />)
    expect(screen.getByText(/interactions\.overdueByDays/)).toBeInTheDocument()
  })

  it('renders the interaction timeline', () => {
    renderWithProviders(<KeepInTouchSection contact={BASE_CONTACT} />)
    expect(screen.getByTestId('timeline')).toBeInTheDocument()
  })

  it('opens drawer when "Log Interaction" button is clicked', () => {
    renderWithProviders(<KeepInTouchSection contact={BASE_CONTACT} />)
    expect(screen.queryByTestId('drawer')).not.toBeInTheDocument()
    fireEvent.click(screen.getByText('interactions.log'))
    expect(screen.getByTestId('drawer')).toBeInTheDocument()
  })

  it('clicking cadence button switches to edit mode', () => {
    renderWithProviders(<KeepInTouchSection contact={BASE_CONTACT} />)
    fireEvent.click(screen.getByText('interactions.setCadence'))
    expect(screen.getByRole('spinbutton')).toBeInTheDocument()
  })
})
