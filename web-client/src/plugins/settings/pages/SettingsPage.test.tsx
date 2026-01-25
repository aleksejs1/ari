import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useSettingsTabs } from '@/lib/settings/SettingsRegistry'
import { SettingTab } from '@/lib/settings/SettingTab'

import SettingsPage from './SettingsPage'

// Mock components
const MockGeneralSettings = () => <div>Mock General Components</div>
const MockOtherSettings = () => <div>Mock Other Components</div>

class MockTab extends SettingTab {
  private component: React.ComponentType

  constructor(id: string, name: string, component: React.ComponentType) {
    super(id, name)
    this.component = component
  }
  get Component() {
    return this.component
  }
}

// Mock translations
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}))

// Let's mock the hook completely for this test file
vi.mock('@/lib/settings/SettingsRegistry', async () => {
  const actual = await vi.importActual<Record<string, unknown>>('@/lib/settings/SettingsRegistry')
  return {
    ...actual,
    useSettingsTabs: vi.fn(),
  }
})

describe('SettingsPage Component', () => {
  const mockTabs = [
    new MockTab('general', 'General', MockGeneralSettings),
    new MockTab('advanced', 'Advanced', MockOtherSettings),
  ]

  beforeEach(() => {
    vi.mocked(useSettingsTabs).mockReturnValue(mockTabs)
  })

  it('renders sidebar with tabs', () => {
    render(<SettingsPage />)
    expect(screen.getByText('General')).toBeInTheDocument()
    expect(screen.getByText('Advanced')).toBeInTheDocument()
  })

  it('renders first tab by default', () => {
    render(<SettingsPage />)
    expect(screen.getByText('Mock General Components')).toBeInTheDocument()
    expect(screen.queryByText('Mock Other Components')).not.toBeInTheDocument()
  })

  it('switches tabs on click', () => {
    render(<SettingsPage />)

    fireEvent.click(screen.getByText('Advanced'))

    expect(screen.getByText('Mock Other Components')).toBeInTheDocument()
    expect(screen.queryByText('Mock General Components')).not.toBeInTheDocument()
  })

  it('handles empty tabs', () => {
    vi.mocked(useSettingsTabs).mockReturnValue([])
    render(<SettingsPage />)
    expect(screen.getByText('No settings active.')).toBeInTheDocument()
  })
})
