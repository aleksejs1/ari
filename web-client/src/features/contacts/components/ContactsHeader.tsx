import { Plus, Search } from 'lucide-react'
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
            placeholder={t('common.search')}
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
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
