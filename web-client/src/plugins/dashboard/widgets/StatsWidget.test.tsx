import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { api } from '@/lib/axios'

import StatsWidget from './StatsWidget'

vi.mock('@/lib/axios', () => ({
  api: {
    get: vi.fn(),
  },
}))

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
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

describe('StatsWidget', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders skeleton when loading', () => {
    vi.mocked(api.get).mockReturnValue(
      new Promise(() => {
        // Never resolves
      }),
    )
    const Wrapper = createWrapper()
    const { container } = render(
      <Wrapper>
        <StatsWidget />
      </Wrapper>,
    )
    expect(container.querySelector('.animate-pulse')).toBeInTheDocument()
  })

  it('renders stats when data is loaded', async () => {
    vi.mocked(api.get).mockResolvedValue({
      data: {
        totalContacts: 10,
        totalAuditLogs: 20,
        totalSentNotifications: 5,
      },
    })
    const Wrapper = createWrapper()
    render(
      <Wrapper>
        <StatsWidget />
      </Wrapper>,
    )

    await waitFor(() => {
      expect(screen.getByText('10')).toBeInTheDocument()
      expect(screen.getByText('20')).toBeInTheDocument()
      expect(screen.getByText('5')).toBeInTheDocument()
    })

    expect(screen.getByText('dashboard.totalContacts')).toBeInTheDocument()
    expect(screen.getByText('dashboard.totalAuditLogs')).toBeInTheDocument()
    expect(screen.getByText('dashboard.totalSentNotifications')).toBeInTheDocument()
  })

  it('renders nothing on error', async () => {
    vi.mocked(api.get).mockRejectedValue(new Error('API Error'))
    const Wrapper = createWrapper()
    const { container } = render(
      <Wrapper>
        <StatsWidget />
      </Wrapper>,
    )

    await waitFor(() => {
      expect(container.firstChild).toBeNull()
    })
  })
})
