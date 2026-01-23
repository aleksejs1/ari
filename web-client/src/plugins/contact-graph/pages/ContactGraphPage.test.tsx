import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import * as useContactGraphHook from '../api/useContactGraph'

import ContactGraphPage from './ContactGraphPage'

// Mock the API hook
vi.mock('../api/useContactGraph', () => ({
  useContactGraph: vi.fn(),
}))

// Mock the child component
vi.mock('../components/ContactGraph', () => ({
  ContactGraph: ({ data }: any) => (
    <div data-testid="contact-graph-mock">Graph with {data.nodes.length} nodes</div>
  ),
}))

describe('ContactGraphPage', () => {
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

    render(<ContactGraphPage />)
    expect(screen.getByTestId('icon-Loader2')).toBeInTheDocument()
  })

  it('renders error state', () => {
    vi.mocked(useContactGraphHook.useContactGraph).mockReturnValue({
      data: undefined,
      isLoading: false,
      error: new Error('Failed to fetch'),
      refetch: vi.fn(),
    } as any)

    render(<ContactGraphPage />)
    expect(screen.getByText('common.error')).toBeInTheDocument()
    expect(screen.getByText('Failed to fetch')).toBeInTheDocument()
  })

  it('renders success state with graph', () => {
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

    render(<ContactGraphPage />)
    expect(screen.getByText('contactGraph.title')).toBeInTheDocument()
    expect(screen.getByTestId('contact-graph-mock')).toBeInTheDocument()
    expect(screen.getByText('Graph with 1 nodes')).toBeInTheDocument()
  })
})
