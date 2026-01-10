import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect, vi, beforeEach } from 'vitest'

import { UserMenu } from './UserMenu'

import { useAuth } from '@/hooks/useAuth'

// Mock useAuth
vi.mock('@/hooks/useAuth', () => ({
  useAuth: vi.fn(),
}))

// Mock translations
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, defaultValue?: string) => defaultValue || key,
  }),
}))

// Mock ResizeObserver for Radix UI
class ResizeObserverMock {
  observe() {
    // do nothing
  }
  unobserve() {
    // do nothing
  }
  disconnect() {
    // do nothing
  }
}
global.ResizeObserver = ResizeObserverMock

describe('UserMenu', () => {
  const mockLogout = vi.fn()
  const mockUser = {
    username: 'testuser',
    email: 'test@example.com',
    uuid: '123-456',
  }

  beforeEach(() => {
    vi.mocked(useAuth).mockReturnValue({
      user: mockUser,
      logout: mockLogout,
    } as unknown as ReturnType<typeof useAuth>)
  })

  it('renders user menu trigger', () => {
    render(
      <MemoryRouter>
        <UserMenu />
      </MemoryRouter>,
    )
    expect(screen.getByRole('button', { name: /open user menu/i })).toBeInTheDocument()
  })

  it('displays user information when opened', async () => {
    const user = userEvent.setup()
    render(
      <MemoryRouter>
        <UserMenu />
      </MemoryRouter>,
    )

    await user.click(screen.getByRole('button', { name: /open user menu/i }))

    expect(await screen.findByText('testuser')).toBeInTheDocument()
    expect(await screen.findByText('test@example.com')).toBeInTheDocument()
  })

  it('displays menu items', async () => {
    const user = userEvent.setup()
    render(
      <MemoryRouter>
        <UserMenu />
      </MemoryRouter>,
    )

    await user.click(screen.getByRole('button', { name: /open user menu/i }))

    expect(await screen.findByText('Audit Logs')).toBeInTheDocument()
    expect(await screen.findByText('Manage Groups')).toBeInTheDocument()
    expect(await screen.findByText('Notification Channels')).toBeInTheDocument()
    expect(await screen.findByText('Notification Policies')).toBeInTheDocument()
    expect(await screen.findByText('Google Import')).toBeInTheDocument()
    expect(await screen.findByText('Settings')).toBeInTheDocument()
    expect(await screen.findByText('Logout')).toBeInTheDocument()
  })

  it('calls logout when logout button is clicked', async () => {
    const user = userEvent.setup()
    render(
      <MemoryRouter>
        <UserMenu />
      </MemoryRouter>,
    )

    await user.click(screen.getByRole('button', { name: /open user menu/i }))
    await user.click(await screen.findByText('Logout'))

    expect(mockLogout).toHaveBeenCalled()
  })
})
