import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'

import { ContactForm } from './ContactForm'

describe('ContactForm Addresses', () => {
  it('adds and removes address fields', async () => {
    render(<ContactForm onSubmit={vi.fn()} />)

    fireEvent.click(screen.getByText('contacts.addAddress'))

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

    fireEvent.click(screen.getByText('contacts.addAddress'))

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
        expect.anything(),
      )
    })
  })

  it('validates mandatory address fields', async () => {
    render(<ContactForm onSubmit={vi.fn()} />)

    fireEvent.click(screen.getByText('contacts.addAddress'))

    await waitFor(() => {
      expect(screen.getByPlaceholderText('contacts.addressTypePlaceholder')).toBeInTheDocument()
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
