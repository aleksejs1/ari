import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import * as useFeaturePrefsContext from '@/contexts/FeaturePrefsContext'
import * as useRegionalPrefsContext from '@/contexts/RegionalPrefsContext'
import * as useUIPrefsContext from '@/contexts/UIPrefsContext'

import * as useNotificationPoliciesHook from '@/plugins/notifications/hooks/useNotificationPolicies'

import { GeneralSettings } from './GeneralSettings.component'

// Mock hooks
vi.mock('@/contexts/RegionalPrefsContext', () => ({
  useRegionalPrefs: vi.fn(),
}))

vi.mock('@/contexts/UIPrefsContext', () => ({
  useUIPrefs: vi.fn(),
}))

vi.mock('@/contexts/FeaturePrefsContext', () => ({
  useFeaturePrefs: vi.fn(),
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

  const defaultRegionalPrefs = {
    language: 'en',
    dateFormat: 'mm/dd/yyyy',
    timeFormat: '24h',
    timezone: 'UTC',
    setLanguage: mockSetLanguage,
    setDateFormat: vi.fn(),
    setTimeFormat: vi.fn(),
    setTimezone: vi.fn(),
    formatDate: vi.fn(),
    formatTime: vi.fn(),
  }

  const defaultUIPrefs = {
    contactTableSettings: '{}',
    dashboardSettings: '{}',
    showLogo: '1',
    theme: 'system' as const,
    setContactTableSettings: vi.fn(),
    setDashboardSettings: vi.fn(),
    setShowLogo: vi.fn(),
    setTheme: mockSetTheme,
    isLoading: false,
  }

  const defaultFeaturePrefs = {
    aiContextLocale: '',
    favouriteGroupName: 'My Contacts',
    googleSyncOnUpdate: '1',
    dashboardNotificationPolicy: '',
    setAiContextLocale: vi.fn(),
    setFavouriteGroupName: vi.fn(),
    setGoogleSyncOnUpdate: vi.fn(),
    setDashboardNotificationPolicy: vi.fn(),
  }

  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(useNotificationPoliciesHook.useNotificationPolicies).mockReturnValue({
      data: [],
    } as any)
  })

  it('renders loading state', () => {
    vi.mocked(useRegionalPrefsContext.useRegionalPrefs).mockReturnValue(defaultRegionalPrefs as any)
    vi.mocked(useUIPrefsContext.useUIPrefs).mockReturnValue({
      ...defaultUIPrefs,
      isLoading: true,
    } as any)
    vi.mocked(useFeaturePrefsContext.useFeaturePrefs).mockReturnValue(defaultFeaturePrefs as any)

    render(<GeneralSettings />)
    expect(screen.getByText('app.loading')).toBeInTheDocument()
  })

  it('renders settings items', () => {
    vi.mocked(useRegionalPrefsContext.useRegionalPrefs).mockReturnValue(defaultRegionalPrefs as any)
    vi.mocked(useUIPrefsContext.useUIPrefs).mockReturnValue(defaultUIPrefs as any)
    vi.mocked(useFeaturePrefsContext.useFeaturePrefs).mockReturnValue(defaultFeaturePrefs as any)

    render(<GeneralSettings />)
    expect(screen.getByText('settings.language')).toBeInTheDocument()
    expect(screen.getByText('settings.theme')).toBeInTheDocument()
    expect(screen.getByDisplayValue('My Contacts')).toBeInTheDocument()
  })

  it('calls setter when setting is changed', async () => {
    vi.mocked(useRegionalPrefsContext.useRegionalPrefs).mockReturnValue(defaultRegionalPrefs as any)
    vi.mocked(useUIPrefsContext.useUIPrefs).mockReturnValue(defaultUIPrefs as any)
    vi.mocked(useFeaturePrefsContext.useFeaturePrefs).mockReturnValue(defaultFeaturePrefs as any)

    render(<GeneralSettings />)

    // Find the language radio button for 'ru' and click it
    // Using getByLabelText to find the radio associated with the label "Русский"
    const ruOption = screen.getByLabelText('Русский')
    fireEvent.click(ruOption)

    expect(mockSetLanguage).toHaveBeenCalledWith('ru')
  })
})
