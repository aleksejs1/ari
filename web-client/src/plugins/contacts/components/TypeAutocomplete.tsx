import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Check, ChevronsUpDown } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'
import type { components } from '@/types/schema'

import { useAutocomplete } from '../hooks/useAutocomplete'

type Autocomplete = components['schemas']['Autocomplete']

interface TypeAutocompleteProps extends React.InputHTMLAttributes<HTMLInputElement> {
  field: keyof Omit<Autocomplete, 'id'>
}

export function TypeAutocomplete({
  value,
  onChange,
  field,
  placeholder,
  className,
  ...props
}: TypeAutocompleteProps) {
  const [open, setOpen] = useState(false)
  const [customValues, setCustomValues] = useState<string[]>([])
  const [isTyping, setIsTyping] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const { data } = useAutocomplete()

  const currentValue = typeof value === 'string' ? value : ''

  // Combine API suggestions with custom values
  const allSuggestions = useMemo(
    () => [...new Set([...(data?.[field] || []), ...customValues])],
    [data, field, customValues],
  )

  // Filter suggestions only when user is actively typing
  const filteredSuggestions = useMemo(() => {
    if (!isTyping || !currentValue) {
      return allSuggestions
    }
    return allSuggestions.filter((suggestion) =>
      suggestion.toLowerCase().includes(currentValue.toLowerCase()),
    )
  }, [allSuggestions, currentValue, isTyping])

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false)
        setIsTyping(false)
        // Add custom value when clicking outside
        if (currentValue && !allSuggestions.includes(currentValue)) {
          setCustomValues((prev) => [...new Set([...prev, currentValue])])
        }
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [currentValue, allSuggestions])

  const handleSuggestionClick = useCallback(
    (suggestion: string) => {
      if (onChange) {
        const event = {
          target: {
            value: suggestion,
            name: props.name,
          },
        } as React.ChangeEvent<HTMLInputElement>
        onChange(event)
      }
      setOpen(false)
      setIsTyping(false)
      inputRef.current?.focus()
    },
    [onChange, props.name],
  )

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsTyping(true)
    if (onChange) {
      onChange(e)
    }
    if (!open) {
      setOpen(true)
    }
  }

  const handleInputFocus = () => {
    setIsTyping(false) // Reset typing state on focus to show full list
    setOpen(true)
  }

  // Only show dropdown if there are suggestions
  const showDropdown = open && filteredSuggestions.length > 0

  return (
    <div ref={containerRef} className="relative flex-1">
      <Input
        ref={inputRef}
        value={value}
        onChange={handleInputChange}
        onFocus={handleInputFocus}
        placeholder={placeholder}
        className={cn('pr-8', className)}
        {...props}
      />
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="absolute right-0 top-0 h-full px-2 hover:bg-transparent"
        tabIndex={-1}
        onClick={() => {
          setIsTyping(false) // Show full list when clicking button
          setOpen(!open)
          inputRef.current?.focus()
        }}
      >
        <ChevronsUpDown className="h-4 w-4 opacity-50" />
      </Button>

      {showDropdown ? (
        <div className="absolute top-full z-50 mt-1 w-full overflow-hidden rounded-md border bg-popover shadow-md">
          <ScrollArea className="max-h-[200px]">
            <div className="flex flex-col p-1">
              {filteredSuggestions.map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  className="flex w-full items-center rounded-sm px-2 py-1.5 text-left text-sm outline-none hover:bg-accent hover:text-accent-foreground"
                  onMouseDown={(e) => {
                    e.preventDefault()
                    handleSuggestionClick(suggestion)
                  }}
                >
                  <Check
                    className={cn(
                      'mr-2 h-4 w-4',
                      currentValue === suggestion ? 'opacity-100' : 'opacity-0',
                    )}
                  />
                  {suggestion}
                </button>
              ))}
            </div>
          </ScrollArea>
        </div>
      ) : null}
    </div>
  )
}
