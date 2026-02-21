import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Plus, Search } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface ContactsHeaderProps {
  onCreate: () => void
  search: string
  onSearchChange: (value: string) => void
}

export function ContactsHeader({ onCreate, search, onSearchChange }: ContactsHeaderProps) {
  const { t } = useTranslation('contacts')
  const [inputValue, setInputValue] = useState(search)
  const [prevSearch, setPrevSearch] = useState(search)
  const [isFocused, setIsFocused] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  // Sync from prop (URL) to local state, but ONLY if not focused
  // This handles the "Back button" or external navigation case without interrupting typing
  if (search !== prevSearch) {
    setPrevSearch(search)
    // Check focus to ensure we don't overwrite user typing if URL updates (though we debounce URL updates)
    // We only update if the input is NOT focused.
    if (!isFocused) {
      setInputValue(search)
    }
  }

  // Debounce the local input changes up to the parent
  useEffect(() => {
    const timer = setTimeout(() => {
      // Only fire if the value is different from what came in via props (to avoid loops or unnecessary calls)
      if (inputValue !== search) {
        onSearchChange(inputValue)
      }
    }, 300)
    return () => clearTimeout(timer)
  }, [inputValue, search, onSearchChange])

  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">{t('title')}</h2>
        <p className="text-muted-foreground">{t('editDescription')}</p>
      </div>
      <div className="flex w-full items-center gap-2 md:w-auto">
        <div className="relative w-full md:w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            ref={inputRef}
            placeholder={t('common.search')}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className="pl-8"
            data-testid="contacts-search-input"
          />
        </div>
        <Button onClick={onCreate} data-testid="contacts-create-button">
          <Plus className="mr-2 h-4 w-4" />
          {t('create')}
        </Button>
      </div>
    </div>
  )
}
