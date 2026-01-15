import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'

import SettingsPage from './Settings'

import { useExportContacts, useImportContacts } from '@/features/contacts/useContacts'
import { useNotificationPolicies } from '@/features/notification-policies/useNotificationPolicies'
import { useUserPrefs } from '@/hooks/useUserPrefs.hook'

// Mock the hook
vi.mock('@/hooks/useUserPrefs.hook', async () => {
  const actual = await vi.importActual('@/hooks/useUserPrefs.hook')
  return {
    ...actual,
    useUserPrefs: vi.fn(),
  }
})

// Mock useExportContacts
vi.mock('@/features/contacts/useContacts', () => ({
  useExportContacts: vi.fn(),
  useImportContacts: vi.fn(),
}))

// Mock useNotificationPolicies
vi.mock('@/features/notification-policies/useNotificationPolicies', () => ({
  useNotificationPolicies: vi.fn(),
}))

// Mock translation
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const map: Record<string, string> = {
        'settings.title': 'Settings',
        'settings.language': 'Language',
        'settings.languageDescription': 'Select your preferred language.',
        'settings.dateFormat': 'Date Format',
        'settings.dateFormatDescription': 'Select how dates should be displayed.',
        'settings.exportData': 'Export Data',
        'settings.exportDataDescription': 'Download all your contacts and data in XML format.',
        'settings.importData': 'Import Data',
        'settings.importDataDescription': 'Upload an XML file to import contacts.',
        'settings.dashboardNotificationPolicy': 'Dashboard Notification Policy',
        'settings.dashboardNotificationPolicyDescription':
          'Select the default notification policy for the dashboard.',
        'common.none': 'None',
        'app.loading': 'Loading...',
      }
      return map[key] || key
    },
  }),
}))

describe('SettingsPage', () => {
  const setLanguage = vi.fn()
  const setDateFormat = vi.fn()
  const setDashboardNotificationPolicy = vi.fn()
  const exportContacts = vi.fn()
  const importContacts = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    ;(useUserPrefs as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      isLoading: false,
      language: 'en',
      dateFormat: 'mm/dd/yyyy',
      timeFormat: '24h',
      favouriteGroupName: 'favourites',
      googleSyncOnUpdate: '0',
      setLanguage,
      setDateFormat,
      setTimeFormat: vi.fn(),
      setFavouriteGroupName: vi.fn(),
      setGoogleSyncOnUpdate: vi.fn(),
      setDashboardNotificationPolicy,
      dashboardNotificationPolicy: '',
    })
    ;(useExportContacts as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      mutate: exportContacts,
      isPending: false,
    })
    ;(useImportContacts as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      mutate: importContacts,
      isPending: false,
    })
    ;(useNotificationPolicies as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      data: [
        { id: 1, name: 'Policy 1' },
        { id: 2, name: 'Policy 2' },
      ],
    })
  })

  it('renders loading state', () => {
    ;(useUserPrefs as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      isLoading: true,
    })
    render(<SettingsPage />)
    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })

  it('renders settings when loaded', () => {
    render(<SettingsPage />)
    expect(screen.getByText('Settings')).toBeInTheDocument()
    expect(screen.getByText('Language')).toBeInTheDocument()
    expect(screen.getByText('Date Format')).toBeInTheDocument()

    // Checking radio buttons
    const enRadio = screen.getByLabelText('English')
    expect(enRadio).toBeChecked()

    const dateRadio = screen.getByLabelText('MM/DD/YYYY (12/31/2024)')
    expect(dateRadio).toBeChecked()
  })

  it('calls setLanguage when language changes', async () => {
    render(<SettingsPage />)

    const ruRadio = screen.getByLabelText('Русский')
    fireEvent.click(ruRadio)

    await waitFor(() => {
      expect(setLanguage).toHaveBeenCalledWith('ru')
    })
  })

  it('calls setDateFormat when format changes', async () => {
    render(<SettingsPage />)

    const euRadio = screen.getByLabelText('DD.MM.YYYY (31.12.2024)')
    fireEvent.click(euRadio)

    await waitFor(() => {
      expect(setDateFormat).toHaveBeenCalledWith('dd.mm.yyyy')
    })
  })

  it('calls exportContacts when export button is clicked', async () => {
    render(<SettingsPage />)

    const exportButton = screen.getByRole('button', { name: 'Export Data' })
    fireEvent.click(exportButton)

    expect(exportContacts).toHaveBeenCalled()
  })

  it('disables export button when exporting', () => {
    ;(useExportContacts as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      mutate: exportContacts,
      isPending: true,
    })

    render(<SettingsPage />)

    const exportButton = screen.getByRole('button', { name: /loading/i })
    expect(exportButton).toBeDisabled()
  })

  it('calls importContacts when file is selected', async () => {
    render(<SettingsPage />)

    const file = new File(['(⌐□_□)'], 'contacts.xml', { type: 'application/xml' })
    const input = document.querySelector('input[type="file"]') as HTMLInputElement

    if (input) {
      fireEvent.change(input, { target: { files: [file] } })
    }

    expect(importContacts).toHaveBeenCalled()
    // Verify the arguments passed to importContacts (it's called with the file)
    expect(importContacts).toHaveBeenCalledWith(file, expect.any(Object))
  })

  it('disables import button when importing', () => {
    ;(useImportContacts as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      mutate: importContacts,
      isPending: true,
    })

    render(<SettingsPage />)

    const importButton = screen.getByRole('button', { name: /loading/i })
    expect(importButton).toBeDisabled()
  })

  it('renders dashboard notification policy settings', () => {
    render(<SettingsPage />)
    expect(screen.getByText('Dashboard Notification Policy')).toBeInTheDocument()
    expect(
      screen.getByText('Select the default notification policy for the dashboard.'),
    ).toBeInTheDocument()
    expect(screen.getByRole('combobox')).toBeInTheDocument()
    expect(screen.getByText('None')).toBeInTheDocument()
    expect(screen.getByText('Policy 1')).toBeInTheDocument()
    expect(screen.getByText('Policy 2')).toBeInTheDocument()
  })

  it('calls setDashboardNotificationPolicy when policy changes', () => {
    render(<SettingsPage />)

    const select = screen.getByRole('combobox')
    fireEvent.change(select, { target: { value: '1' } })

    expect(setDashboardNotificationPolicy).toHaveBeenCalledWith('1')
  })
})
