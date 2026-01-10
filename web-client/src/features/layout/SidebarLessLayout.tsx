import { Users } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Outlet, Link } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import { NotificationBell } from '@/features/activity-feed/components/NotificationBell'
import { UserMenu } from '@/features/layout/UserMenu'
import { GlobalSearch } from '@/features/search/components/GlobalSearch'

export default function SidebarLessLayout() {
  const { t } = useTranslation()

  return (
    <div className="flex min-h-screen flex-col bg-gray-100 dark:bg-gray-900">
      <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-white px-6 shadow-sm dark:bg-gray-800">
        <div className="mr-auto flex items-center gap-4">
          <Link to="/">
            <h1 className="bg-gradient-to-r from-blue-500 to-teal-400 bg-clip-text text-2xl font-bold text-transparent">
              {t('app.title')}
            </h1>
          </Link>
          <Button variant="ghost" asChild>
            <Link to="/contacts" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span>{t('app.navigation.sidebar.contacts', 'Contacts')}</span>
            </Link>
          </Button>
        </div>
        <GlobalSearch />
        <NotificationBell />
        <UserMenu />
      </header>
      <main className="flex-1 overflow-auto bg-gray-50/50 p-8 dark:bg-gray-900/50">
        <Outlet />
      </main>
    </div>
  )
}
