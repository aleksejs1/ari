import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useCreateGroup, useGroups } from '../useContacts'

import { ContactForm } from './ContactForm'

// Mock useContacts
vi.mock('../useContacts', () => ({
  useCreateGroup: vi.fn(),
  useGroups: vi.fn(),
  useUploadContactAvatar: vi.fn(() => ({ mutateAsync: vi.fn() })),
}))

vi.mock('@/hooks/useUserPrefs.hook', () => ({
  useUserPrefs: () => ({
    dateFormat: 'yyyy-MM-dd',
    formatDate: (date: Date | string) => String(date),
  }),
}))

describe('ContactForm Phone Numbers', () => {
  beforeEach(() => {
    vi.mocked(useCreateGroup).mockReturnValue({ mutateAsync: vi.fn() } as unknown as ReturnType<
      typeof useCreateGroup
    >)
    vi.mocked(useGroups).mockReturnValue({ data: [] } as unknown as ReturnType<typeof useGroups>)
  })

  it('adds and removes phone number fields', async () => {
    render(<ContactForm onSubmit={vi.fn()} />)

    // fireEvent.click(screen.getByText('contacts.addPhoneNumber'))

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

    // fireEvent.click(screen.getByText('contacts.addPhoneNumber'))

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
