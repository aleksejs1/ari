import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { expect, test, vi } from 'vitest'

import { NotificationChannelForm } from './NotificationChannelForm'

// Mock useTranslation
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, defaultValue?: string) => defaultValue ?? key,
  }),
}))

test('submits successfully', async () => {
  const onSubmit = vi.fn()
  render(<NotificationChannelForm onSubmit={onSubmit} />)

  fireEvent.change(screen.getByLabelText(/bot token/i), { target: { value: 'tok' } })
  fireEvent.change(screen.getByLabelText(/chat id/i), { target: { value: '123' } })

  fireEvent.submit(screen.getByRole('form'))

  await waitFor(
    () => {
      expect(onSubmit).toHaveBeenCalled()
    },
    { timeout: 5000 },
  )
})

test('shows validation errors', async () => {
  const onSubmit = vi.fn()
  render(<NotificationChannelForm onSubmit={onSubmit} />)

  fireEvent.submit(screen.getByRole('form'))

  await waitFor(() => {
    expect(screen.getByText('Bot Token is required')).toBeInTheDocument()
    expect(onSubmit).not.toHaveBeenCalled()
  })
})
