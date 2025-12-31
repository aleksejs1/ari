import { X } from 'lucide-react'
import * as React from 'react'
import { useTranslation } from 'react-i18next'

import { useGroups } from '../useContacts'

import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { type ContactGroup, type Group } from '@/types/models'

interface ContactGroupSelectProps {
  value?: ContactGroup[]
  onChange: (value: ContactGroup[]) => void
}

export function ContactGroupSelect({ value = [], onChange }: ContactGroupSelectProps) {
  const { t } = useTranslation()
  const { data: groups = [] } = useGroups()
  const [open, setOpen] = React.useState(false)
  const [inputValue, setInputValue] = React.useState('')
  const inputRef = React.useRef<HTMLInputElement>(null)

  const handleUnselect = (group: ContactGroup) => {
    onChange(value.filter((g) => g !== group))
  }

  const handleSelectGroup = (group: Group) => {
    // Check if already selected
    if (
      value.some((g) =>
        typeof g.groupResource === 'string'
          ? g.groupResource === group['@id']
          : g.groupResource.name === group.name,
      )
    ) {
      return
    }

    onChange([...value, { groupResource: group['@id'] as string }])
    setInputValue('')
    setOpen(false)
  }

  const handleCreateGroup = () => {
    if (!inputValue.trim()) {
      return
    }

    // Check if already selected as new group
    if (
      value.some(
        (g) => typeof g.groupResource !== 'string' && g.groupResource.name === inputValue.trim(),
      )
    ) {
      setInputValue('')
      setOpen(false)
      return
    }
    // Check if it matches an existing group
    const existingGroup = groups.find(
      (g) => g.name?.toLowerCase() === inputValue.trim().toLowerCase(),
    )
    if (existingGroup) {
      handleSelectGroup(existingGroup)
      return
    }

    onChange([...value, { groupResource: { name: inputValue.trim() } }])
    setInputValue('')
    setOpen(false)
  }

  const filteredGroups = groups.filter((group) => {
    if (!group.name) {
      return false
    }
    const normalizedInput = inputValue.toLowerCase()
    const matchesName = group.name.toLowerCase().includes(normalizedInput)
    const isSelected = value.some((g) =>
      typeof g.groupResource === 'string'
        ? g.groupResource === group['@id']
        : g.groupResource.name === group.name,
    )
    return matchesName && !isSelected
  })

  // Determine if we should show "Create" option
  const showCreate =
    inputValue.trim().length > 0 &&
    !groups.some((g) => g.name?.toLowerCase() === inputValue.trim().toLowerCase()) &&
    !value.some(
      (g) => typeof g.groupResource !== 'string' && g.groupResource.name === inputValue.trim(),
    )

  return (
    <div className="w-full">
      <div className="group rounded-md border border-input px-3 py-2 text-sm ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
        <div className="flex flex-wrap gap-1">
          {value.map((group, index) => {
            let label = ''
            if (typeof group.groupResource === 'string') {
              const found = groups.find((g) => g['@id'] === group.groupResource)
              label = found?.name || group.groupResource // Fallback
            } else {
              label = group.groupResource.name
            }

            return (
              <span
                key={index}
                className="flex items-center gap-1 rounded bg-secondary px-2 py-1 text-secondary-foreground hover:bg-secondary/80"
              >
                {label}
                <button
                  type="button"
                  className="ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleUnselect(group)
                    }
                  }}
                  onMouseDown={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                  }}
                  onClick={() => handleUnselect(group)}
                >
                  <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                </button>
              </span>
            )
          })}
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <input
                ref={inputRef}
                type="text"
                className="flex-1 bg-transparent outline-none placeholder:text-muted-foreground"
                placeholder={value.length === 0 ? t('contacts.selectGroup') : ''}
                value={inputValue}
                onChange={(e) => {
                  setInputValue(e.target.value)
                  setOpen(true)
                }}
                onFocus={() => setOpen(true)}
                onKeyDown={(e) => {
                  if (e.key === 'Backspace' && !inputValue && value.length > 0) {
                    onChange(value.slice(0, -1))
                  }
                  if (e.key === 'Enter' && inputValue) {
                    e.preventDefault() // Prevent form submission
                    handleCreateGroup()
                  }
                }}
              />
            </PopoverTrigger>
            <PopoverContent
              className="w-[200px] p-0"
              align="start"
              onOpenAutoFocus={(e) => e.preventDefault()}
            >
              <div className="max-h-[300px] overflow-auto p-1">
                {filteredGroups.map((group) => (
                  <button
                    type="button"
                    key={group['@id']}
                    className={cn(
                      'relative flex w-full cursor-default select-none items-center rounded-sm px-2 py-1.5 text-left text-sm outline-none hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
                    )}
                    onClick={() => handleSelectGroup(group)}
                  >
                    {group.name}
                  </button>
                ))}
                {showCreate ? (
                  <button
                    type="button"
                    className="relative flex w-full cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-left text-sm text-blue-600 outline-none hover:bg-accent hover:text-accent-foreground"
                    onClick={handleCreateGroup}
                  >
                    <span className="font-semibold">{t('common.create')}</span>
                    <span className="ml-1">&quot;{inputValue}&quot;</span>
                  </button>
                ) : null}
                {!showCreate && filteredGroups.length === 0 && (
                  <p className="p-2 text-sm text-muted-foreground">{t('common.noResults')}</p>
                )}
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </div>
  )
}
