import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import HomePage from './HomePage'

vi.mock('@/features/dashboard/GroupsWidget', () => ({
  default: () => <div data-testid="groups-widget">GroupsWidget</div>,
}))

vi.mock('@/features/dashboard/RecentAuditLogsWidget', () => ({
  default: () => <div data-testid="audit-logs-widget">RecentAuditLogsWidget</div>,
}))

vi.mock('@/features/dashboard/UpcomingAnniversariesWidget', () => ({
  default: () => <div data-testid="anniversaries-widget">UpcomingAnniversariesWidget</div>,
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

describe('HomePage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders dashboard title', () => {
    const Wrapper = createWrapper()
    render(
      <Wrapper>
        <HomePage />
      </Wrapper>,
    )

    expect(screen.getByText('dashboard.title')).toBeInTheDocument()
  })

  it('renders GroupsWidget', () => {
    const Wrapper = createWrapper()
    render(
      <Wrapper>
        <HomePage />
      </Wrapper>,
    )

    expect(screen.getByTestId('groups-widget')).toBeInTheDocument()
  })

  it('renders UpcomingAnniversariesWidget', () => {
    const Wrapper = createWrapper()
    render(
      <Wrapper>
        <HomePage />
      </Wrapper>,
    )

    expect(screen.getByTestId('anniversaries-widget')).toBeInTheDocument()
  })

  it('renders RecentAuditLogsWidget', () => {
    const Wrapper = createWrapper()
    render(
      <Wrapper>
        <HomePage />
      </Wrapper>,
    )

    expect(screen.getByTestId('audit-logs-widget')).toBeInTheDocument()
  })
})
