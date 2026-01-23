import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { Home as HomeIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'

export function DashboardTopNavSection({ onNavigate }: { onNavigate?: () => void }) {
  const { t } = useTranslation()

  if (onNavigate) {
    return (
      <Link
        to="/"
        onClick={onNavigate}
        className="flex items-center gap-2 rounded-lg px-2 py-1 text-lg font-semibold"
      >
        <HomeIcon className="h-5 w-5" />
        <span>{t('app.navigation.home')}</span>
      </Link>
    )
  }

  return (
    <Button variant="ghost" asChild className="hidden md:flex">
      <Link to="/" className="flex items-center gap-2">
        <HomeIcon className="h-4 w-4" />
        <span>{t('app.navigation.home', 'Home')}</span>
      </Link>
    </Button>
  )
}
