import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'

import { useCreateGroup, useGroups } from '../useContacts'

import { ContactForm } from './ContactForm'

// Mock useContacts
vi.mock('../useContacts', () => ({
  useCreateGroup: vi.fn(),
  useGroups: vi.fn(),
}))

describe('ContactForm Phone Numbers', () => {
  beforeEach(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.mocked(useCreateGroup).mockReturnValue({ mutateAsync: vi.fn() } as any)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.mocked(useGroups).mockReturnValue({ data: [] } as any)
  })

  it('adds and removes phone number fields', async () => {
    render(<ContactForm onSubmit={vi.fn()} />)

    fireEvent.click(screen.getByText('contacts.addPhoneNumber'))

    await waitFor(() => {
      expect(screen.getAllByPlaceholderText('contacts.phoneNumber')).toHaveLength(1)
    })

    fireEvent.change(screen.getByPlaceholderText('contacts.phoneNumber'), {
      target: { value: '+123456789' },
    })

    fireEvent.change(screen.getByPlaceholderText('contacts.phoneTypePlaceholder'), {
      target: { value: 'Work' },
    })

    fireEvent.click(screen.getByText('contacts.addPhoneNumber'))

    await waitFor(() => {
      expect(screen.getAllByPlaceholderText('contacts.phoneNumber')).toHaveLength(2)
    })
  })

  it('submits phone number data correctly', async () => {
    const onSubmit = vi.fn()
    render(<ContactForm onSubmit={onSubmit} />)

    fireEvent.change(screen.getByPlaceholderText('contacts.givenName'), {
      target: { value: 'John' },
    })

    fireEvent.click(screen.getByText('contacts.addPhoneNumber'))

    await waitFor(() => {
      expect(screen.getByPlaceholderText('contacts.phoneNumber')).toBeInTheDocument()
    })

    fireEvent.change(screen.getByPlaceholderText('contacts.phoneNumber'), {
      target: { value: '+123456789' },
    })
    fireEvent.change(screen.getByPlaceholderText('contacts.phoneTypePlaceholder'), {
      target: { value: 'Work' },
    })

    fireEvent.click(screen.getByText('common.save'))

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalled()
      expect(onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          phoneNumbers: expect.arrayContaining([
            expect.objectContaining({ value: '+123456789', type: 'Work' }),
          ]),
        }),
      )
    })
  })
})
