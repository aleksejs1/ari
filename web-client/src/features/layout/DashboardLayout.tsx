import {
  Users,
  LogOut,
  History,
  Bell,
  Download,
  ChevronDown,
  ChevronRight,
  LayoutDashboard,
} from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Outlet, Link } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher'
import { useGroups } from '@/features/groups/useGroups'
import { useAuth } from '@/hooks/useAuth'

export default function DashboardLayout() {
  const { logout, user } = useAuth()
  const { t } = useTranslation()
  const { data: groups } = useGroups()
  const [isGroupsOpen, setIsGroupsOpen] = useState(false)

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Sidebar */}
      <aside className="sticky top-0 hidden h-screen w-64 flex-col border-r bg-white dark:bg-gray-800 md:flex">
        <div className="p-6">
          <h1 className="bg-gradient-to-r from-blue-500 to-teal-400 bg-clip-text text-2xl font-bold text-transparent">
            {t('app.title')}
          </h1>
        </div>
        <nav className="space-y-2 px-4">
          <Link
            to="/"
            className="flex items-center gap-2 rounded-lg px-4 py-2 text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
          >
            <LayoutDashboard className="h-5 w-5" />
            <span>{t('app.navigation.home', 'Home')}</span>
          </Link>
          <Link
            to="/contacts"
            className="flex items-center gap-2 rounded-lg px-4 py-2 text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
          >
            <Users className="h-5 w-5" />
            <span>{t('app.navigation.contacts')}</span>
          </Link>
          <Link
            to="/audit-logs"
            className="flex items-center gap-2 rounded-lg px-4 py-2 text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
          >
            <History className="h-5 w-5" />
            <span>{t('app.navigation.auditLogs')}</span>
          </Link>

          {/* Groups Section */}
          <div>
            <button
              onClick={() => setIsGroupsOpen(!isGroupsOpen)}
              className="flex w-full items-center justify-between rounded-lg px-4 py-2 text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
            >
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                <span>{t('app.navigation.groups', 'Groups')}</span>
              </div>
              {isGroupsOpen ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </button>
            {!!isGroupsOpen && (
              <div className="ml-9 mt-1 space-y-1">
                <Link
                  to="/groups"
                  className="block rounded-lg px-2 py-1.5 text-sm text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                >
                  {t('app.navigation.manageGroups', 'Manage Groups')}
                </Link>
                {groups?.map((group) => (
                  <Link
                    key={group['@id']}
                    to={`/contacts?group=${group['@id']}`}
                    className="block truncate rounded-lg px-2 py-1.5 text-sm text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                  >
                    {group.name}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link
            to="/notification-channels"
            className="flex items-center gap-2 rounded-lg px-4 py-2 text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
          >
            <Bell className="h-5 w-5" />
            <span>{t('app.navigation.notificationChannels')}</span>
          </Link>
          <Link
            to="/google-import"
            className="flex items-center gap-2 rounded-lg px-4 py-2 text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
          >
            <Download className="h-5 w-5" />
            <span>{t('app.navigation.googleImport')}</span>
          </Link>
        </nav>
        <div className="mt-auto space-y-2 border-t p-4 dark:border-gray-700">
          <div className="mb-2 truncate text-sm font-medium" title={user?.uuid}>
            {user?.uuid}
          </div>
          <LanguageSwitcher />
          <Button variant="outline" className="w-full justify-start gap-2" onClick={logout}>
            <LogOut className="h-4 w-4" />
            {t('auth.logout')}
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto p-8">
        <Outlet />
      </main>
    </div>
  )
}
