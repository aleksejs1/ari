import { Plus, Search } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface ContactsHeaderProps {
  onCreate: () => void
  search: string
  onSearchChange: (value: string) => void
}

export function ContactsHeader({ onCreate, search, onSearchChange }: ContactsHeaderProps) {
  const { t } = useTranslation()
  const [inputValue, setInputValue] = useState(search)
  const inputRef = useRef<HTMLInputElement>(null)

  // Sync from prop (URL) to local state, but ONLY if not focused
  // This handles the "Back button" or external navigation case without interrupting typing
  // Sync from prop (URL) to local state, but ONLY if not focused
  // This handles the "Back button" or external navigation case without interrupting typing
  useEffect(() => {
    // Check focus to ensure we don't overwrite user typing if URL updates (though we debounce URL updates)
    // We only update if the input is NOT focused.
    if (document.activeElement !== inputRef.current) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setInputValue(search)
    }
  }, [search])

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
    <div className="flex items-center justify-between gap-4">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">{t('contacts.title')}</h2>
        <p className="text-muted-foreground">{t('contacts.editDescription')}</p>
      </div>
      <div className="flex items-center gap-2">
        <div className="relative w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            ref={inputRef}
            placeholder={t('common.search')}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="pl-8"
          />
        </div>
        <Button onClick={onCreate}>
          <Plus className="mr-2 h-4 w-4" />
          {t('contacts.create')}
        </Button>
      </div>
    </div>
  )
}
