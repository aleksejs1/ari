import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { api } from '@/lib/axios'

import RecentAuditLogsWidget from './RecentAuditLogsWidget'

vi.mock('@/lib/axios', () => ({
  api: {
    get: vi.fn(),
  },
}))

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
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

describe('RecentAuditLogsWidget', () => {
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
        <RecentAuditLogsWidget />
      </Wrapper>,
    )

    expect(screen.getByText('common.loading')).toBeInTheDocument()
  })

  it('renders empty state when no logs', async () => {
    vi.mocked(api.get).mockResolvedValue({ data: { member: [], totalItems: 0 } })
    const Wrapper = createWrapper()
    render(
      <Wrapper>
        <RecentAuditLogsWidget />
      </Wrapper>,
    )

    await waitFor(() => {
      expect(screen.getByText('auditLogs.noLogs')).toBeInTheDocument()
    })
  })

  it('renders audit logs', async () => {
    vi.mocked(api.get).mockResolvedValue({
      data: {
        member: [
          {
            id: 1,
            action: 'INSERT',
            entityType: 'App\\Entity\\Contact',
            entityId: 123,
            createdAt: '2024-01-15T10:30:00Z',
          },
          {
            id: 2,
            action: 'UPDATE',
            entityType: 'App\\Entity\\ContactName',
            entityId: 456,
            ownerEntityType: 'App\\Entity\\Contact',
            ownerEntityId: 789,
            createdAt: '2024-01-15T11:00:00Z',
          },
        ],
        totalItems: 2,
      },
    })
    const Wrapper = createWrapper()
    render(
      <Wrapper>
        <RecentAuditLogsWidget />
      </Wrapper>,
    )

    await waitFor(() => {
      expect(screen.getByText('dashboard.recentAuditLogs')).toBeInTheDocument()
    })
  })

  it('displays title link to audit logs page', async () => {
    vi.mocked(api.get).mockResolvedValue({ data: { member: [], totalItems: 0 } })
    const Wrapper = createWrapper()
    render(
      <Wrapper>
        <RecentAuditLogsWidget />
      </Wrapper>,
    )

    await waitFor(() => {
      const link = screen.getByRole('link')
      expect(link).toHaveAttribute('href', '/audit-logs')
    })
  })
})
