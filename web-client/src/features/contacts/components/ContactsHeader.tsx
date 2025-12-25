import { Plus } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { Button } from '@/components/ui/button'

interface ContactsHeaderProps {
  onCreate: () => void
}

export function ContactsHeader({ onCreate }: ContactsHeaderProps) {
  const { t } = useTranslation()

  return (
    <div className="flex justify-between items-center">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">{t('contacts.title')}</h2>
        <p className="text-muted-foreground">
          {t('contacts.description', 'Manage your contacts list.')}
        </p>
      </div>
      <Button onClick={onCreate}>
        <Plus className="w-4 h-4 mr-2" />
        {t('contacts.create')}
      </Button>
    </div>
  )
}
