import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'

import { NotificationBell } from './NotificationBell'

import {
  useUnreadCount,
  useNotifications,
  useMarkAsRead,
} from '@/features/activity-feed/useNotifications'

// Mock the hooks
vi.mock('@/features/activity-feed/useNotifications', () => ({
  useUnreadCount: vi.fn(),
  useNotifications: vi.fn(),
  useMarkAsRead: vi.fn(),
}))

describe('NotificationBell', () => {
  it('renders bell icon', () => {
    vi.mocked(useUnreadCount).mockReturnValue({ data: 0 } as unknown as ReturnType<
      typeof useUnreadCount
    >)
    vi.mocked(useNotifications).mockReturnValue({ data: [] } as unknown as ReturnType<
      typeof useNotifications
    >)
    vi.mocked(useMarkAsRead).mockReturnValue({ mutate: vi.fn() } as unknown as ReturnType<
      typeof useMarkAsRead
    >)

    render(<NotificationBell />)
    expect(screen.getByText('Notifications')).toBeInTheDocument()
  })

  it('renders badge when there are unread notifications', () => {
    vi.mocked(useUnreadCount).mockReturnValue({ data: 5 } as unknown as ReturnType<
      typeof useUnreadCount
    >)
    vi.mocked(useNotifications).mockReturnValue({ data: [] } as unknown as ReturnType<
      typeof useNotifications
    >)
    vi.mocked(useMarkAsRead).mockReturnValue({ mutate: vi.fn() } as unknown as ReturnType<
      typeof useMarkAsRead
    >)

    render(<NotificationBell />)
    expect(screen.getByText('5')).toBeInTheDocument()
  })

  it('renders 99+ when unread count is greater than 99', () => {
    vi.mocked(useUnreadCount).mockReturnValue({ data: 100 } as unknown as ReturnType<
      typeof useUnreadCount
    >)
    vi.mocked(useNotifications).mockReturnValue({ data: [] } as unknown as ReturnType<
      typeof useNotifications
    >)
    vi.mocked(useMarkAsRead).mockReturnValue({ mutate: vi.fn() } as unknown as ReturnType<
      typeof useMarkAsRead
    >)

    render(<NotificationBell />)
    expect(screen.getByText('99+')).toBeInTheDocument()
  })
})
