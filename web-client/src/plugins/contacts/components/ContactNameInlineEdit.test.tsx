/* eslint-disable import/order */
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react'
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
    if (!container) {
      throw new Error('Container not found')
    }
    fireEvent.mouseEnter(container)

    // Trigger button (Edit Name)
    const editButton = screen.getByRole('button', { name: /edit/i })
    expect(editButton).toBeInTheDocument()

    await userEvent.click(editButton)

    // Wait for popover content
    const givenInput = await screen.findByDisplayValue('John')
    const familyInput = screen.getByDisplayValue('Doe')

    expect(givenInput).toBeInTheDocument()
    expect(familyInput).toBeInTheDocument()
  })

  it('updates inputs and calls onUpdate', async () => {
    render(
      <ContactNameInlineEdit name={mockName} onUpdate={mockOnUpdate} onDelete={mockOnDelete} />,
    )

    const container = screen.getByText('John Doe').closest('div')
    if (!container) {
      throw new Error('Container not found')
    }
    fireEvent.mouseEnter(container)

    await userEvent.click(screen.getByRole('button', { name: /edit/i }))

    const givenInput = await screen.findByDisplayValue('John')
    const familyInput = screen.getByDisplayValue('Doe')

    await userEvent.clear(givenInput)
    await userEvent.type(givenInput, 'Jane')

    await userEvent.clear(familyInput)
    await userEvent.type(familyInput, 'Smith')

    const saveButton = screen.getByRole('button', { name: /save/i })

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
    if (!container) {
      throw new Error('Container not found')
    }
    fireEvent.mouseEnter(container)

    await userEvent.click(screen.getByRole('button', { name: /edit/i }))

    const givenInput = await screen.findByDisplayValue('John')
    await userEvent.type(givenInput, 'Jane')

    const cancelButton = screen.getByRole('button', { name: /cancel/i })

    await userEvent.click(cancelButton)

    // Wait for popover to close
    await waitFor(() => {
      expect(screen.queryByDisplayValue('John')).not.toBeInTheDocument()
    })

    expect(screen.getByText('John Doe')).toBeInTheDocument()
    expect(mockOnUpdate).not.toHaveBeenCalled()
  })

  it('shows delete confirmation and calls onDelete', async () => {
    render(
      <ContactNameInlineEdit name={mockName} onUpdate={mockOnUpdate} onDelete={mockOnDelete} />,
    )

    const container = screen.getByText('John Doe').closest('div')
    if (!container) {
      throw new Error('Container not found')
    }
    fireEvent.mouseEnter(container)

    await userEvent.click(screen.getByRole('button', { name: /edit/i }))

    const deleteButton = await screen.findByRole('button', { name: /delete/i })

    await userEvent.click(deleteButton)

    // Modal should be open
    expect(await screen.findByText('contacts.deleteConfirm')).toBeInTheDocument()

    // Confirm delete inside modal
    // Note: There might be multiple "Delete" strings/buttons.
    // The dialog usually has a specific structure.
    // Try to find the Confirm button specifically.
    // Often Dialog actions are buttons.
    const dialog = screen.getByRole('dialog')
    const confirmButton = await within(dialog).findByRole('button', { name: /delete/i })

    await userEvent.click(confirmButton)

    expect(mockOnDelete).toHaveBeenCalled()
  })
})
