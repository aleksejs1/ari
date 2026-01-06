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
    ;(useUnreadCount as any).mockReturnValue({ data: 0 })
    ;(useNotifications as any).mockReturnValue({ data: [] })
    ;(useMarkAsRead as any).mockReturnValue({ mutate: vi.fn() })

    render(<NotificationBell />)
    expect(screen.getByText('Notifications')).toBeInTheDocument()
  })

  it('renders badge when there are unread notifications', () => {
    ;(useUnreadCount as any).mockReturnValue({ data: 5 })
    ;(useNotifications as any).mockReturnValue({ data: [] })
    ;(useMarkAsRead as any).mockReturnValue({ mutate: vi.fn() })

    render(<NotificationBell />)
    expect(screen.getByText('5')).toBeInTheDocument()
  })

  it('renders 99+ when unread count is greater than 99', () => {
    ;(useUnreadCount as any).mockReturnValue({ data: 100 })
    ;(useNotifications as any).mockReturnValue({ data: [] })
    ;(useMarkAsRead as any).mockReturnValue({ mutate: vi.fn() })

    render(<NotificationBell />)
    expect(screen.getByText('99+')).toBeInTheDocument()
  })
})
