import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Check, ChevronsUpDown } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { type Contact } from '@/types/models'

import { getHydraMember, useContacts } from '../useContacts'

interface ContactAutocompleteProps {
  value?: string | Contact
  onChange: (value: string | Contact) => void
  excludeContactId?: string
  initialLabel?: string
}

export function ContactAutocomplete({
  value,
  onChange,
  excludeContactId,
  initialLabel,
}: ContactAutocompleteProps) {
  const { t } = useTranslation('contacts')
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')

  const { data, isLoading } = useContacts(1, { search })
  const contacts = getHydraMember(data).filter((c) => c['@id'] !== excludeContactId)

  const selectedValue = typeof value === 'string' ? value : value?.['@id']

  const getSelectedContact = () => {
    if (typeof value === 'object') {
      return value
    }
    const found = contacts.find((c) => c['@id'] === value)
    if (found) {
      return found
    }
    if (value && initialLabel) {
      return { '@id': value, displayName: initialLabel } as Contact
    }
    return value ? ({ '@id': value } as Contact) : null
  }

  const selectedContact = getSelectedContact()

  const getContactLabel = (contact: Contact) => {
    if (contact.displayName) {
      return contact.displayName
    }
    const names = contact.contactNames?.[0]
    if (names) {
      return `${names.given} ${names.family ?? ''}`.trim()
    }
    return t('common.noName')
  }

  const renderContent = () => {
    if (isLoading) {
      return <div className="py-6 text-center text-sm">{t('common.loading')}</div>
    }
    if (contacts.length === 0) {
      return <div className="py-6 text-center text-sm">{t('common.noResults')}</div>
    }
    return (
      <div className="p-1">
        {contacts.map((contact) => (
          <div
            key={contact['@id']}
            role="button"
            tabIndex={0}
            className={cn(
              'relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground aria-selected:bg-accent aria-selected:text-accent-foreground',
              selectedValue === contact['@id'] && 'bg-accent text-accent-foreground',
            )}
            onClick={() => {
              onChange(contact)
              setOpen(false)
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                onChange(contact)
                setOpen(false)
              }
            }}
          >
            <Check
              className={cn(
                'mr-2 h-4 w-4',
                selectedValue === contact['@id'] ? 'opacity-100' : 'opacity-0',
              )}
            />
            {getContactLabel(contact)}
          </div>
        ))}
      </div>
    )
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {selectedContact ? getContactLabel(selectedContact) : t('common.search')}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
        <div className="flex flex-col">
          <div className="flex items-center border-b px-3" data-cmdk-input-wrapper="">
            <input
              className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
              placeholder={t('common.search')}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="max-h-[300px] overflow-y-auto overflow-x-hidden">{renderContent()}</div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
