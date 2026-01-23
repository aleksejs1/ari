import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { api } from '@/lib/axios'

import { NotificationList } from './NotificationList'

vi.mock('@/lib/axios', () => ({
  api: {
    get: vi.fn(),
    patch: vi.fn(),
  },
}))

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, fallback?: string) => fallback || key,
    i18n: { language: 'en' },
  }),
}))

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  function ReactQueryWrapper({ children }: { children: React.ReactNode }) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  }
  return ReactQueryWrapper
}

describe('NotificationList', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders loading state', () => {
    vi.mocked(api.get).mockReturnValue(
      new Promise(() => {
        // Never resolves
      }),
    )
    const Wrapper = createWrapper()
    render(
      <Wrapper>
        <NotificationList />
      </Wrapper>,
    )

    // Loading spinner should be present
    expect(document.querySelector('.animate-spin')).toBeInTheDocument()
  })

  it('renders error state', async () => {
    vi.mocked(api.get).mockRejectedValue(new Error('Failed'))
    const Wrapper = createWrapper()
    render(
      <Wrapper>
        <NotificationList />
      </Wrapper>,
    )

    await waitFor(() => {
      expect(screen.getByText('Failed to load notifications')).toBeInTheDocument()
    })
  })

  it('renders empty state', async () => {
    vi.mocked(api.get).mockResolvedValue({ data: { member: [] } })
    const Wrapper = createWrapper()
    render(
      <Wrapper>
        <NotificationList />
      </Wrapper>,
    )

    await waitFor(() => {
      expect(screen.getByText('No notifications')).toBeInTheDocument()
    })
  })

  it('renders notifications list', async () => {
    vi.mocked(api.get).mockResolvedValue({
      data: {
        member: [
          {
            id: 1,
            '@id': '/api/activity/1',
            title: 'Notification 1',
            message: 'Message 1',
            isRead: false,
          },
          {
            id: 2,
            '@id': '/api/activity/2',
            title: 'Notification 2',
            message: 'Message 2',
            isRead: true,
          },
        ],
      },
    })
    const Wrapper = createWrapper()
    render(
      <Wrapper>
        <NotificationList />
      </Wrapper>,
    )

    await waitFor(() => {
      expect(screen.getByText('Notification 1')).toBeInTheDocument()
      expect(screen.getByText('Notification 2')).toBeInTheDocument()
    })
  })
})
