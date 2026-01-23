import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { api } from '@/lib/axios'

import UpcomingAnniversariesWidget from './UpcomingAnniversariesWidget'

vi.mock('@/lib/axios', () => ({
  api: {
    get: vi.fn(),
  },
}))

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, opts?: { count?: number }) =>
      opts?.count !== undefined ? `${key}:${opts.count}` : key,
    i18n: { language: 'en' },
  }),
}))

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  function ReactQueryWrapper({ children }: { children: React.ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>{children}</BrowserRouter>
      </QueryClientProvider>
    )
  }
  return ReactQueryWrapper
}

describe('UpcomingAnniversariesWidget', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders loading state', () => {
    vi.mocked(api.get).mockReturnValue(
      new Promise(() => {
        // Never resolves to simulate loading state
      }),
    )
    const Wrapper = createWrapper()
    render(
      <Wrapper>
        <UpcomingAnniversariesWidget />
      </Wrapper>,
    )

    expect(screen.getByText('common.loading')).toBeInTheDocument()
  })

  it('renders error state', async () => {
    vi.mocked(api.get).mockRejectedValue(new Error('Failed'))
    const Wrapper = createWrapper()
    render(
      <Wrapper>
        <UpcomingAnniversariesWidget />
      </Wrapper>,
    )

    await waitFor(() => {
      expect(screen.getByText('contacts.error')).toBeInTheDocument()
    })
  })

  it('renders empty state when no anniversaries', async () => {
    vi.mocked(api.get).mockResolvedValue({ data: { member: [] } })
    const Wrapper = createWrapper()
    render(
      <Wrapper>
        <UpcomingAnniversariesWidget />
      </Wrapper>,
    )

    await waitFor(() => {
      expect(screen.getByText('dashboard.noUpcoming')).toBeInTheDocument()
    })
  })

  it('renders upcoming anniversaries', async () => {
    vi.mocked(api.get).mockResolvedValue({
      data: {
        member: [
          {
            id: 1,
            text: 'Birthday',
            nextAnniversaryDate: '2024-06-15',
            yearsAtNextAnniversary: 30,
            contact: {
              '@id': '/api/contacts/123',
              displayName: 'John Doe',
            },
          },
          {
            id: 2,
            text: 'Wedding Anniversary',
            nextAnniversaryDate: '2024-07-20',
            yearsAtNextAnniversary: 10,
            contact: {
              '@id': '/api/contacts/456',
              displayName: 'Jane Smith',
            },
          },
        ],
      },
    })
    const Wrapper = createWrapper()
    render(
      <Wrapper>
        <UpcomingAnniversariesWidget />
      </Wrapper>,
    )

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument()
      expect(screen.getByText('Jane Smith')).toBeInTheDocument()
      expect(screen.getByText('Birthday')).toBeInTheDocument()
      expect(screen.getByText('Wedding Anniversary')).toBeInTheDocument()
    })
  })

  it('renders anniversary without years count', async () => {
    vi.mocked(api.get).mockResolvedValue({
      data: {
        member: [
          {
            id: 1,
            text: 'Event',
            nextAnniversaryDate: '2024-06-15',
            contact: {
              '@id': '/api/contacts/123',
              displayName: 'Test Contact',
            },
          },
        ],
      },
    })
    const Wrapper = createWrapper()
    render(
      <Wrapper>
        <UpcomingAnniversariesWidget />
      </Wrapper>,
    )

    await waitFor(() => {
      expect(screen.getByText('Test Contact')).toBeInTheDocument()
    })
  })

  it('handles contact without displayName', async () => {
    vi.mocked(api.get).mockResolvedValue({
      data: {
        member: [
          {
            id: 1,
            text: 'Birthday',
            nextAnniversaryDate: '2024-06-15',
            contact: {
              '@id': '/api/contacts/123',
            },
          },
        ],
      },
    })
    const Wrapper = createWrapper()
    render(
      <Wrapper>
        <UpcomingAnniversariesWidget />
      </Wrapper>,
    )

    await waitFor(() => {
      expect(screen.getByText('contacts.noName')).toBeInTheDocument()
    })
  })
})
