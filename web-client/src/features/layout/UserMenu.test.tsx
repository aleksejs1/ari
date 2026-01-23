import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect, vi, beforeEach } from 'vitest'

import { UserMenu } from './UserMenu'

import { useAuth } from '@/hooks/useAuth'
import { AuditLogsPlugin } from '@/plugins/audit-logs'

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

const mockUser = {
  id: 1,
  uuid: 'user-1-uuid',
}

const mockLogout = vi.fn()

vi.mock('@/hooks/useAuth', () => ({
  useAuth: vi.fn(() => ({
    logout: mockLogout,
    user: mockUser,
  })),
}))

describe('UserMenu', () => {
  beforeEach(() => {
    vi.mocked(useAuth).mockReturnValue({
      user: mockUser,
      logout: mockLogout,
    } as unknown as ReturnType<typeof useAuth>)
    new AuditLogsPlugin().register()
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

    expect(await screen.findByText('user-1-uuid')).toBeInTheDocument()
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
