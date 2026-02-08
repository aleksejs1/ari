import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { ReloadProvider, useReload } from '@/contexts/ReloadContext'

import { ReloadPrompt } from './ReloadPrompt'

// Mock i18n
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}))

// Mock window.location.reload
const originalLocation = window.location
const mockReload = vi.fn()

Object.defineProperty(window, 'location', {
  configurable: true,
  value: { ...originalLocation, reload: mockReload },
})

describe('ReloadPrompt', () => {
  const TestComponent = () => {
    const { setReloadNeeded } = useReload()
    return <button onClick={() => setReloadNeeded(true)}>Trigger Reload</button>
  }

  it('renders nothing by default', () => {
    render(
      <ReloadProvider>
        <ReloadPrompt />
      </ReloadProvider>,
    )
    expect(screen.queryByText('app.reloadRequired')).not.toBeInTheDocument()
  })

  it('renders prompt when reloadNeeded is true', () => {
    render(
      <ReloadProvider>
        <ReloadPrompt />
        <TestComponent />
      </ReloadProvider>,
    )

    fireEvent.click(screen.getByText('Trigger Reload'))

    expect(screen.getByText('app.reloadRequired')).toBeInTheDocument()
    expect(screen.getByText('app.reloadDescription')).toBeInTheDocument()
  })

  it('calls window.location.reload when reload button is clicked', () => {
    render(
      <ReloadProvider>
        <ReloadPrompt />
        <TestComponent />
      </ReloadProvider>,
    )

    fireEvent.click(screen.getByText('Trigger Reload'))
    fireEvent.click(screen.getByText('app.reload'))

    expect(mockReload).toHaveBeenCalled()
  })
})
