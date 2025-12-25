import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useCreateContact, useUpdateContact } from '../useContacts'

import { ContactSheet } from './ContactSheet'

import type { Contact } from '@/types/models'

// Mock Hooks
vi.mock('../useContacts', () => ({
  useCreateContact: vi.fn(),
  useUpdateContact: vi.fn(),
}))

// Mock Sub Components
vi.mock('./ContactForm', () => ({
  ContactForm: ({ onSubmit }: { onSubmit: (data: Partial<Contact>) => void }) => (
    <form
      data-testid="contact-form"
      onSubmit={(e) => {
        e.preventDefault()
        onSubmit({ contactNames: [{ '@id': '/api/cn/new', '@type': 'ContactName', given: 'New' }] }) // Mock submission data
      }}
    >
      <button type="submit">Submit</button>
    </form>
  ),
}))

describe('ContactSheet', () => {
  const mockCreateMutate = vi.fn()
  const mockUpdateMutate = vi.fn()

  beforeEach(() => {
    vi.mocked(useCreateContact).mockReturnValue({
      mutateAsync: mockCreateMutate,
      isPending: false,
    } as unknown as ReturnType<typeof useCreateContact>)

    vi.mocked(useUpdateContact).mockReturnValue({
      mutateAsync: mockUpdateMutate,
      isPending: false,
    } as unknown as ReturnType<typeof useUpdateContact>)
  })

  it('renders closed state', () => {
    render(<ContactSheet isOpen={false} onClose={vi.fn()} />)
    expect(screen.queryByTestId('contact-form')).not.toBeInTheDocument()
  })

  it('renders create mode correctly', () => {
    render(<ContactSheet isOpen={true} onClose={vi.fn()} />)
    expect(screen.getByText('contacts.create')).toBeInTheDocument()
    expect(screen.getByTestId('contact-form')).toBeInTheDocument()
  })

  it('renders edit mode correctly', () => {
    const contact: Contact = {
      '@id': '/api/contacts/1',
      '@type': 'Contact',
      contactNames: [{ '@id': '/api/cn/1', '@type': 'ContactName', given: 'John' }],
      contactDates: [],
    }
    render(<ContactSheet isOpen={true} onClose={vi.fn()} contact={contact} />)
    expect(screen.getByText('contacts.edit')).toBeInTheDocument()
  })

  it('handles create submission', async () => {
    const onClose = vi.fn()
    render(<ContactSheet isOpen={true} onClose={onClose} />)

    fireEvent.click(screen.getByText('Submit'))

    await waitFor(() => {
      expect(mockCreateMutate).toHaveBeenCalled()
      expect(onClose).toHaveBeenCalled()
    })
  })

  it('handles update submission', async () => {
    const onClose = vi.fn()
    const contact: Contact = {
      '@id': '/api/contacts/1',
      '@type': 'Contact',
      contactNames: [{ '@id': '/api/cn/1', '@type': 'ContactName', given: 'John' }],
      contactDates: [],
    }
    render(<ContactSheet isOpen={true} onClose={onClose} contact={contact} />)

    fireEvent.click(screen.getByText('Submit'))

    await waitFor(() => {
      expect(mockUpdateMutate).toHaveBeenCalled()
      expect(onClose).toHaveBeenCalled()
    })
  })
})
