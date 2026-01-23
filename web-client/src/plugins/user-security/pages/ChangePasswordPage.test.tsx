import { MemoryRouter } from 'react-router-dom'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import * as useChangePasswordHook from '../hooks/useChangePassword'

import ChangePasswordPage from './ChangePasswordPage'

vi.mock('../hooks/useChangePassword', () => ({
  useChangePassword: vi.fn(),
}))

describe('ChangePasswordPage', () => {
  const mockMutate = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(useChangePasswordHook.useChangePassword).mockReturnValue({
      mutate: mockMutate,
      isPending: false,
    } as any)
  })

  it('renders form fields', () => {
    const { container } = render(<ChangePasswordPage />, { wrapper: MemoryRouter })
    expect(screen.getByText('settings.changePassword')).toBeInTheDocument()
    // Select by name to avoid LabelText ambiguity
    expect(container.querySelector('input[name="currentPassword"]')).toBeInTheDocument()
    expect(container.querySelector('input[name="password"]')).toBeInTheDocument()
    expect(container.querySelector('input[name="confirmPassword"]')).toBeInTheDocument()
  })

  it('validates mismatched passwords', async () => {
    const { container } = render(<ChangePasswordPage />, { wrapper: MemoryRouter })

    const currentPasswordInput = container.querySelector(
      'input[name="currentPassword"]',
    ) as HTMLInputElement
    const passwordInput = container.querySelector('input[name="password"]') as HTMLInputElement
    const confirmPasswordInput = container.querySelector(
      'input[name="confirmPassword"]',
    ) as HTMLInputElement

    fireEvent.change(currentPasswordInput, { target: { value: 'testCurrentPassword' } })
    fireEvent.change(passwordInput, { target: { value: 'testNewPassword' } })
    fireEvent.change(confirmPasswordInput, { target: { value: 'mismatchedPassword' } })

    const submitBtn = screen.getByRole('button', { name: /settings.updatePassword/i })
    fireEvent.click(submitBtn)

    await waitFor(() => {
      // Logic from source: message set via zod refine
      expect(screen.getByText('auth.passwordsDontMatch')).toBeInTheDocument()
    })
    expect(mockMutate).not.toHaveBeenCalled()
  })

  it('submits form with valid data', async () => {
    const { container } = render(<ChangePasswordPage />, { wrapper: MemoryRouter })

    const currentPasswordInput = container.querySelector(
      'input[name="currentPassword"]',
    ) as HTMLInputElement
    const passwordInput = container.querySelector('input[name="password"]') as HTMLInputElement
    const confirmPasswordInput = container.querySelector(
      'input[name="confirmPassword"]',
    ) as HTMLInputElement

    fireEvent.change(currentPasswordInput, { target: { value: 'testCurrentPassword' } })
    fireEvent.change(passwordInput, { target: { value: 'testNewPassword' } })
    fireEvent.change(confirmPasswordInput, { target: { value: 'testNewPassword' } })

    const submitBtn = screen.getByRole('button', { name: /settings.updatePassword/i })
    fireEvent.click(submitBtn)

    await waitFor(() => {
      expect(mockMutate).toHaveBeenCalledWith(
        // eslint-disable-next-line sonarjs/no-hardcoded-passwords
        { currentPassword: 'testCurrentPassword', newPassword: 'testNewPassword' },
        expect.any(Object),
      )
    })
  })
})
