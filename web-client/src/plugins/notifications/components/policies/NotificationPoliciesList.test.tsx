import { MemoryRouter } from 'react-router-dom'
import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import * as hooks from '../../hooks/useNotificationPolicies'

import NotificationPoliciesList from './NotificationPoliciesList'

vi.mock('../../hooks/useNotificationPolicies', () => ({
  useNotificationPolicies: vi.fn(),
  useDeleteNotificationPolicy: vi.fn(),
}))

vi.mock('@/plugins/contacts/useContacts', () => ({
  useContacts: vi.fn(() => ({ data: undefined, isLoading: false })),
  getHydraMember: (data: any) => data?.member || [],
}))

vi.mock('@/plugins/groups/hooks/useGroups', () => ({
  useGroups: vi.fn(() => ({ data: undefined, isLoading: false })),
}))

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<Record<string, unknown>>('react-router-dom')
  return {
    ...actual,
    Link: ({ children, to }: { children: React.ReactNode; to: string }) => (
      <div>
        <a href={to}>LinkTo:{to}</a>
        {children}
      </div>
    ),
  }
})

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, defaultValue?: string) => defaultValue || key,
  }),
}))

describe('NotificationPoliciesList', () => {
  const mockPolicies = [
    {
      id: 1,
      '@id': '/api/notification_policies/1',
      name: 'Birthday Policy',
      targets: { type: 'all', ids: [] },
      eventTypes: ['Birthday'],
      schedule: [{ offsetDays: 0, time: '09:00', channels: [] }],
    },
    {
      id: 2,
      '@id': '/api/notification_policies/2',
      name: 'Anniversary Policy',
      targets: { type: 'group', ids: ['/api/groups/1'] },
      eventTypes: ['Anniversary'],
      schedule: [{ offsetDays: 1, time: '10:00', channels: [] }],
    },
  ]

  beforeEach(() => {
    vi.mocked(hooks.useNotificationPolicies).mockReturnValue({
      data: mockPolicies,
      isLoading: false,
    } as any)
    vi.mocked(hooks.useDeleteNotificationPolicy).mockReturnValue({
      mutate: vi.fn(),
    } as any)
  })

  it('renders list of policies', () => {
    render(
      <MemoryRouter>
        <NotificationPoliciesList />
      </MemoryRouter>,
    )
    expect(screen.getByText('Birthday Policy')).toBeInTheDocument()
    expect(screen.getByText('Birthday')).toBeInTheDocument()
    expect(screen.getByText('Anniversary')).toBeInTheDocument()
    // "all" is now "Types.all" translation or "all" default, in mock it's empty string or key
    // The component uses t(`notification_policies.types.${type}`, type)
    // The mock t returns defaultValue or key.
    // So "all" -> "All" (if default was All) -> current mock t returns key if no default.
    // Wait, let's check current mock t: (key, def) => def || key.
    expect(screen.getByText('Type')).toBeInTheDocument() // The type label for 'all'
    // For anniversary policy, firstId is /api/groups/1
    expect(screen.getByText('/api/groups/1')).toBeInTheDocument()
  })

  it('renders loading state', () => {
    vi.mocked(hooks.useNotificationPolicies).mockReturnValue({
      data: undefined,
      isLoading: true,
    } as any)
    render(
      <MemoryRouter>
        <NotificationPoliciesList />
      </MemoryRouter>,
    )
    expect(screen.getByText('common.loading')).toBeInTheDocument()
  })

  it('renders no data state', () => {
    vi.mocked(hooks.useNotificationPolicies).mockReturnValue({
      data: [],
      isLoading: false,
    } as any)
    render(
      <MemoryRouter>
        <NotificationPoliciesList />
      </MemoryRouter>,
    )
    expect(screen.getByText('No policies found')).toBeInTheDocument()
  })
})
