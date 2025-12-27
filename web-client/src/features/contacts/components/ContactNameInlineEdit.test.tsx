/* eslint-disable import/order */
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach } from 'vitest'

import { ContactNameInlineEdit } from './ContactNameInlineEdit'
import { type ContactName } from '@/types/models'

describe('ContactNameInlineEdit', () => {
  const mockName: ContactName = {
    '@id': '/api/contact_names/1',
    '@type': 'ContactName',
    given: 'John',
    family: 'Doe',
  }

  const mockOnUpdate = vi.fn()
  const mockOnDelete = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders name correctly', () => {
    render(
      <ContactNameInlineEdit name={mockName} onUpdate={mockOnUpdate} onDelete={mockOnDelete} />,
    )

    expect(screen.getByText('John Doe')).toBeInTheDocument()
  })

  it('shows edit button on hover and switches to edit mode', async () => {
    render(
      <ContactNameInlineEdit name={mockName} onUpdate={mockOnUpdate} onDelete={mockOnDelete} />,
    )

    const container = screen.getByText('John Doe').closest('div')
    if (!container) throw new Error('Container not found')
    fireEvent.mouseEnter(container)

    const editButton = screen.getByRole('button')
    expect(editButton).toBeInTheDocument()

    await userEvent.click(editButton)

    expect(screen.getByDisplayValue('John')).toBeInTheDocument()
    expect(screen.getByDisplayValue('Doe')).toBeInTheDocument()
  })

  it('updates inputs and calls onUpdate', async () => {
    render(
      <ContactNameInlineEdit name={mockName} onUpdate={mockOnUpdate} onDelete={mockOnDelete} />,
    )

    const container = screen.getByText('John Doe').closest('div')
    if (!container) throw new Error('Container not found')
    fireEvent.mouseEnter(container)
    await userEvent.click(screen.getByRole('button'))

    const givenInput = screen.getByDisplayValue('John')
    const familyInput = screen.getByDisplayValue('Doe')

    await userEvent.clear(givenInput)
    await userEvent.type(givenInput, 'Jane')

    await userEvent.clear(familyInput)
    await userEvent.type(familyInput, 'Smith')

    // Find save button (check icon)
    const saveButton = screen.getByLabelText('Save')

    await userEvent.click(saveButton)

    expect(mockOnUpdate).toHaveBeenCalledWith({
      ...mockName,
      given: 'Jane',
      family: 'Smith',
    })
  })

  it('cancels edit mode', async () => {
    render(
      <ContactNameInlineEdit name={mockName} onUpdate={mockOnUpdate} onDelete={mockOnDelete} />,
    )

    const container = screen.getByText('John Doe').closest('div')
    if (!container) throw new Error('Container not found')
    fireEvent.mouseEnter(container)
    await userEvent.click(screen.getByRole('button'))

    const givenInput = screen.getByDisplayValue('John')
    await userEvent.type(givenInput, 'Jane')

    const cancelButton = screen.getByLabelText('Cancel')

    await userEvent.click(cancelButton)

    expect(screen.getByText('John Doe')).toBeInTheDocument()
    expect(mockOnUpdate).not.toHaveBeenCalled()
  })

  it('shows delete confirmation and calls onDelete', async () => {
    render(
      <ContactNameInlineEdit name={mockName} onUpdate={mockOnUpdate} onDelete={mockOnDelete} />,
    )

    const container = screen.getByText('John Doe').closest('div')
    if (!container) throw new Error('Container not found')
    fireEvent.mouseEnter(container)
    await userEvent.click(screen.getByRole('button'))

    const deleteButton = screen.getByLabelText('Delete')

    await userEvent.click(deleteButton)

    // Modal should be open
    expect(screen.getByText('contacts.deleteConfirm')).toBeInTheDocument()

    // Confirm delete
    const confirmButton = screen.getAllByText('contacts.delete')[1] // 1st is title, 2nd is button
    await userEvent.click(confirmButton)

    expect(mockOnDelete).toHaveBeenCalled()
  })
})
