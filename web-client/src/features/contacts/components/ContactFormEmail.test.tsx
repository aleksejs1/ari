import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'

import { useCreateGroup, useGroups } from '../useContacts'

import { ContactForm } from './ContactForm'

// Mock useContacts
vi.mock('../useContacts', () => ({
  useCreateGroup: vi.fn(),
  useGroups: vi.fn(),
}))

vi.mock('@/hooks/useUserPrefs.hook', () => ({
  useUserPrefs: () => ({
    dateFormat: 'yyyy-MM-dd',
    formatDate: (date: Date | string) => String(date),
  }),
}))

describe('ContactForm Email Addresses', () => {
  beforeEach(() => {
    vi.mocked(useCreateGroup).mockReturnValue({ mutateAsync: vi.fn() } as unknown as ReturnType<
      typeof useCreateGroup
    >)
    vi.mocked(useGroups).mockReturnValue({ data: [] } as unknown as ReturnType<typeof useGroups>)
  })

  it('adds and removes email address fields', async () => {
    render(<ContactForm onSubmit={vi.fn()} />)

    // fireEvent.click(screen.getByText('contacts.addEmailAddress'))

    await waitFor(() => {
      expect(screen.getAllByPlaceholderText('contacts.emailAddress')).toHaveLength(1)
    })

    fireEvent.change(screen.getByPlaceholderText('contacts.emailAddress'), {
      target: { value: 'test@example.com' },
    })

    fireEvent.change(screen.getByPlaceholderText('contacts.emailTypePlaceholder'), {
      target: { value: 'Work' },
    })

    fireEvent.click(screen.getByText('contacts.addEmailAddress'))

    await waitFor(() => {
      expect(screen.getAllByPlaceholderText('contacts.emailAddress')).toHaveLength(2)
    })
  })

  it('submits email address data correctly', async () => {
    const onSubmit = vi.fn()
    render(<ContactForm onSubmit={onSubmit} />)

    fireEvent.change(screen.getByPlaceholderText('contacts.givenName'), {
      target: { value: 'John' },
    })

    // fireEvent.click(screen.getByText('contacts.addEmailAddress'))

    await waitFor(() => {
      expect(screen.getByPlaceholderText('contacts.emailAddress')).toBeInTheDocument()
    })

    fireEvent.change(screen.getByPlaceholderText('contacts.emailAddress'), {
      target: { value: 'john.doe@example.com' },
    })
    fireEvent.change(screen.getByPlaceholderText('contacts.emailTypePlaceholder'), {
      target: { value: 'Personal' },
    })

    fireEvent.click(screen.getByText('common.save'))

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalled()
      expect(onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          contactEmailAdresses: expect.arrayContaining([
            expect.objectContaining({ value: 'john.doe@example.com', type: 'Personal' }),
          ]),
        }),
      )
    })
  })

  it('validates email format', async () => {
    render(<ContactForm onSubmit={vi.fn()} />)

    // fireEvent.click(screen.getByText('contacts.addEmailAddress'))

    await waitFor(() => {
      expect(screen.getByPlaceholderText('contacts.emailAddress')).toBeInTheDocument()
    })

    fireEvent.change(screen.getByPlaceholderText('contacts.emailAddress'), {
      target: { value: 'invalid-email' },
    })

    fireEvent.click(screen.getByText('common.save'))

    await waitFor(() => {
      expect(screen.getByText('validation.invalidEmail')).toBeInTheDocument()
    })
  })
})
