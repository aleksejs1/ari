import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, Outlet, useLocation } from 'react-router-dom'
import {
  Bell,
  Database,
  Download,
  Globe,
  History,
  Key,
  LogIn,
  Menu,
  Monitor,
  Plug,
  Settings,
  Shield,
  Sparkles,
  Trash2,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { cn } from '@/lib/utils'

interface SettingsNavItem {
  path: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  variant?: 'danger'
}

interface SettingsNavGroup {
  title?: string
  items: SettingsNavItem[]
}

const settingsNavGroups: SettingsNavGroup[] = [
  {
    title: 'settings.nav.preferences',
    items: [
      { path: '/settings/general', label: 'settings.tabs.general', icon: Settings },
      { path: '/settings/regional', label: 'settings.tabs.regional', icon: Globe },
      { path: '/settings/data', label: 'settings.tabs.data', icon: Database },
      { path: '/settings/ai', label: 'settings.tabs.ai', icon: Sparkles },
      { path: '/settings/plugins', label: 'settings.communityPlugins', icon: Plug },
    ],
  },
  {
    title: 'settings.nav.notifications',
    items: [
      {
        path: '/settings/notification-channels',
        label: 'app.navigation.sidebar.notificationChannels',
        icon: Bell,
      },
      {
        path: '/settings/notification-policies',
        label: 'app.navigation.sidebar.notificationPolicies',
        icon: Shield,
      },
    ],
  },
  {
    title: 'settings.nav.activity',
    items: [
      { path: '/settings/sessions', label: 'app.navigation.sidebar.sessions', icon: Monitor },
      {
        path: '/settings/login-history',
        label: 'app.navigation.sidebar.loginHistory',
        icon: LogIn,
      },
      {
        path: '/settings/google-import',
        label: 'app.navigation.sidebar.googleImport',
        icon: Download,
      },
      { path: '/settings/audit-logs', label: 'app.navigation.sidebar.auditLogs', icon: History },
    ],
  },
  {
    title: 'settings.nav.account',
    items: [
      {
        path: '/settings/change-password',
        label: 'app.navigation.sidebar.changePassword',
        icon: Key,
      },
      {
        path: '/settings/delete-account',
        label: 'settings.deleteAccount.title',
        icon: Trash2,
        variant: 'danger',
      },
    ],
  },
]

function getItemClasses(isActive: boolean, variant?: string): string {
  if (isActive) {
    return 'bg-gray-100 font-medium text-gray-900 dark:bg-gray-700 dark:text-gray-100'
  }
  if (variant === 'danger') {
    return 'text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20'
  }
  return 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
}

function SettingsNav({ onNavigate }: { onNavigate?: () => void }) {
  const { t } = useTranslation()
  const location = useLocation()

  return (
    <nav className="space-y-6">
      {settingsNavGroups.map((group, groupIndex) => (
        <div key={groupIndex}>
          {group.title ? (
            <h3 className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              {t(group.title)}
            </h3>
          ) : null}
          <div className="space-y-0.5">
            {group.items.map((item) => {
              const Icon = item.icon
              const isActive =
                location.pathname === item.path ||
                (item.path !== '/settings/notification-policies' &&
                  location.pathname.startsWith(item.path + '/'))
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={onNavigate}
                  className={cn(
                    'flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors',
                    getItemClasses(isActive, item.variant),
                  )}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span>{t(item.label)}</span>
                </Link>
              )
            })}
          </div>
        </div>
      ))}
    </nav>
  )
}

export function SettingsLayout() {
  const { t } = useTranslation()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="flex gap-8">
      {/* Mobile settings nav toggle */}
      <div className="lg:hidden">
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="sm" className="mb-4 gap-2">
              <Menu className="h-4 w-4" />
              {t('settings.title')}
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64">
            <SheetTitle>{t('settings.title')}</SheetTitle>
            <SheetDescription className="sr-only">{t('settings.title')}</SheetDescription>
            <div className="mt-4">
              <SettingsNav onNavigate={() => setMobileOpen(false)} />
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop settings sidebar */}
      <aside className="hidden w-56 shrink-0 lg:block">
        <h2 className="mb-4 text-lg font-semibold">{t('settings.title')}</h2>
        <SettingsNav />
      </aside>

      {/* Settings content */}
      <div className="min-w-0 flex-1">
        <Outlet />
      </div>
    </div>
  )
}
