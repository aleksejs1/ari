import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'

import { ContactEmailInlineEdit } from './ContactEmailInlineEdit'

// Mock ResizeObserver for Radix UI Popover
;(window as any).ResizeObserver = class ResizeObserver {
  observe() {
    // mock
  }
  unobserve() {
    // mock
  }
  disconnect() {
    // mock
  }
}

describe('ContactEmailInlineEdit', () => {
  const mockEmail = {
    '@id': '/api/emails/1',
    '@type': 'ContactEmailAdress',
    value: 'test@example.com',
    type: 'Work',
  } as any
  const onUpdate = vi.fn()
  const onDelete = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders email value and type', () => {
    render(<ContactEmailInlineEdit email={mockEmail} onUpdate={onUpdate} onDelete={onDelete} />)

    expect(screen.getByText('test@example.com')).toBeInTheDocument()
    expect(screen.getByText('Work')).toBeInTheDocument()
  })

  it('opens popover and allows editing', async () => {
    const user = userEvent.setup()
    render(<ContactEmailInlineEdit email={mockEmail} onUpdate={onUpdate} onDelete={onDelete} />)

    // Click edit trigger (use role or text)
    await user.hover(screen.getByText('test@example.com'))
    await user.click(screen.getByRole('button', { name: 'common.edit' }))

    const valueInput = await screen.findByLabelText('email')
    const typeInput = screen.getByLabelText('emailType')

    await user.clear(valueInput)
    await user.type(valueInput, 'new@example.com')

    await user.clear(typeInput)
    await user.type(typeInput, 'Personal')

    await user.click(screen.getByRole('button', { name: 'common.save' }))

    expect(onUpdate).toHaveBeenCalledWith({
      ...mockEmail,
      value: 'new@example.com',
      type: 'Personal',
    })
  })

  it('allows deleting', async () => {
    const user = userEvent.setup()
    render(<ContactEmailInlineEdit email={mockEmail} onUpdate={onUpdate} onDelete={onDelete} />)

    // Hover to show the button (optional in JSDOM but good practice)
    await user.hover(screen.getByText('test@example.com'))

    // Click the edit button
    await user.click(screen.getByRole('button', { name: 'common.edit' }))

    await screen.findByLabelText('email')

    const deleteBtn = await screen.findByRole('button', { name: 'Delete' })
    await user.click(deleteBtn)

    // Confirm dialog
    expect(await screen.findByText('deleteConfirm')).toBeVisible()
    await user.click(screen.getByRole('button', { name: 'delete' }))

    expect(onDelete).toHaveBeenCalled()
  })

  it('renders plus button when email is empty', () => {
    render(
      <ContactEmailInlineEdit
        email={{ value: '', type: '', '@id': '', '@type': 'ContactEmailAdress' } as any}
        onUpdate={onUpdate}
        onDelete={onDelete}
      />,
    )

    // InlineEditTrigger shows plus when !isExistent (hasEmail is false)
    expect(screen.queryByText('test@example.com')).not.toBeInTheDocument()
    // It should show an add button
    expect(screen.getByRole('button', { name: /Add/i })).toBeInTheDocument()
  })
})
