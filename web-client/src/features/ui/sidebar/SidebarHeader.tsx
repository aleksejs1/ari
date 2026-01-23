import { Home as HomeIcon } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import { useUserPrefs } from '@/hooks/useUserPrefs.hook'

interface SidebarHeaderProps {
  onNavigate?: () => void
}

export function SidebarHeader({ onNavigate }: SidebarHeaderProps) {
  const { t } = useTranslation()
  const { showLogo } = useUserPrefs()

  return (
    <div className="p-6">
      {showLogo !== '0' ? (
        <Link to="/" onClick={onNavigate}>
          <h1 className="bg-gradient-to-r from-blue-500 to-teal-400 bg-clip-text text-2xl font-bold text-transparent">
            {t('app.title')}
          </h1>
        </Link>
      ) : (
        <Link
          to="/"
          onClick={onNavigate}
          className="flex items-center gap-2 rounded-lg px-4 py-2 text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
        >
          <HomeIcon className="h-5 w-5" />
          <span className="text-lg font-semibold">{t('app.navigation.home', 'Home')}</span>
        </Link>
      )}
    </div>
  )
}
