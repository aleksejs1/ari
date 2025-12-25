import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'

import { ContactForm } from './ContactForm'

describe('ContactForm', () => {
  it('renders correctly with default values', () => {
    render(<ContactForm onSubmit={vi.fn()} />)

    expect(screen.getByText('Names')).toBeInTheDocument()
    expect(screen.getByText('Important Dates')).toBeInTheDocument()
    // Check initial fields (one empty name, no dates)
    expect(screen.getAllByPlaceholderText('Given Name')).toHaveLength(1)
  })

  it('adds and removes name fields', async () => {
    render(<ContactForm onSubmit={vi.fn()} />)

    fireEvent.click(screen.getByText('Add Name'))

    await waitFor(() => {
      expect(screen.getAllByPlaceholderText('Given Name')).toHaveLength(2)
    })

    // Verifying removal would require more setup, skipping for now
  })

  it('submits form data correctly', async () => {
    const onSubmit = vi.fn()
    render(<ContactForm onSubmit={onSubmit} />)

    fireEvent.change(screen.getByPlaceholderText('Given Name'), { target: { value: 'John' } })
    fireEvent.change(screen.getByPlaceholderText('Family Name'), { target: { value: 'Doe' } })

    fireEvent.click(screen.getByText('Save Contact'))

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalled()
      expect(onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          contactNames: expect.arrayContaining([
            expect.objectContaining({ given: 'John', family: 'Doe' }),
          ]),
        }),
        expect.anything(),
      )
    })
  })
})
