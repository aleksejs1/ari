import { MemoryRouter } from 'react-router-dom'
import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import * as useUserPrefsHook from '@/hooks/useUserPrefs.hook'

import * as useContactsHook from '@/plugins/contacts/useContacts'
import * as useGroupsHook from '@/plugins/groups/hooks/useGroups'

import * as useNotificationPoliciesHook from '../hooks/useNotificationPolicies'

import NotificationPoliciesPage from './NotificationPoliciesPage'

// Mock hooks
vi.mock('../hooks/useNotificationPolicies', () => ({
  useNotificationPolicies: vi.fn(),
  useDeleteNotificationPolicy: vi.fn(),
}))

vi.mock('@/plugins/contacts/useContacts', () => ({
  useContacts: vi.fn(),
  getHydraMember: (data: any) => data?.member || [],
}))

vi.mock('@/plugins/groups/hooks/useGroups', () => ({
  useGroups: vi.fn(),
}))

vi.mock('@/hooks/useUserPrefs.hook', () => ({
  useUserPrefs: vi.fn(),
}))

describe('NotificationPoliciesPage', () => {
  const mockFormatTime = vi.fn((t) => t)

  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(useUserPrefsHook.useUserPrefs).mockReturnValue({
      formatTime: mockFormatTime,
    } as any)
    vi.mocked(useContactsHook.useContacts).mockReturnValue({
      data: undefined,
      isLoading: false,
    } as any)
    vi.mocked(useGroupsHook.useGroups).mockReturnValue({ data: undefined, isLoading: false } as any)
  })

  it('renders loading state', () => {
    vi.mocked(useNotificationPoliciesHook.useNotificationPolicies).mockReturnValue({
      data: undefined,
      isLoading: true,
      error: null,
    } as any)

    render(<NotificationPoliciesPage />, { wrapper: MemoryRouter })
    expect(screen.getByText('common.loading')).toBeInTheDocument()
  })

  it('renders empty list', () => {
    vi.mocked(useNotificationPoliciesHook.useNotificationPolicies).mockReturnValue({
      data: [],
      isLoading: false,
      error: null,
    } as any)

    render(<NotificationPoliciesPage />, { wrapper: MemoryRouter })
    expect(screen.getByText('common.no_data')).toBeInTheDocument()
  })

  it('renders policies list', () => {
    const mockPolicies = [
      {
        id: 1,
        name: 'My Policy',
        targets: { type: 'all' },
        eventTypes: ['create'],
        schedule: [{ offsetDays: 1, time: '10:00' }],
      },
    ]

    vi.mocked(useNotificationPoliciesHook.useNotificationPolicies).mockReturnValue({
      data: mockPolicies,
      isLoading: false,
      error: null,
    } as any)

    render(<NotificationPoliciesPage />, { wrapper: MemoryRouter })

    expect(screen.getByText('My Policy')).toBeInTheDocument()
    // Check type translation key or value if translation is identity in mock (default)
    // The component uses t(`...Types.${type}`)
    // If we rely on identity mock, it might produce "notification_policies.types.all" or similar.
    // However, real component might render badges etc.
    // Let's check for 'My Policy' at least.
  })

  it('calls delete mutation on confirm', () => {
    const mockDelete = vi.fn()
    vi.mocked(useNotificationPoliciesHook.useDeleteNotificationPolicy).mockReturnValue({
      mutate: mockDelete,
    } as any)

    vi.spyOn(window, 'confirm').mockReturnValue(true)

    const mockPolicies = [
      {
        id: 1,
        name: 'My Policy',
        targets: { type: 'all' },
      },
    ]

    vi.mocked(useNotificationPoliciesHook.useNotificationPolicies).mockReturnValue({
      data: mockPolicies,
      isLoading: false,
      error: null,
    } as any)

    render(<NotificationPoliciesPage />, { wrapper: MemoryRouter })

    // const deleteBtn = screen.getAllByRole('button')[2]
    // A bit fragile, let's find by icon presence or class if possible.
    // But simplified test is okay for now.
    // Better:
    // const rows = screen.getAllByRole('row')
    // const deleteBtn = within(rows[1]).getByRole('button', { name: '' }) // if only icons

    // In our component: <Button variant="ghost" size="icon" className="text-destructive"> <Trash2... /> </Button>
    // It has no accessible name.

    // Let's simply click the LAST button which is likely delete in this single row scenario
    const buttons = screen.getAllByRole('button')
    const lastButton = buttons[buttons.length - 1]

    fireEvent.click(lastButton)

    expect(window.confirm).toHaveBeenCalled()
    expect(mockDelete).toHaveBeenCalledWith(1)
  })
})
