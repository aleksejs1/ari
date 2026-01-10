import { LogOut, Settings, Bell, Download, Shield, Users, Menu, FileText } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useAuth } from '@/hooks/useAuth'

export function UserMenu() {
  const { t } = useTranslation()
  const { logout, user } = useAuth()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-9 w-9">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Open user menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user?.username || 'User'}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user?.email || user?.uuid}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link to="/audit-logs" className="cursor-pointer">
              <FileText className="mr-2 h-4 w-4" />
              <span>{t('app.navigation.auditLogs', 'Audit Logs')}</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to="/groups" className="cursor-pointer">
              <Users className="mr-2 h-4 w-4" />
              <span>{t('app.navigation.manageGroups', 'Manage Groups')}</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to="/notification-channels" className="cursor-pointer">
              <Bell className="mr-2 h-4 w-4" />
              <span>{t('app.navigation.notificationChannels', 'Notification Channels')}</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to="/settings/notification-policies" className="cursor-pointer">
              <Shield className="mr-2 h-4 w-4" />
              <span>
                {t('app.navigation.sidebar.notificationPolicies', 'Notification Policies')}
              </span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to="/google-import" className="cursor-pointer">
              <Download className="mr-2 h-4 w-4" />
              <span>{t('app.navigation.googleImport', 'Google Import')}</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to="/settings" className="cursor-pointer">
              <Settings className="mr-2 h-4 w-4" />
              <span>{t('app.navigation.settings', 'Settings')}</span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={logout} className="cursor-pointer">
          <LogOut className="mr-2 h-4 w-4" />
          <span>{t('auth.logout', 'Logout')}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
