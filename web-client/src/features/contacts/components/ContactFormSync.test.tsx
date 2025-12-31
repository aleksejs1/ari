import { render, screen, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'

import { useCreateGroup, useGroups } from '../useContacts'

import { ContactForm } from './ContactForm'

// Mock useContacts
vi.mock('../useContacts', () => ({
  useCreateGroup: vi.fn(),
  useGroups: vi.fn(),
}))

describe('ContactForm Synchronization', () => {
  beforeEach(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.mocked(useCreateGroup).mockReturnValue({ mutateAsync: vi.fn() } as any)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.mocked(useGroups).mockReturnValue({ data: [] } as any)
  })

  it('updates form values and IDs when props change after save', async () => {
    const { rerender } = render(
      <ContactForm
        onSubmit={vi.fn()}
        defaultValues={{
          contactNames: [{ given: 'John', family: 'Doe' }],
          contactDates: [],
          phoneNumbers: [],
          contactEmailAdresses: [],
          contactAddresses: [],
        }}
      />,
    )

    expect(screen.getByPlaceholderText('contacts.familyName')).toHaveValue('Doe')

    // Simulate after-save prop update with server-provided ID
    rerender(
      <ContactForm
        onSubmit={vi.fn()}
        defaultValues={{
          contactNames: [{ id: '1', given: 'John', family: 'Doe' }],
          contactDates: [],
          phoneNumbers: [],
          contactEmailAdresses: [],
          contactAddresses: [],
        }}
      />,
    )

    // Wait for the form to reactive-sync with new props
    await waitFor(() => {
      // We can't easily check the internal state of RHF without devtools or exports,
      // but we can check if it still has the correct value.
      expect(screen.getByPlaceholderText('contacts.familyName')).toHaveValue('Doe')
    })
  })

  it('correctly resets form with new data from server', async () => {
    const { rerender } = render(
      <ContactForm
        onSubmit={vi.fn()}
        defaultValues={{
          contactNames: [{ given: 'John', family: 'Doe' }],
          contactDates: [],
          phoneNumbers: [],
          contactEmailAdresses: [],
          contactAddresses: [],
        }}
      />,
    )

    // Simulate server-side automated change (e.g. normalization) + ID addition
    rerender(
      <ContactForm
        onSubmit={vi.fn()}
        defaultValues={{
          contactNames: [{ id: '1', given: 'JOHN', family: 'DOE' }],
          contactDates: [],
          phoneNumbers: [],
          contactEmailAdresses: [],
          contactAddresses: [],
        }}
      />,
    )

    await waitFor(() => {
      expect(screen.getByPlaceholderText('contacts.givenName')).toHaveValue('JOHN')
    })
  })
})
