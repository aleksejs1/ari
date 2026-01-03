/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from 'react'

import { Input, type InputProps } from '@/components/ui/input'
import { useUserPrefs } from '@/hooks/useUserPrefs'

interface DateInputProps extends Omit<InputProps, 'value' | 'onChange'> {
  value?: string | Date | null
  onChange?: (date: string | null) => void // Returns ISO date string (YYYY-MM-DD) or null
}

export function DateInput({ value, onChange, className, ...props }: DateInputProps) {
  const { dateFormat, formatDate } = useUserPrefs()
  const [inputValue, setInputValue] = useState('')

  // Sync internal state with external value
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => {
    if (value) {
      setInputValue(formatDate(value))
    } else {
      setInputValue('')
    }
  }, [value, dateFormat, formatDate])

  const parseDate = (input: string): string | null => {
    if (!input.trim()) {
      return null
    }

    let day, month, year
    const parts = input.split(/[./-]/)

    if (dateFormat === 'dd.mm.yyyy') {
      // Expecting dd.mm.yyyy
      if (parts.length !== 3) {
        return null
      }
      day = parseInt(parts[0], 10)
      month = parseInt(parts[1], 10)
      year = parseInt(parts[2], 10)
    } else {
      // Expecting mm/dd/yyyy
      if (parts.length !== 3) {
        return null
      }
      month = parseInt(parts[0], 10)
      day = parseInt(parts[1], 10)
      year = parseInt(parts[2], 10)
    }

    if (isNaN(day) || isNaN(month) || isNaN(year)) {
      return null
    }

    // basic validation
    if (month < 1 || month > 12) {
      return null
    }
    if (day < 1 || day > 31) {
      return null
    }
    if (year < 1000 || year > 9999) {
      return null
    }

    // Create ISO string: YYYY-MM-DD
    // Note: Month is 0-indexed in Date object but we want string
    const iso = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`

    // strict check
    const d = new Date(iso)
    if (isNaN(d.getTime())) {
      return null
    }

    return iso
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setInputValue(val)

    const isoDate = parseDate(val)
    if (isoDate && onChange) {
      onChange(isoDate)
    } else if (!val && onChange) {
      onChange(null)
    }
    // If invalid, we don't call onChange with valid date, form stays as is or becomes invalid if we wanted strict
    // But usually for controlled inputs we might want to pass 'undefined' or keep previous?
    // Here we only update parent if it looks like a valid date.
    // Ideally we should handle invalid state. but for sync, let's keep it simple.
  }

  return (
    <Input
      type="text"
      placeholder={dateFormat.toLowerCase()}
      value={inputValue}
      onChange={handleChange}
      className={className}
      {...props}
    />
  )
}
