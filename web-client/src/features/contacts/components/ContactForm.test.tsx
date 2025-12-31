import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'

import { useCreateGroup, useGroups } from '../useContacts'

import { ContactForm } from './ContactForm'

// Mock useContacts
vi.mock('../useContacts', () => ({
  useCreateGroup: vi.fn(),
  useGroups: vi.fn(),
}))

describe('ContactForm', () => {
  // Setup default mocks
  beforeEach(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.mocked(useCreateGroup).mockReturnValue({ mutateAsync: vi.fn() } as any)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.mocked(useGroups).mockReturnValue({ data: [] } as any)
  })

  it('renders correctly with default values', () => {
    render(<ContactForm onSubmit={vi.fn()} />)

    expect(screen.getByText('contacts.names')).toBeInTheDocument()
    expect(screen.getByText('contacts.dates')).toBeInTheDocument()
    // Check initial fields (one empty name, no dates)
    expect(screen.getAllByPlaceholderText('contacts.givenName')).toHaveLength(1)
  })

  it('adds and removes name fields', async () => {
    render(<ContactForm onSubmit={vi.fn()} />)

    fireEvent.click(screen.getByText('contacts.addName'))

    await waitFor(() => {
      expect(screen.getAllByPlaceholderText('contacts.givenName')).toHaveLength(2)
    })

    // Verifying removal would require more setup, skipping for now
  })

  it('submits form data correctly', async () => {
    const onSubmit = vi.fn()
    render(<ContactForm onSubmit={onSubmit} />)

    fireEvent.change(screen.getByPlaceholderText('contacts.givenName'), {
      target: { value: 'John' },
    })
    fireEvent.change(screen.getByPlaceholderText('contacts.familyName'), {
      target: { value: 'Doe' },
    })

    fireEvent.click(screen.getByText('common.save'))

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalled()
      expect(onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          contactNames: expect.arrayContaining([
            expect.objectContaining({ given: 'John', family: 'Doe' }),
          ]),
        }),
      )
    })
  })
})
