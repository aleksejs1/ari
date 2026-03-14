import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import * as useUserPrefsHook from '@/hooks/useUserPrefs.hook'

import * as useNotificationPoliciesHook from '@/plugins/notifications/hooks/useNotificationPolicies'

import { GeneralSettings } from './GeneralSettings.component'

// Mock hooks
vi.mock('@/hooks/useUserPrefs.hook', () => ({
  useUserPrefs: vi.fn(),
}))

vi.mock('@/plugins/notifications/hooks/useNotificationPolicies', () => ({
  useNotificationPolicies: vi.fn(),
}))

vi.mock('@/lib/entitlements', () => ({
  useEntitlements: () => ({ data: undefined }),
}))

describe('GeneralSettings', () => {
  const mockSetLanguage = vi.fn()
  const mockSetTheme = vi.fn()

  const defaultPrefs = {
    language: 'en',
    dateFormat: 'mm/dd/yyyy',
    timeFormat: '24h',
    timezone: 'UTC',
    aiContextLocale: '',
    favouriteGroupName: 'My Contacts',
    googleSyncOnUpdate: '1',
    dashboardNotificationPolicy: '',
    contactTableSettings: '{}',
    dashboardSettings: '{}',
    showLogo: '1',
    theme: 'system' as const,
    setLanguage: mockSetLanguage,
    setDateFormat: vi.fn(),
    setTimeFormat: vi.fn(),
    setTimezone: vi.fn(),
    setAiContextLocale: vi.fn(),
    setFavouriteGroupName: vi.fn(),
    setGoogleSyncOnUpdate: vi.fn(),
    setDashboardNotificationPolicy: vi.fn(),
    setContactTableSettings: vi.fn(),
    setDashboardSettings: vi.fn(),
    setShowLogo: vi.fn(),
    setTheme: mockSetTheme,
    formatDate: vi.fn(),
    formatTime: vi.fn(),
    isLoading: false,
  }

  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(useNotificationPoliciesHook.useNotificationPolicies).mockReturnValue({
      data: [],
    } as any)
  })

  it('renders loading state', () => {
    vi.mocked(useUserPrefsHook.useUserPrefs).mockReturnValue({
      ...defaultPrefs,
      isLoading: true,
    })

    render(<GeneralSettings />)
    expect(screen.getByText('app.loading')).toBeInTheDocument()
  })

  it('renders settings items', () => {
    vi.mocked(useUserPrefsHook.useUserPrefs).mockReturnValue(defaultPrefs)

    render(<GeneralSettings />)
    expect(screen.getByText('settings.language')).toBeInTheDocument()
    expect(screen.getByText('settings.theme')).toBeInTheDocument()
    expect(screen.getByDisplayValue('My Contacts')).toBeInTheDocument()
  })

  it('calls setter when setting is changed', async () => {
    vi.mocked(useUserPrefsHook.useUserPrefs).mockReturnValue(defaultPrefs)

    render(<GeneralSettings />)

    // Find the language radio button for 'ru' and click it
    // Using getByLabelText to find the radio associated with the label "Русский"
    const ruOption = screen.getByLabelText('Русский')
    fireEvent.click(ruOption)

    expect(mockSetLanguage).toHaveBeenCalledWith('ru')
  })
})
