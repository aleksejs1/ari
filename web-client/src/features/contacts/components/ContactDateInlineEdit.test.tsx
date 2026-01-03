/* eslint-disable import/order */
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach } from 'vitest'

import { ContactDateInlineEdit } from './ContactDateInlineEdit'
import { type ContactDate } from '@/types/models'

describe('ContactDateInlineEdit', () => {
  const mockDate: ContactDate = {
    '@id': '/api/contact_dates/1',
    '@type': 'ContactDate',
    date: '1990-01-01T00:00:00+00:00',
    text: 'Birthday',
  }

  const mockOnUpdate = vi.fn()
  const mockOnDelete = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders date and label correctly', () => {
    render(
      <ContactDateInlineEdit date={mockDate} onUpdate={mockOnUpdate} onDelete={mockOnDelete} />,
    )

    expect(screen.getByText(/1990/)).toBeInTheDocument()
    expect(screen.getByText('(Birthday)')).toBeInTheDocument()
  })

  it('shows edit button on hover and opens popover', async () => {
    render(
      <ContactDateInlineEdit date={mockDate} onUpdate={mockOnUpdate} onDelete={mockOnDelete} />,
    )

    const container = screen.getByText('(Birthday)').closest('div')
    if (!container) {
      throw new Error('Container not found')
    }
    fireEvent.mouseEnter(container)

    const editButton = screen.getByRole('button', { name: /edit/i })
    expect(editButton).toBeInTheDocument()

    await userEvent.click(editButton)

    // Inputs should be visible (in the popover)
    const dateInput = await screen.findByLabelText('contacts.date')
    const textInput = screen.getByLabelText('contacts.dateLabel')

    expect(dateInput).toBeInTheDocument()
    expect(dateInput).toHaveValue('01/01/1990')
    expect(textInput).toHaveValue('Birthday')
  })

  it('updates inputs and calls onUpdate', async () => {
    render(
      <ContactDateInlineEdit date={mockDate} onUpdate={mockOnUpdate} onDelete={mockOnDelete} />,
    )

    const container = screen.getByText('(Birthday)').closest('div')
    if (!container) {
      throw new Error('Container not found')
    }
    fireEvent.mouseEnter(container)
    await userEvent.click(screen.getByRole('button', { name: /edit/i }))

    const dateInput = await screen.findByLabelText('contacts.date')
    const textInput = screen.getByLabelText('contacts.dateLabel')

    // Use fireEvent.change which is reliable across environments
    fireEvent.change(dateInput, { target: { value: '05/05/2000' } })
    expect(dateInput).toHaveValue('05/05/2000')

    await userEvent.clear(textInput)
    await userEvent.type(textInput, 'Anniversary')

    const saveButton = screen.getByRole('button', { name: /save/i })
    await userEvent.click(saveButton)

    expect(mockOnUpdate).toHaveBeenCalledWith({
      ...mockDate,
      date: '2000-05-05T00:00:00+00:00',
      text: 'Anniversary',
    })
  })

  it('cancels edit mode', async () => {
    render(
      <ContactDateInlineEdit date={mockDate} onUpdate={mockOnUpdate} onDelete={mockOnDelete} />,
    )

    const container = screen.getByText('(Birthday)').closest('div')
    if (!container) {
      throw new Error('Container not found')
    }
    fireEvent.mouseEnter(container)
    await userEvent.click(screen.getByRole('button', { name: /edit/i }))

    const textInput = await screen.findByLabelText('contacts.dateLabel')
    await userEvent.type(textInput, 'Changed')

    const cancelButton = screen.getByRole('button', { name: /cancel/i })
    await userEvent.click(cancelButton)

    // Popover should close, inputs gone
    await waitFor(() => {
      expect(screen.queryByLabelText('contacts.dateLabel')).not.toBeInTheDocument()
    })

    expect(screen.getByText('(Birthday)')).toBeInTheDocument()
    expect(mockOnUpdate).not.toHaveBeenCalled()
  })

  it('shows delete confirmation and calls onDelete', async () => {
    render(
      <ContactDateInlineEdit date={mockDate} onUpdate={mockOnUpdate} onDelete={mockOnDelete} />,
    )

    const container = screen.getByText('(Birthday)').closest('div')
    if (!container) {
      throw new Error('Container not found')
    }
    fireEvent.mouseEnter(container)
    await userEvent.click(screen.getByRole('button', { name: /edit/i }))

    const deleteButton = await screen.findByRole('button', { name: /delete/i })
    await userEvent.click(deleteButton)

    expect(await screen.findByText('contacts.deleteConfirm')).toBeInTheDocument()

    const dialog = screen.getByRole('dialog')
    const confirmButton = await within(dialog).findByRole('button', { name: /delete/i })
    await userEvent.click(confirmButton)

    expect(mockOnDelete).toHaveBeenCalled()
  })

  it('renders correctly for empty date', async () => {
    const emptyDate: ContactDate = { ...mockDate, date: undefined, text: undefined }
    render(
      <ContactDateInlineEdit date={emptyDate} onUpdate={mockOnUpdate} onDelete={mockOnDelete} />,
    )

    const trigger = screen.queryByRole('button', { name: /add/i })
    expect(trigger).toBeInTheDocument()
  })
})
