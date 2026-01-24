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

describe('ContactForm Email Addresses', () => {
  beforeEach(() => {
    vi.mocked(useCreateGroup).mockReturnValue({ mutateAsync: vi.fn() } as unknown as ReturnType<
      typeof useCreateGroup
    >)
    vi.mocked(useGroups).mockReturnValue({ data: [] } as unknown as ReturnType<typeof useGroups>)
  })

  it('adds and removes email address fields', async () => {
    render(<ContactForm onSubmit={vi.fn()} />)

    // fireEvent.click(screen.getByText('addEmailAddress'))

    await waitFor(() => {
      expect(screen.getAllByPlaceholderText('emailAddress')).toHaveLength(1)
    })

    fireEvent.change(screen.getByPlaceholderText('emailAddress'), {
      target: { value: 'test@example.com' },
    })

    fireEvent.change(screen.getByPlaceholderText('emailTypePlaceholder'), {
      target: { value: 'Work' },
    })

    fireEvent.click(screen.getByText('addEmailAddress'))

    await waitFor(() => {
      expect(screen.getAllByPlaceholderText('emailAddress')).toHaveLength(2)
    })
  })

  it('submits email address data correctly', async () => {
    const onSubmit = vi.fn()
    render(<ContactForm onSubmit={onSubmit} />)

    fireEvent.change(screen.getByPlaceholderText('givenName'), {
      target: { value: 'John' },
    })

    // fireEvent.click(screen.getByText('addEmailAddress'))

    await waitFor(() => {
      expect(screen.getByPlaceholderText('emailAddress')).toBeInTheDocument()
    })

    fireEvent.change(screen.getByPlaceholderText('emailAddress'), {
      target: { value: 'john.doe@example.com' },
    })
    fireEvent.change(screen.getByPlaceholderText('emailTypePlaceholder'), {
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

    // fireEvent.click(screen.getByText('addEmailAddress'))

    await waitFor(() => {
      expect(screen.getByPlaceholderText('emailAddress')).toBeInTheDocument()
    })

    fireEvent.change(screen.getByPlaceholderText('emailAddress'), {
      target: { value: 'invalid-email' },
    })

    fireEvent.click(screen.getByText('common.save'))

    await waitFor(() => {
      expect(screen.getByText('validation.invalidEmail')).toBeInTheDocument()
    })
  })
})
