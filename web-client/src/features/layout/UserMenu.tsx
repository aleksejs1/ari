import { LogOut, Settings, CircleUser, FileText } from 'lucide-react'
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
          <CircleUser className="h-5 w-5" />
          <span className="sr-only">Open user menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80 md:w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal" asChild>
          <div className="flex flex-col space-y-1 p-4 md:p-2">
            <p className="text-base font-medium leading-none md:text-sm">{user?.uuid || 'User'}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link to="/audit-logs" className="cursor-pointer p-4 md:px-2 md:py-1.5">
              <FileText className="mr-3 h-5 w-5 md:mr-2 md:h-4 md:w-4" />
              <span className="text-base md:text-sm">
                {t('app.navigation.auditLogs', 'Audit Logs')}
              </span>
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem asChild>
            <Link to="/settings" className="cursor-pointer p-4 md:px-2 md:py-1.5">
              <Settings className="mr-3 h-5 w-5 md:mr-2 md:h-4 md:w-4" />
              <span className="text-base md:text-sm">
                {t('app.navigation.settings', 'Settings')}
              </span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={logout} className="cursor-pointer p-4 md:px-2 md:py-1.5">
          <LogOut className="mr-3 h-5 w-5 md:mr-2 md:h-4 md:w-4" />
          <span className="text-base md:text-sm">{t('auth.logout', 'Logout')}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
