import { MemoryRouter } from 'react-router-dom'
import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import * as useContactGraphHook from '../api/useContactGraph'

import { ContactGraphWidget } from './ContactGraphWidget'

// Mock the API hook
vi.mock('../api/useContactGraph', () => ({
  useContactGraph: vi.fn(),
}))

// Mock the child component
vi.mock('./ContactGraph', () => ({
  ContactGraph: ({ data }: any) => (
    <div data-testid="contact-graph-mock">Widget Graph with {data.nodes.length} nodes</div>
  ),
}))

describe('ContactGraphWidget', () => {
  const mockContactId = '123'

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders loading state', () => {
    vi.mocked(useContactGraphHook.useContactGraph).mockReturnValue({
      data: undefined,
      isLoading: true,
      error: null,
      refetch: vi.fn(),
    } as any)

    render(<ContactGraphWidget contactId={mockContactId} />, { wrapper: MemoryRouter })
    expect(screen.getByTestId('icon-Loader2')).toBeInTheDocument()
  })

  it('renders error state', () => {
    vi.mocked(useContactGraphHook.useContactGraph).mockReturnValue({
      data: undefined,
      isLoading: false,
      error: new Error('Widget Error'),
      refetch: vi.fn(),
    } as any)

    render(<ContactGraphWidget contactId={mockContactId} />, { wrapper: MemoryRouter })
    expect(screen.getByText('common.error')).toBeInTheDocument()
    expect(screen.getByText('Widget Error')).toBeInTheDocument()
  })

  it('renders empty data state', () => {
    vi.mocked(useContactGraphHook.useContactGraph).mockReturnValue({
      data: { nodes: [], links: [] },
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    } as any)

    render(<ContactGraphWidget contactId={mockContactId} />, { wrapper: MemoryRouter })
    expect(screen.getByText('contactGraph.noConnections')).toBeInTheDocument()
  })

  it('renders success state', () => {
    const mockData = {
      nodes: [{ id: '1', user: 'User 1' }],
      links: [],
    }

    vi.mocked(useContactGraphHook.useContactGraph).mockReturnValue({
      data: mockData,
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    } as any)

    render(<ContactGraphWidget contactId={mockContactId} />, { wrapper: MemoryRouter })
    expect(screen.getByTestId('contact-graph-mock')).toBeInTheDocument()
    expect(screen.getByText('Widget Graph with 1 nodes')).toBeInTheDocument()
    // Check for the link
    const link = screen.getByRole('link', { name: /contactGraph.viewFullGraph/i })
    expect(link).toHaveAttribute('href', `/contact-graph?focus=${mockContactId}`)
  })
})
