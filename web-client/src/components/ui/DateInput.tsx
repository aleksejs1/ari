/* eslint-disable react-hooks/set-state-in-effect */
import { format } from 'date-fns'
import { CalendarIcon } from 'lucide-react'
import { useEffect, useState } from 'react'

import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Input, type InputProps } from '@/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { useUserPrefs } from '@/hooks/useUserPrefs'
import { cn, parseLocalizedDate } from '@/lib/utils'

interface DateInputProps extends Omit<InputProps, 'value' | 'onChange'> {
  value?: string | Date | null
  onChange?: (date: string | null) => void // Returns ISO date string (YYYY-MM-DD) or null
}

export function DateInput({ value, onChange, className, ...props }: DateInputProps) {
  const { dateFormat, formatDate } = useUserPrefs()
  const [inputValue, setInputValue] = useState('')

  // Sync internal state with external value
  useEffect(() => {
    if (value) {
      setInputValue(formatDate(value))
    } else {
      setInputValue('')
    }
  }, [value, dateFormat, formatDate])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setInputValue(val)

    const isoDate = parseLocalizedDate(val, dateFormat)
    if (isoDate && onChange) {
      onChange(isoDate)
    } else if (!val && onChange) {
      onChange(null)
    }
  }

  const handleCalendarSelect = (date: Date | undefined) => {
    if (!date) {
      return
    }

    // ISO format for internal value and API
    const iso = format(date, 'yyyy-MM-dd')

    // Update local input state with user-preferred format
    setInputValue(formatDate(iso))

    // Trigger external change handler
    if (onChange) {
      onChange(iso)
    }
  }

  return (
    <div className={cn('relative', className)}>
      <Input
        type="text"
        placeholder={dateFormat.toLowerCase()}
        value={inputValue}
        onChange={handleChange}
        className="pr-10"
        {...props}
      />
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-0 top-0 h-full w-10 text-muted-foreground hover:bg-transparent hover:text-foreground"
          >
            <CalendarIcon className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="end">
          <Calendar
            mode="single"
            selected={value ? new Date(value) : undefined}
            onSelect={handleCalendarSelect}
            captionLayout="dropdown-buttons"
            startMonth={new Date(1900, 0)}
            endMonth={new Date()}
            title="Calendar"
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
