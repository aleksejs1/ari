import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'

import { ContactPhoneInlineEdit } from './ContactPhoneInlineEdit'

vi.mock('./TypeAutocomplete', () => ({
  TypeAutocomplete: ({
    value,
    onChange,
    ...props
  }: React.InputHTMLAttributes<HTMLInputElement>) => (
    <input value={value} onChange={onChange} {...props} data-testid="type-autocomplete" />
  ),
}))

describe('ContactPhoneInlineEdit', () => {
  const mockPhone = {
    '@id': '/api/phone_numbers/1',
    '@type': 'ContactPhoneNumber',
    value: '123-456-7890',
    type: 'Mobile',
  } as any
  const onUpdate = vi.fn()
  const onDelete = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders phone value and type', () => {
    render(<ContactPhoneInlineEdit phone={mockPhone} onUpdate={onUpdate} onDelete={onDelete} />)

    expect(screen.getByText('123-456-7890')).toBeInTheDocument()
    expect(screen.getByText('Mobile')).toBeInTheDocument()
  })

  it('opens popover and allows editing', async () => {
    const user = userEvent.setup()
    render(<ContactPhoneInlineEdit phone={mockPhone} onUpdate={onUpdate} onDelete={onDelete} />)

    // Click edit trigger (use role or text)
    await user.hover(screen.getByText('123-456-7890'))
    await user.click(screen.getByRole('button', { name: 'common.edit' }))

    const valueInput = await screen.findByLabelText('phone')
    const typeInput = screen.getByLabelText('phoneType')

    await user.clear(valueInput)
    await user.type(valueInput, '987-654-3210')

    await user.clear(typeInput)
    await user.type(typeInput, 'Work')

    await user.click(screen.getByRole('button', { name: 'common.save' }))

    expect(onUpdate).toHaveBeenCalledWith({
      ...mockPhone,
      value: '987-654-3210',
      type: 'Work',
    })
  })

  it('allows deleting', async () => {
    const user = userEvent.setup()
    render(<ContactPhoneInlineEdit phone={mockPhone} onUpdate={onUpdate} onDelete={onDelete} />)

    // Hover to show the button (optional in JSDOM but good practice)
    await user.hover(screen.getByText('123-456-7890'))

    // Click the edit button
    await user.click(screen.getByRole('button', { name: 'common.edit' }))

    await screen.findByLabelText('phone')

    const deleteBtn = await screen.findByRole('button', { name: 'Delete' })
    await user.click(deleteBtn)

    // Confirm dialog
    expect(await screen.findByText('deleteConfirm')).toBeVisible()
    await user.click(screen.getByRole('button', { name: 'delete' }))

    expect(onDelete).toHaveBeenCalled()
  })

  it('renders plus button when phone is empty', () => {
    render(
      <ContactPhoneInlineEdit
        phone={{ value: '', type: '', '@id': '', '@type': 'ContactPhoneNumber' } as any}
        onUpdate={onUpdate}
        onDelete={onDelete}
      />,
    )

    // InlineEditTrigger shows plus when !isExistent (hasPhone is false)
    expect(screen.queryByText('123-456-7890')).not.toBeInTheDocument()
    // It should show an add button
    expect(screen.getByRole('button', { name: /Add/i })).toBeInTheDocument()
  })
})
