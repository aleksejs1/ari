import { useQuery, type UseQueryResult } from '@tanstack/react-query'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'

import AuditLogsPage from './AuditLogsPage'

import { type TimelineEvent } from '@/types/models'

// Mock api
vi.mock('@/lib/axios', () => ({
  api: {
    get: vi.fn(),
  },
}))

// Mock components to avoid deep rendering
vi.mock('./components/LogList', () => ({
  LogList: ({ logs, isPlaceholderData }: { logs: TimelineEvent[]; isPlaceholderData: boolean }) => (
    <div data-testid="log-list">{isPlaceholderData ? 'Loading...' : `Logs: ${logs.length}`}</div>
  ),
}))

// Mock react-i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, options?: { count?: number; current?: number; total?: number }) => {
      if (key === 'auditLogs.totalCount') {
        return `Total: ${options?.count}`
      }
      if (key === 'pagination.pageInfo') {
        return `Page ${options?.current} of ${options?.total}`
      }
      return key
    },
    i18n: { language: 'en' },
  }),
}))

describe('AuditLogsPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('is a standard test suite', () => {
    expect(true).toBe(true)
  })
})

// Let's restart with mocking useQuery for UI state testing as it is cleaner for component tests
// We need to re-import to mock
vi.mock('@tanstack/react-query', async () => {
  const actual = await vi.importActual('@tanstack/react-query')
  return {
    ...actual,
    useQuery: vi.fn(),
  }
})

describe('AuditLogsPage UI States', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders loading spinner', () => {
    vi.mocked(useQuery).mockReturnValue({
      data: undefined,
      isLoading: true,
      isPlaceholderData: false,
      error: null,
    } as unknown as UseQueryResult<unknown, unknown>)

    render(<AuditLogsPage />)
    // Loader2 is used, usually has animate-spin class or we can find by container
    const spinner = document.querySelector('.animate-spin')
    expect(spinner).toBeInTheDocument()
  })

  it('renders error state', () => {
    vi.mocked(useQuery).mockReturnValue({
      data: undefined,
      isLoading: false,
      isPlaceholderData: false,
      error: new Error('Failed'),
    } as unknown as UseQueryResult<unknown, unknown>)

    render(<AuditLogsPage />)
    expect(screen.getByText('errors.failedToLoadLogs')).toBeInTheDocument()
  })

  it('renders logs and pagination', () => {
    const mockData = {
      member: [
        { '@id': '/logs/1', id: 1 },
        { '@id': '/logs/2', id: 2 },
      ],
      totalItems: 60, // 2 pages
    }

    vi.mocked(useQuery).mockReturnValue({
      data: mockData,
      isLoading: false,
      isPlaceholderData: false,
      error: null,
    } as unknown as UseQueryResult<unknown, unknown>)

    render(<AuditLogsPage />)

    expect(screen.getByText('auditLogs.title')).toBeInTheDocument()
    expect(screen.getByText('Total: 60')).toBeInTheDocument()
    expect(screen.getByTestId('log-list')).toHaveTextContent('Logs: 2')

    // Paginator should be visible for 60 items (30 per page -> 2 pages)
    expect(screen.getByText('Page 1 of 2')).toBeInTheDocument()
    expect(screen.getByText('pagination.next')).toBeInTheDocument()
  })

  it('handles pagination click', async () => {
    const mockData = {
      member: [],
      totalItems: 60,
    }

    // We need to check if setPage was called or if checking standard behavior
    // Since useQuery depends on state, we can spy on the hook or just check if buttons are clickable
    // Ideally we check if clicking 'Next' triggers a re-render with new page, but we mocked useQuery.
    // We can verify that the button is enabled and clickable.

    vi.mocked(useQuery).mockReturnValue({
      data: mockData,
      isLoading: false,
      isPlaceholderData: false,
      error: null,
    } as unknown as UseQueryResult<unknown, unknown>)

    render(<AuditLogsPage />)

    const nextBtn = screen.getByText('pagination.next')
    fireEvent.click(nextBtn)

    // Since we mocked useQuery, it won't actually refetch or update the returned data unless we implement a fake hook
    // But the component state (page) updates.
    // The useQuery is called with ['audit-logs', page].

    // Let's verify subsequent call
    await waitFor(() => {
      expect(useQuery).toHaveBeenLastCalledWith(
        expect.objectContaining({
          queryKey: ['audit-logs', 2],
        }),
      )
    })
  })
})
