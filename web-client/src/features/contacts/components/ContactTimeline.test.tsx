import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen, waitFor } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'

import { ContactTimeline } from './ContactTimeline'

import { api } from '@/lib/axios'

// Mock api
vi.mock('@/lib/axios', () => ({
  api: {
    get: vi.fn(),
  },
}))

const renderWithClient = (ui: React.ReactNode) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  })
  return render(<QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>)
}

describe('ContactTimeline', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  it('renders loading state initially', () => {
    const mockGet = api.get as unknown as ReturnType<typeof vi.fn>
    mockGet.mockReturnValue(new Promise(() => undefined)) // Pending promise
    const { container } = renderWithClient(<ContactTimeline contactId="1" />)
    // Loader should be present
    expect(container.querySelector('.animate-spin')).toBeInTheDocument()
  })

  it('renders timeline events when data fetches successfully', async () => {
    const mockData = {
      logs: [
        {
          id: 1,
          action: 'update',
          entityType: 'Contact',
          createdAt: '2023-01-01T10:00:00Z',
          changes: {
            name: 'New Name',
            date: [
              { date: '1990-05-16 00:00:00.000000', timezone_type: 3, timezone: 'UTC' },
              { date: '1991-05-16 00:00:00.000000', timezone_type: 3, timezone: 'UTC' },
            ],
          },
        },
      ],
    }
    const mockGet = api.get as unknown as ReturnType<typeof vi.fn>
    mockGet.mockResolvedValue({ data: mockData })

    renderWithClient(<ContactTimeline contactId="1" />)

    await waitFor(() => {
      expect(screen.getByText('contacts.history.timeline')).toBeInTheDocument()
      expect(screen.getByText('contacts.history.actions.Contact.update')).toBeInTheDocument()
      expect(screen.getByText(/New Name/)).toBeInTheDocument()
      expect(screen.getByText(/May 16th, 1990/)).toBeInTheDocument()
    })
  })

  it('renders empty state when no logs', async () => {
    const mockData = {
      logs: [],
    }
    const mockGet = api.get as unknown as ReturnType<typeof vi.fn>
    mockGet.mockResolvedValue({ data: mockData })

    renderWithClient(<ContactTimeline contactId="1" />)

    await waitFor(() => {
      expect(screen.getByText('contacts.history.noHistory')).toBeInTheDocument()
    })
  })

  it('renders REMOVE events with snapshotBefore data', async () => {
    const mockData = {
      logs: [
        {
          id: 1,
          action: 'REMOVE',
          entityType: 'ContactDate',
          createdAt: '2023-01-01T10:00:00Z',
          snapshotBefore: {
            date: '1990-05-16T00:00:00+00:00',
            text: 'Anniversary',
          },
        },
      ],
    }
    const mockGet = api.get as unknown as ReturnType<typeof vi.fn>
    mockGet.mockResolvedValue({ data: mockData })

    renderWithClient(<ContactTimeline contactId="1" />)

    await waitFor(() => {
      expect(screen.getByText('contacts.history.actions.ContactDate.REMOVE')).toBeInTheDocument()
      expect(screen.getByText(/May 16th, 1990/)).toBeInTheDocument()
      expect(screen.getByText(/Anniversary/)).toBeInTheDocument()
    })
  })
})
