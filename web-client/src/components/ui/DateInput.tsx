import { forwardRef, useEffect, useMemo, useState } from 'react'
import { useIMask } from 'react-imask'
import { format, isValid, parseISO } from 'date-fns'
import { CalendarIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Input, type InputProps } from '@/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { useRegionalPrefs } from '@/contexts/RegionalPrefsContext'
import { cn, parseLocalizedDate } from '@/lib/utils'

interface DateInputProps extends Omit<InputProps, 'value' | 'onChange'> {
  value?: string | Date | null
  onChange?: (date: string | null) => void // Returns ISO date string (YYYY-MM-DD) or null
}

export const DateInput = forwardRef<HTMLInputElement, DateInputProps>(
  ({ value, onChange, className, ...props }, forwardedRef) => {
    const { dateFormat, formatDate } = useRegionalPrefs()

    // Determine mask pattern
    const maskPattern = dateFormat === 'dd.mm.yyyy' ? '00.00.0000' : '00/00/0000'

    const { ref: maskRef, setValue: setMaskValue } = useIMask({
      mask: maskPattern,
      lazy: true,
      overwrite: true,
      autofix: true,
      onAccept: (val: string) => {
        const isoDate = parseLocalizedDate(val, dateFormat)
        if (isoDate && onChange) {
          onChange(isoDate)
        } else if (!val && onChange) {
          onChange(null)
        }
      },
    })

    // Combine refs
    const combinedRef = (node: HTMLInputElement) => {
      assignRef(maskRef, node)
      assignRef(forwardedRef, node)
    }

    // Also handle native onChange for better testability and fallback
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value
      const isoDate = parseLocalizedDate(val, dateFormat)
      if (isoDate && onChange) {
        onChange(isoDate)
      } else if (!val && onChange) {
        onChange(null)
      }
    }

    // Parse current value for Calendar
    const parsedValue = useMemo(() => {
      if (!value) {
        return undefined
      }
      const d = typeof value === 'string' ? parseISO(value) : value
      return isValid(d) ? d : undefined
    }, [value])

    // Month for controlled navigation in Calendar
    const [month, setMonth] = useState<Date | undefined>(parsedValue)

    // Sync month state with value during render to avoid cascading renders in useEffect
    const [prevValue, setPrevValue] = useState(value)
    if (value !== prevValue) {
      setPrevValue(value)
      if (parsedValue) {
        setMonth(parsedValue)
      }
    }

    // Sync internal state with external value
    useEffect(() => {
      if (value) {
        setMaskValue(formatDate(value))
      } else {
        setMaskValue('')
      }
    }, [value, formatDate, setMaskValue])

    const handleCalendarSelect = (date: Date | undefined) => {
      if (!date) {
        return
      }

      // Format as ISO for the form value
      const iso = format(date, 'yyyy-MM-dd')

      // Update the mask visually immediately using the date object to avoid timezone issues
      setMaskValue(formatDate(date))

      if (onChange) {
        onChange(iso)
      }
    }

    return (
      <div className={cn('relative', className)}>
        <Input
          ref={combinedRef}
          type="text"
          placeholder={dateFormat.toLowerCase()}
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
              selected={parsedValue}
              month={month}
              onMonthChange={setMonth}
              onSelect={handleCalendarSelect}
              captionLayout="dropdown"
              startMonth={new Date(1900, 0)}
              endMonth={new Date()}
              title="Calendar"
            />
          </PopoverContent>
        </Popover>
      </div>
    )
  },
)
DateInput.displayName = 'DateInput'

function assignRef<T>(
  // eslint-disable-next-line sonarjs/deprecation
  ref: React.MutableRefObject<T | null> | ((instance: T | null) => void) | null | undefined,
  value: T | null,
) {
  if (typeof ref === 'function') {
    ref(value)
  } else if (ref) {
    // eslint-disable-next-line sonarjs/deprecation
    ;(ref as React.MutableRefObject<T | null>).current = value
  }
}
