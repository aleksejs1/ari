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

describe('ContactForm Addresses', () => {
  beforeEach(() => {
    vi.mocked(useCreateGroup).mockReturnValue({ mutateAsync: vi.fn() } as unknown as ReturnType<
      typeof useCreateGroup
    >)
    vi.mocked(useGroups).mockReturnValue({ data: [] } as unknown as ReturnType<typeof useGroups>)
  })

  it('adds and removes address fields', async () => {
    render(<ContactForm onSubmit={vi.fn()} />)

    fireEvent.click(screen.getByText('addresses'))

    await waitFor(() => {
      expect(screen.getAllByPlaceholderText('addressStreet')).toHaveLength(1)
    })

    fireEvent.change(screen.getByPlaceholderText('addressStreet'), {
      target: { value: '123 Main St' },
    })

    fireEvent.change(screen.getByPlaceholderText('addressCity'), {
      target: { value: 'New York' },
    })

    fireEvent.click(screen.getByText('addAddress'))

    await waitFor(() => {
      expect(screen.getAllByPlaceholderText('addressStreet')).toHaveLength(2)
    })
  })

  it('submits address data correctly', async () => {
    const onSubmit = vi.fn()
    render(<ContactForm onSubmit={onSubmit} />)

    fireEvent.change(screen.getByPlaceholderText('givenName'), {
      target: { value: 'John' },
    })

    fireEvent.click(screen.getByText('addresses'))

    await waitFor(() => {
      expect(screen.getByPlaceholderText('addressStreet')).toBeInTheDocument()
    })

    fireEvent.change(screen.getByPlaceholderText('addressStreet'), {
      target: { value: '123 Main St' },
    })
    fireEvent.change(screen.getByPlaceholderText('addressCity'), {
      target: { value: 'New York' },
    })
    fireEvent.change(screen.getByPlaceholderText('addressPostalCode'), {
      target: { value: '10001' },
    })
    fireEvent.change(screen.getByPlaceholderText('addressTypePlaceholder'), {
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
})
