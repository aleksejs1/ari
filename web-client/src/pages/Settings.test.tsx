import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'

import SettingsPage from './Settings'

import { useUserPrefs } from '@/hooks/useUserPrefs'

// Mock the hook
vi.mock('@/hooks/useUserPrefs', async () => {
  const actual = await vi.importActual('@/hooks/useUserPrefs')
  return {
    ...actual,
    useUserPrefs: vi.fn(),
  }
})

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
        'app.loading': 'Loading...',
      }
      return map[key] || key
    },
  }),
}))

describe('SettingsPage', () => {
  it('renders loading state', () => {
    ;(useUserPrefs as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      isLoading: true,
    })
    render(<SettingsPage />)
    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })

  it('renders settings when loaded', () => {
    const setLanguage = vi.fn()
    const setDateFormat = vi.fn()
    ;(useUserPrefs as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      isLoading: false,
      language: 'en',
      dateFormat: 'mm/dd/yyyy',
      setLanguage,
      setDateFormat,
    })

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
    const setLanguage = vi.fn()
    const setDateFormat = vi.fn()
    ;(useUserPrefs as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      isLoading: false,
      language: 'en',
      dateFormat: 'mm/dd/yyyy',
      setLanguage,
      setDateFormat,
    })

    render(<SettingsPage />)

    const ruRadio = screen.getByLabelText('Русский')
    fireEvent.click(ruRadio)

    await waitFor(() => {
      expect(setLanguage).toHaveBeenCalledWith('ru')
    })
  })

  it('calls setDateFormat when format changes', async () => {
    const setLanguage = vi.fn()
    const setDateFormat = vi.fn()
    ;(useUserPrefs as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      isLoading: false,
      language: 'en',
      dateFormat: 'mm/dd/yyyy',
      setLanguage,
      setDateFormat,
    })

    render(<SettingsPage />)

    const euRadio = screen.getByLabelText('DD.MM.YYYY (31.12.2024)')
    fireEvent.click(euRadio)

    await waitFor(() => {
      expect(setDateFormat).toHaveBeenCalledWith('dd.mm.yyyy')
    })
  })
})
