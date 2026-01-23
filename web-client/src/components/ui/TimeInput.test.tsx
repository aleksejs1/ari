import { fireEvent, render, screen } from '@testing-library/react'
import { vi } from 'vitest'

import { TimeInput } from './TimeInput'

describe('TimeInput', () => {
  it('renders custom 24h inputs when format is 24h', () => {
    const onChange = vi.fn()
    render(<TimeInput value="21:00" onChange={onChange} format="24h" />)

    // Should show 21, 00, no AM/PM
    expect(screen.getByPlaceholderText('HH')).toHaveValue(21)
    expect(screen.getByPlaceholderText('MM')).toHaveValue(0)
    expect(screen.queryByRole('combobox')).toBeNull()
  })

  it('calls onChange with new value when 24h input changes', () => {
    const onChange = vi.fn()
    render(<TimeInput value="21:00" onChange={onChange} format="24h" />)

    const hourInput = screen.getByPlaceholderText('HH')
    fireEvent.change(hourInput, { target: { value: '22' } })

    expect(onChange).toHaveBeenCalledWith('22:00')
  })

  it('renders 12h inputs when format is 12h', () => {
    const onChange = vi.fn()
    render(<TimeInput value="21:00" onChange={onChange} format="12h" />)

    // Should show 9, 00, PM
    expect(screen.getByPlaceholderText('HH')).toHaveValue(9)
    expect(screen.getByPlaceholderText('MM')).toHaveValue(0)
    expect(screen.getByRole('combobox')).toHaveValue('PM')
  })

  it('converts 12h input to 24h output correctly (PM)', () => {
    const onChange = vi.fn()
    render(<TimeInput value="21:00" onChange={onChange} format="12h" />)

    const hourInput = screen.getByPlaceholderText('HH')
    fireEvent.change(hourInput, { target: { value: '10' } })

    // 10 PM -> 22:00
    expect(onChange).toHaveBeenCalledWith('22:00')
  })

  it('converts 12h input to 24h output correctly (AM)', () => {
    const onChange = vi.fn()
    render(<TimeInput value="09:00" onChange={onChange} format="12h" />)

    const hourInput = screen.getByPlaceholderText('HH')
    fireEvent.change(hourInput, { target: { value: '10' } })

    // 10 AM -> 10:00
    expect(onChange).toHaveBeenCalledWith('10:00')
  })

  it('handles 12 AM correctly (00:00)', () => {
    const onChange = vi.fn()
    render(<TimeInput value="00:00" onChange={onChange} format="12h" />)

    expect(screen.getByPlaceholderText('HH')).toHaveValue(12)
    expect(screen.getByRole('combobox')).toHaveValue('AM')
  })

  it('handles 12 PM correctly (12:00)', () => {
    const onChange = vi.fn()
    render(<TimeInput value="12:00" onChange={onChange} format="12h" />)

    expect(screen.getByPlaceholderText('HH')).toHaveValue(12)
    expect(screen.getByRole('combobox')).toHaveValue('PM')
  })

  it('updates period correctly', () => {
    const onChange = vi.fn()
    render(<TimeInput value="09:00" onChange={onChange} format="12h" />)

    const select = screen.getByRole('combobox')
    fireEvent.change(select, { target: { value: 'PM' } })

    // 09:00 AM -> 09:00 PM -> 21:00
    expect(onChange).toHaveBeenCalledWith('21:00')
  })
})
