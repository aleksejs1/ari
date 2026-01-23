import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { expect, test, vi } from 'vitest'

import { NotificationChannelForm } from './NotificationChannelForm'

test('submits successfully', async () => {
  const onSubmit = vi.fn()
  render(<NotificationChannelForm onSubmit={onSubmit} />)

  fireEvent.submit(screen.getByRole('form', { name: 'notification-channel-form' }))

  await waitFor(
    () => {
      expect(onSubmit).toHaveBeenCalled()
    },
    { timeout: 5000 },
  )
})

test('cleans up config on submit for email type', async () => {
  const onSubmit = vi.fn()
  render(
    <NotificationChannelForm
      onSubmit={onSubmit}
      defaultValues={{
        type: 'telegram', // Start as telegram to ensure we switch and clean
        config: { botToken: 'token', chatId: '123' },
      }}
    />,
  )

  // Switch to email
  fireEvent.change(screen.getByLabelText(/type/i), { target: { value: 'email' } })

  // Fill email
  fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } })

  fireEvent.submit(screen.getByRole('form', { name: 'notification-channel-form' }))

  await waitFor(() => {
    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'email',
        config: { email: 'test@example.com' }, // Should NOT have botToken or chatId
      }),
    )
  })
})
