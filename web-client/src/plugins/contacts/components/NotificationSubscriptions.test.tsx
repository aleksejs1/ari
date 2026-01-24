import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { api } from '@/lib/axios'

import { NotificationSubscriptions } from './NotificationSubscriptions'

// Mock useContacts
vi.mock('../useContacts', () => ({
  useCreateGroup: vi.fn(),
  useGroups: vi.fn(),
  useUploadContactAvatar: vi.fn(),
}))

// Mock api
vi.mock('@/lib/axios', () => ({
  api: {
    get: vi.fn(),
    post: vi.fn(),
    delete: vi.fn(),
  },
}))

// Mock translations
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}))

describe('NotificationSubscriptions', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders loading state initially', async () => {
    // Mock pending promise to keep loading state
    vi.mocked(api.get).mockImplementation(
      () =>
        new Promise(() => {
          /* pending */
        }),
    )

    render(<NotificationSubscriptions entityType="contact" entityId={1} />)
    expect(screen.getByText('app.loading')).toBeInTheDocument()
  })

  it('renders subscriptions and channels after loading', async () => {
    vi.mocked(api.get).mockImplementation((url) => {
      if (url === '/notification_subscriptions') {
        return Promise.resolve({ data: { member: [{ id: 1, channel: '/api/channels/1' }] } })
      }
      if (url === '/notification_channels') {
        return Promise.resolve({ data: { member: [{ '@id': '/api/channels/1', type: 'email' }] } })
      }
      return Promise.reject(new Error('Unknown url'))
    })

    render(<NotificationSubscriptions entityType="contact" entityId={1} />)

    await waitFor(() => {
      expect(screen.queryByText('app.loading')).not.toBeInTheDocument()
    })

    expect(screen.getByText('subscriptions')).toBeInTheDocument()
    expect(screen.getByText('addSubscription (email)')).toBeInTheDocument()
    // Check for subscription
    // "ID: 1 (email)"
    expect(
      screen.getByText((content) => content.includes('ID: 1') && content.includes('(email)')),
    ).toBeInTheDocument()
  })

  it('adds a subscription', async () => {
    vi.mocked(api.get).mockImplementation((url) => {
      if (url === '/notification_subscriptions') {
        return Promise.resolve({ data: { member: [] } })
      }
      if (url === '/notification_channels') {
        return Promise.resolve({ data: { member: [{ '@id': '/api/channels/1', type: 'email' }] } })
      }
      return Promise.reject(new Error('Unknown url'))
    })

    vi.mocked(api.post).mockResolvedValue({})

    render(<NotificationSubscriptions entityType="contact" entityId={1} />)

    await waitFor(() => {
      expect(screen.getByText('addSubscription (email)')).toBeInTheDocument()
    })

    fireEvent.click(screen.getByText('addSubscription (email)'))

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith(
        '/notification_subscriptions',
        expect.objectContaining({
          entityType: 'contact',
          entityId: 1,
          channel: '/api/channels/1',
        }),
      )
    })
  })

  it('removes a subscription', async () => {
    vi.mocked(api.get).mockImplementation((url) => {
      if (url === '/notification_subscriptions') {
        return Promise.resolve({ data: { member: [{ id: 123, channel: '/api/channels/1' }] } })
      }
      if (url === '/notification_channels') {
        return Promise.resolve({ data: { member: [{ '@id': '/api/channels/1', type: 'email' }] } })
      }
      return Promise.reject(new Error('Unknown url'))
    })

    vi.mocked(api.delete).mockResolvedValue({})

    render(<NotificationSubscriptions entityType="contact" entityId={1} />)

    await waitFor(() => {
      expect(screen.getByText((content) => content.includes('ID: 123'))).toBeInTheDocument()
    })

    // Find delete button
    // It's the only button inside the subscription list item
    // But also there is "Add Subscription" button.
    // We can find by trash icon but we don't render icon.
    // Actually we import Trash2 from lucide-react, which renders SVG.
    // Finding strictly via role 'button' with no name might work if we filter.
    // Or cleaner: fire event on the button that contains the trash icon?
    // Let's just getAllByRole('button') and skip the first one (Add)? No, "Add" is dynamic.
    // The delete button is in the same row as ID: 123.

    // Finally find button
    const deleteButton = screen
      .getAllByRole('button')
      .find((btn) => btn.querySelector('[data-testid="icon-Trash2"]'))

    // Check it exists but don't assign if unused, or use it
    expect(deleteButton).toBeDefined()
    // Or simpler, just click elements with role button inside the list

    // Since we know the structure, let's use a query selector or more robust finding.
    // The button has a visually hidden text? No.
    // But it has `variant="ghost"`.

    // Let's assume it's the 2nd button (1st is Add email)
    const buttons = screen.getAllByRole('button')
    // We have 1 channel -> 1 add button.
    // We have 1 sub -> 1 delete button.
    // Order: Add buttons are first, then subs.
    const deleteBtn = buttons[buttons.length - 1]

    fireEvent.click(deleteBtn)

    await waitFor(() => {
      expect(api.delete).toHaveBeenCalledWith('/notification_subscriptions/123')
    })
  })
})
