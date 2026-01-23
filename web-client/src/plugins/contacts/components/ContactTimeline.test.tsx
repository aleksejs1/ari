import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import type { ContactTimeline as ContactTimelineType } from '@/types/models'

import { ContactTimeline } from './ContactTimeline'

// Mock API and child components
vi.mock('@/lib/axios', () => ({
  api: {
    get: vi.fn(),
  },
}))

vi.mock('./ContactTimelineItem', () => ({
  ContactTimelineItem: ({ log }: any) => (
    <div data-testid="timeline-item">
      {log.action} - {log.id}
    </div>
  ),
}))

// Mock React Query
const mockUseQuery = vi.fn()
vi.mock('@tanstack/react-query', () => ({
  useQuery: (options: any) => mockUseQuery(options),
}))

describe('ContactTimeline', () => {
  const mockContactId = '123'

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders loading state', () => {
    mockUseQuery.mockReturnValue({
      data: undefined,
      isLoading: true,
      error: null,
    })

    render(<ContactTimeline contactId={mockContactId} />)
    expect(screen.getByTestId('icon-Loader2')).toBeInTheDocument()
  })

  it('renders error state', () => {
    mockUseQuery.mockReturnValue({
      data: undefined,
      isLoading: false,
      error: new Error('Failed to load'),
    })

    render(<ContactTimeline contactId={mockContactId} />)
    expect(screen.getByText('contacts.history.failedToLoadTimeline')).toBeInTheDocument()
  })

  it('renders empty history message', () => {
    mockUseQuery.mockReturnValue({
      data: { logs: [] },
      isLoading: false,
      error: null,
    })

    render(<ContactTimeline contactId={mockContactId} />)
    expect(screen.getByText('contacts.history.noHistory')).toBeInTheDocument()
  })

  it('renders timeline logs', () => {
    const mockData: ContactTimelineType = {
      id: 123,
      logs: [{ id: 1, action: 'created' } as any, { id: 2, action: 'updated' } as any],
    }

    mockUseQuery.mockReturnValue({
      data: mockData,
      isLoading: false,
      error: null,
    })

    render(<ContactTimeline contactId={mockContactId} />)

    expect(screen.getByText('contacts.history.timeline')).toBeInTheDocument()
    const items = screen.getAllByTestId('timeline-item')
    expect(items).toHaveLength(2)
    expect(items[0]).toHaveTextContent('created - 1')
    expect(items[1]).toHaveTextContent('updated - 2')
  })

  it('renders without header when fullHeight is true', () => {
    mockUseQuery.mockReturnValue({
      data: { logs: [] },
      isLoading: false,
      error: null,
    })

    render(<ContactTimeline contactId={mockContactId} fullHeight />)
    expect(screen.queryByText('contacts.history.timeline')).not.toBeInTheDocument()
  })
})
