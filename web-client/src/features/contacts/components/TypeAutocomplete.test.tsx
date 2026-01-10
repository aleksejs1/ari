import type { UseQueryResult } from '@tanstack/react-query'
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'

import { useAutocomplete } from '../hooks/useAutocomplete'

import { TypeAutocomplete } from './TypeAutocomplete'

import type { components } from '@/types/schema'

type Autocomplete = components['schemas']['Autocomplete']

vi.mock('../hooks/useAutocomplete', () => ({
  useAutocomplete: vi.fn(),
}))

describe('TypeAutocomplete', () => {
  const mockOnChange = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(useAutocomplete).mockReturnValue({
      data: { phoneTypes: ['Mobile', 'Work'] },
      isLoading: false,
    } as UseQueryResult<Autocomplete>)
  })

  it('renders input with value', () => {
    render(
      <TypeAutocomplete
        value="Home"
        onChange={mockOnChange}
        field="phoneTypes"
        placeholder="Select type"
      />,
    )

    expect(screen.getByPlaceholderText('Select type')).toHaveValue('Home')
  })

  it('calls onChange when typing', () => {
    render(<TypeAutocomplete value="" onChange={mockOnChange} field="phoneTypes" />)

    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'Custom' } })
    expect(mockOnChange).toHaveBeenCalled()
  })

  it('shows suggestions on focus', async () => {
    render(<TypeAutocomplete value="" onChange={mockOnChange} field="phoneTypes" />)

    fireEvent.focus(screen.getByRole('textbox'))

    expect(await screen.findByText('Mobile')).toBeInTheDocument()
    expect(screen.getByText('Work')).toBeInTheDocument()
  })

  it('filters suggestions based on input', async () => {
    render(<TypeAutocomplete value="Mo" onChange={mockOnChange} field="phoneTypes" />)

    fireEvent.focus(screen.getByRole('textbox'))

    expect(await screen.findByText('Mobile')).toBeInTheDocument()
    expect(screen.queryByText('Work')).not.toBeInTheDocument()
  })
})
