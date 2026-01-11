import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { expect, test, vi } from 'vitest'

import { NotificationChannelForm } from './NotificationChannelForm'

test('submits successfully', async () => {
  const onSubmit = vi.fn()
  render(<NotificationChannelForm onSubmit={onSubmit} />)

  fireEvent.submit(screen.getByRole('form'))

  await waitFor(
    () => {
      expect(onSubmit).toHaveBeenCalled()
    },
    { timeout: 5000 },
  )
})
