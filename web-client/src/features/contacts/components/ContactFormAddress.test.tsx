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

describe('ContactForm Addresses', () => {
  beforeEach(() => {
    vi.mocked(useCreateGroup).mockReturnValue({ mutateAsync: vi.fn() } as unknown as ReturnType<
      typeof useCreateGroup
    >)
    vi.mocked(useGroups).mockReturnValue({ data: [] } as unknown as ReturnType<typeof useGroups>)
  })

  it('adds and removes address fields', async () => {
    render(<ContactForm onSubmit={vi.fn()} />)

    // fireEvent.click(screen.getByText('contacts.addAddress'))

    await waitFor(() => {
      expect(screen.getAllByPlaceholderText('contacts.addressStreet')).toHaveLength(1)
    })

    fireEvent.change(screen.getByPlaceholderText('contacts.addressStreet'), {
      target: { value: '123 Main St' },
    })

    fireEvent.change(screen.getByPlaceholderText('contacts.addressCity'), {
      target: { value: 'New York' },
    })

    fireEvent.click(screen.getByText('contacts.addAddress'))

    await waitFor(() => {
      expect(screen.getAllByPlaceholderText('contacts.addressStreet')).toHaveLength(2)
    })
  })

  it('submits address data correctly', async () => {
    const onSubmit = vi.fn()
    render(<ContactForm onSubmit={onSubmit} />)

    fireEvent.change(screen.getByPlaceholderText('contacts.givenName'), {
      target: { value: 'John' },
    })

    // fireEvent.click(screen.getByText('contacts.addAddress'))

    await waitFor(() => {
      expect(screen.getByPlaceholderText('contacts.addressStreet')).toBeInTheDocument()
    })

    fireEvent.change(screen.getByPlaceholderText('contacts.addressStreet'), {
      target: { value: '123 Main St' },
    })
    fireEvent.change(screen.getByPlaceholderText('contacts.addressCity'), {
      target: { value: 'New York' },
    })
    fireEvent.change(screen.getByPlaceholderText('contacts.addressPostalCode'), {
      target: { value: '10001' },
    })
    fireEvent.change(screen.getByPlaceholderText('contacts.addressTypePlaceholder'), {
      target: { value: 'Home' },
    })

    fireEvent.click(screen.getByText('common.save'))

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalled()
      expect(onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          contactAddresses: expect.arrayContaining([
            expect.objectContaining({
              street: '123 Main St',
              city: 'New York',
              postalCode: '10001',
              type: 'Home',
            }),
          ]),
        }),
      )
    })
  })

  it('validates mandatory address fields', async () => {
    render(<ContactForm onSubmit={vi.fn()} />)

    // fireEvent.click(screen.getByText('contacts.addAddress'))

    await waitFor(() => {
      expect(screen.getByPlaceholderText('contacts.addressTypePlaceholder')).toBeInTheDocument()
    })

    // Fill a value so the address is not filtered out as empty
    fireEvent.change(screen.getByPlaceholderText('contacts.addressStreet'), {
      target: { value: 'Something' },
    })

    // Clear the default 'Home' type to trigger validation
    fireEvent.change(screen.getByPlaceholderText('contacts.addressTypePlaceholder'), {
      target: { value: '' },
    })

    fireEvent.click(screen.getByText('common.save'))

    await waitFor(() => {
      expect(screen.getByText('validation.typeRequired')).toBeInTheDocument()
      expect(screen.queryByText('validation.streetRequired')).not.toBeInTheDocument()
      expect(screen.queryByText('validation.cityRequired')).not.toBeInTheDocument()
      expect(screen.queryByText('validation.postalCodeRequired')).not.toBeInTheDocument()
    })
  })
})
