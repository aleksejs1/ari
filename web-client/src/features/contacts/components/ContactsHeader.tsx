import { Plus } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { Button } from '@/components/ui/button'

interface ContactsHeaderProps {
  onCreate: () => void
}

export function ContactsHeader({ onCreate }: ContactsHeaderProps) {
  const { t } = useTranslation()

  return (
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">{t('contacts.title')}</h2>
        <p className="text-muted-foreground">
          {t('contacts.description', 'Manage your contacts list.')}
        </p>
      </div>
      <Button onClick={onCreate}>
        <Plus className="mr-2 h-4 w-4" />
        {t('contacts.create')}
      </Button>
    </div>
  )
}
