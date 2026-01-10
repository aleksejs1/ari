import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect, vi, beforeEach } from 'vitest'

import NotificationPolicyForm from './NotificationPolicyForm'

// Mock matchMedia
window.matchMedia =
  window.matchMedia ||
  (() => ({
    matches: false,
    addListener: () => { },
    removeListener: () => { },
  }))

// Mock ResizeObserver
window.ResizeObserver = class ResizeObserver {
  observe() {
    // mock
  }
  unobserve() {
    // mock
  }
  disconnect() {
    // mock
  }
} as any

vi.mock('../useNotificationPolicies', () => ({
  useNotificationPolicy: vi.fn(() => ({ data: undefined, isLoading: false })),
  useCreateNotificationPolicy: vi.fn(() => ({
    mutate: vi.fn(),
    mutateAsync: vi.fn().mockResolvedValue({}),
  })),
  useUpdateNotificationPolicy: vi.fn(() => ({
    mutate: vi.fn(),
    mutateAsync: vi.fn().mockResolvedValue({}),
  })),
  useNotificationPolicyEventTypes: vi.fn(() => ({
    data: [],
    isLoading: false,
  })),
}))

vi.mock('../../notification-channels/useNotificationChannels', () => ({
  useNotificationChannels: vi.fn(() => ({
    data: { member: [] },
    isLoading: false,
  })),
}))

vi.mock('../../groups/useGroups', () => ({
  useGroups: vi.fn(() => ({
    data: [],
    isLoading: false,
  })),
}))

vi.mock('../../contacts/useContacts', async () => {
  const actual = await vi.importActual('../../contacts/useContacts')
  return {
    ...actual,
    useContacts: vi.fn(() => ({
      data: { member: [], totalItems: 0, view: { '@id': 'view' } },
      isLoading: false,
    })),
  }
})

vi.mock('@/hooks/useUserPrefs.hook', () => ({
  useUserPrefs: vi.fn(() => ({
    formatDate: (date: Date | string) => {
      if (!date) {
        return ''
      }
      if (typeof date === 'string') {
        return date
      }
      return date.toLocaleDateString()
    },
    formatTime: (date: Date | string) => {
      if (!date) {
        return ''
      }
      if (typeof date === 'string') {
        return date
      }
      return date.toLocaleTimeString()
    },
    dateFormat: 'dd.MM.yyyy',
    timeFormat: '24h',
  })),
}))

// Mock react-router-dom
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useParams: () => ({}),
    useNavigate: () => vi.fn(),
  }
})

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, optionsOrValue?: unknown) => {
      if (typeof optionsOrValue === 'string') {
        return optionsOrValue
      }
      return key
    },
  }),
}))

describe('NotificationPolicyForm', () => {
  // Removed beforeEach mocks as they are handled in factory
  beforeEach(() => {
    vi.clearAllMocks()
  })

  // ...

  it('renders form fields', () => {
    // Render with MemoryRouter
    render(
      <MemoryRouter initialEntries={['/policies/new']}>
        <NotificationPolicyForm />
      </MemoryRouter>,
    )
    expect(screen.getByText('Create Notification Policy')).toBeInTheDocument()
    expect(screen.getByText('Name')).toBeInTheDocument()
    expect(screen.getByText('Targets')).toBeInTheDocument()
    expect(screen.getByText('Type')).toBeInTheDocument()
    expect(screen.getByText('Event Types')).toBeInTheDocument()
    expect(screen.getByText('Schedule')).toBeInTheDocument()
  })

  it('validates required fields', async () => {
    render(
      <MemoryRouter initialEntries={['/policies/new']}>
        <NotificationPolicyForm />
      </MemoryRouter>,
    )
    fireEvent.click(screen.getByRole('button', { name: 'Create' }))
    // Validation might not show immediately if default values are validish or empty
    // But channels are required min(1)
    await waitFor(() => {
      expect(
        screen.getByText('at least one channel must be selected', { exact: false }),
      ).toBeInTheDocument()
    })
  })
})
