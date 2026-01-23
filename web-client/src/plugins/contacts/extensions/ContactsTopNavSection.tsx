import { Users } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import { Button } from '@/components/ui/button'

export function ContactsTopNavSection({ onNavigate }: { onNavigate?: () => void }) {
  const { t } = useTranslation()

  if (onNavigate) {
    return (
      <Link
        to="/contacts"
        onClick={onNavigate}
        className="flex items-center gap-2 rounded-lg px-2 py-1 text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
      >
        <Users className="h-5 w-5" />
        <span>{t('app.navigation.sidebar.contacts', 'Contacts')}</span>
      </Link>
    )
  }

  return (
    <Button variant="ghost" asChild className="hidden md:flex">
      <Link to="/contacts" className="flex items-center gap-2">
        <Users className="h-4 w-4" />
        <span>{t('app.navigation.sidebar.contacts', 'Contacts')}</span>
      </Link>
    </Button>
  )
}
