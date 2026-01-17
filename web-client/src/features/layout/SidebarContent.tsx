import { Users, History, Bell, Download, Settings, Lock, UserX, Monitor } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

interface SidebarContentProps {
  onNavigate?: () => void
}

export function SidebarContent({ onNavigate }: SidebarContentProps) {
  const { t } = useTranslation()

  return (
    <div className="flex h-full flex-col">
      <div className="p-6">
        <Link to="/" onClick={onNavigate}>
          <h1 className="bg-gradient-to-r from-blue-500 to-teal-400 bg-clip-text text-2xl font-bold text-transparent">
            {t('app.title')}
          </h1>
        </Link>
      </div>
      <nav className="space-y-2 px-4">
        <Link
          to="/audit-logs"
          onClick={onNavigate}
          className="flex items-center gap-2 rounded-lg px-4 py-2 text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
        >
          <History className="h-5 w-5" />
          <span>{t('app.navigation.sidebar.auditLogs', 'Audit Logs')}</span>
        </Link>

        {/* Groups Section */}
        <Link
          to="/groups"
          onClick={onNavigate}
          className="flex items-center gap-2 rounded-lg px-4 py-2 text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
        >
          <Users className="h-5 w-5" />
          <span>{t('app.navigation.sidebar.groups', 'Groups')}</span>
        </Link>

        <Link
          to="/notification-channels"
          onClick={onNavigate}
          className="flex items-center gap-2 rounded-lg px-4 py-2 text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
        >
          <Bell className="h-5 w-5" />
          <span>{t('app.navigation.sidebar.notificationChannels', 'Notification Channels')}</span>
        </Link>
        <Link
          to="/settings/notification-policies"
          onClick={onNavigate}
          className="flex items-center gap-2 rounded-lg px-4 py-2 text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
        >
          <Bell className="h-5 w-5" />
          <span>{t('app.navigation.sidebar.notificationPolicies', 'Notification Policies')}</span>
        </Link>
        <Link
          to="/google-import"
          onClick={onNavigate}
          className="flex items-center gap-2 rounded-lg px-4 py-2 text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
        >
          <Download className="h-5 w-5" />
          <span>{t('app.navigation.sidebar.googleImport', 'Google Import')}</span>
        </Link>
        <Link
          to="/sessions"
          onClick={onNavigate}
          className="flex items-center gap-2 rounded-lg px-4 py-2 text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
        >
          <Monitor className="h-5 w-5" />
          <span>{t('app.navigation.sidebar.sessions', 'Sessions')}</span>
        </Link>
        <Link
          to="/settings"
          onClick={onNavigate}
          className="flex items-center gap-2 rounded-lg px-4 py-2 text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
        >
          <Settings className="h-5 w-5" />
          <span>{t('app.navigation.sidebar.settings', 'Settings')}</span>
        </Link>
        <Link
          to="/change-password"
          onClick={onNavigate}
          className="flex items-center gap-2 rounded-lg px-4 py-2 text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
        >
          <Lock className="h-5 w-5" />
          <span>{t('app.navigation.sidebar.changePassword', 'Change Password')}</span>
        </Link>
        <Link
          to="/delete-account"
          onClick={onNavigate}
          className="flex items-center gap-2 rounded-lg px-4 py-2 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
        >
          <UserX className="h-5 w-5" />
          <span>{t('app.navigation.sidebar.deleteAccount', 'Delete Account')}</span>
        </Link>
      </nav>
    </div>
  )
}
