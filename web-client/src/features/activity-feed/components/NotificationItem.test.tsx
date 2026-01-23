import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import type { ActivityFeed } from '@/types/models'

import { NotificationItem } from './NotificationItem'

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: { language: 'en' },
  }),
}))

describe('NotificationItem', () => {
  const onRead = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders unread notification', () => {
    const item: ActivityFeed = {
      '@id': '/api/activity_feeds/1',
      '@type': 'ActivityFeed',
      id: 1,
      title: 'Test Title',
      message: 'Test message',
      isRead: false,
      createdAt: new Date().toISOString(),
    }

    render(<NotificationItem item={item} onRead={onRead} />)

    expect(screen.getByText('Test Title')).toBeInTheDocument()
    expect(screen.getByText('Test message')).toBeInTheDocument()
    expect(screen.getByTitle('Unread')).toBeInTheDocument()
  })

  it('renders read notification', () => {
    const item: ActivityFeed = {
      '@id': '/api/activity_feeds/2',
      '@type': 'ActivityFeed',
      id: 2,
      title: 'Read Title',
      message: 'Read message',
      isRead: true,
      createdAt: new Date().toISOString(),
    }

    render(<NotificationItem item={item} onRead={onRead} />)

    expect(screen.getByText('Read Title')).toBeInTheDocument()
    expect(screen.queryByTitle('Unread')).not.toBeInTheDocument()
  })

  it('calls onRead when unread notification is clicked', () => {
    const item: ActivityFeed = {
      '@id': '/api/activity_feeds/3',
      '@type': 'ActivityFeed',
      id: 3,
      title: 'Unread Item',
      message: 'Click me',
      isRead: false,
      createdAt: new Date().toISOString(),
    }

    render(<NotificationItem item={item} onRead={onRead} />)

    fireEvent.click(screen.getByRole('button'))

    expect(onRead).toHaveBeenCalledWith(3)
  })

  it('does not call onRead when read notification is clicked', () => {
    const item: ActivityFeed = {
      '@id': '/api/activity_feeds/4',
      '@type': 'ActivityFeed',
      id: 4,
      title: 'Already Read',
      message: 'Already read message',
      isRead: true,
      createdAt: new Date().toISOString(),
    }

    render(<NotificationItem item={item} onRead={onRead} />)

    fireEvent.click(screen.getByRole('button'))

    expect(onRead).not.toHaveBeenCalled()
  })

  it('renders notification without createdAt', () => {
    const item: ActivityFeed = {
      '@id': '/api/activity_feeds/5',
      '@type': 'ActivityFeed',
      id: 5,
      title: 'No Date',
      message: 'No date message',
      isRead: false,
    }

    render(<NotificationItem item={item} onRead={onRead} />)

    expect(screen.getByText('No Date')).toBeInTheDocument()
  })
})
