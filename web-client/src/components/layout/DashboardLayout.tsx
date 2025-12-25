import { Users, LogOut } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Outlet, Link } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher'
import { useAuth } from '@/hooks/useAuth'

export default function DashboardLayout() {
  const { logout, user } = useAuth()
  const { t } = useTranslation()

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-gray-800 border-r hidden md:block">
        <div className="p-6">
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-teal-400">
            {t('app.title')}
          </h1>
        </div>
        <nav className="px-4 space-y-2">
          <Link
            to="/"
            className="flex items-center gap-2 px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
          >
            <Users className="w-5 h-5" />
            <span>{t('contacts.title')}</span>
          </Link>
        </nav>
        <div className="absolute bottom-4 left-4 right-4 space-y-2">
          <div className="p-4 border-t dark:border-gray-700 space-y-2">
            <div className="mb-2 text-sm font-medium truncate" title={user?.uuid}>
              {user?.uuid}
            </div>
            <LanguageSwitcher />
            <Button variant="outline" className="w-full justify-start gap-2" onClick={logout}>
              <LogOut className="w-4 h-4" />
              {t('auth.logout')}
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-auto">
        <Outlet />
      </main>
    </div>
  )
}
