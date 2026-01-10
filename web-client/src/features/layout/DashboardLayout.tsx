import { Users, History, Bell, Download, Settings } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Outlet, Link } from 'react-router-dom'

import { NotificationBell } from '@/features/activity-feed/components/NotificationBell'
import { UserMenu } from '@/features/layout/UserMenu'
import { GlobalSearch } from '@/features/search/components/GlobalSearch'

export default function DashboardLayout() {
  const { t } = useTranslation()

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Sidebar */}
      <aside className="sticky top-0 hidden h-screen w-64 flex-col border-r bg-white dark:bg-gray-800 md:flex">
        <div className="p-6">
          <Link to="/">
            <h1 className="bg-gradient-to-r from-blue-500 to-teal-400 bg-clip-text text-2xl font-bold text-transparent">
              {t('app.title')}
            </h1>
          </Link>
        </div>
        <nav className="space-y-2 px-4">
          <Link
            to="/audit-logs"
            className="flex items-center gap-2 rounded-lg px-4 py-2 text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
          >
            <History className="h-5 w-5" />
            <span>{t('app.navigation.sidebar.auditLogs', 'Audit Logs')}</span>
          </Link>

          {/* Groups Section */}
          <Link
            to="/groups"
            className="flex items-center gap-2 rounded-lg px-4 py-2 text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
          >
            <Users className="h-5 w-5" />
            <span>{t('app.navigation.sidebar.groups', 'Groups')}</span>
          </Link>

          <Link
            to="/notification-channels"
            className="flex items-center gap-2 rounded-lg px-4 py-2 text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
          >
            <Bell className="h-5 w-5" />
            <span>{t('app.navigation.sidebar.notificationChannels', 'Notification Channels')}</span>
          </Link>
          <Link
            to="/settings/notification-policies"
            className="flex items-center gap-2 rounded-lg px-4 py-2 text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
          >
            <Bell className="h-5 w-5" />
            <span>{t('app.navigation.sidebar.notificationPolicies', 'Notification Policies')}</span>
          </Link>
          <Link
            to="/google-import"
            className="flex items-center gap-2 rounded-lg px-4 py-2 text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
          >
            <Download className="h-5 w-5" />
            <span>{t('app.navigation.sidebar.googleImport', 'Google Import')}</span>
          </Link>
          <Link
            to="/settings"
            className="flex items-center gap-2 rounded-lg px-4 py-2 text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
          >
            <Settings className="h-5 w-5" />
            <span>{t('app.navigation.sidebar.settings', 'Settings')}</span>
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto bg-gray-50/50 dark:bg-gray-900/50">
        <header className="sticky top-0 z-10 flex h-14 items-center justify-end gap-4 border-b bg-white px-6 shadow-sm dark:bg-gray-800">
          <GlobalSearch />
          <NotificationBell />
          <UserMenu />
        </header>
        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
