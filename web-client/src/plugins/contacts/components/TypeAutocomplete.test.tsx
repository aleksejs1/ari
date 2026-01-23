import type { UseQueryResult } from '@tanstack/react-query'
import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import type { components } from '@/types/schema'

import { useAutocomplete } from '../hooks/useAutocomplete'

import { TypeAutocomplete } from './TypeAutocomplete'

type Autocomplete = components['schemas']['Autocomplete']

vi.mock('../hooks/useAutocomplete', () => ({
  useAutocomplete: vi.fn(),
}))

describe('TypeAutocomplete', () => {
  const mockOnChange = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(useAutocomplete).mockReturnValue({
      data: { phoneTypes: ['Mobile', 'Work', 'Home'] },
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

  it('shows all suggestions on focus even when value exists', async () => {
    render(<TypeAutocomplete value="Home" onChange={mockOnChange} field="phoneTypes" />)

    fireEvent.focus(screen.getByRole('textbox'))

    // All suggestions should be visible on initial focus
    expect(await screen.findByText('Mobile')).toBeInTheDocument()
    expect(screen.getByText('Work')).toBeInTheDocument()
    expect(screen.getByText('Home')).toBeInTheDocument()
  })

  it('shows dropdown with suggestions on button click', async () => {
    render(<TypeAutocomplete value="" onChange={mockOnChange} field="phoneTypes" />)

    fireEvent.click(screen.getByRole('button'))

    expect(await screen.findByText('Mobile')).toBeInTheDocument()
    expect(screen.getByText('Work')).toBeInTheDocument()
    expect(screen.getByText('Home')).toBeInTheDocument()
  })
})
