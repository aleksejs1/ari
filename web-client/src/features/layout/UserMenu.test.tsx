import { MemoryRouter } from 'react-router-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { useAuth } from '@/hooks/useAuth'

import { UserMenu } from './UserMenu'

// Mock useAuth
vi.mock('@/hooks/useAuth', () => ({
  useAuth: vi.fn(),
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

// ...

describe('UserMenu', () => {
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

    expect(await screen.findByText('auth.logout')).toBeInTheDocument()
  })

  it('calls logout when logout button is clicked', async () => {
    const user = userEvent.setup()
    render(
      <MemoryRouter>
        <UserMenu />
      </MemoryRouter>,
    )

    await user.click(screen.getByRole('button', { name: /open user menu/i }))
    await user.click(await screen.findByText('auth.logout'))

    expect(mockLogout).toHaveBeenCalled()
  })
})
