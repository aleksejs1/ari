import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Outlet } from 'react-router-dom'
import { Menu } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { useSidebarCollapsed } from '@/hooks/useSidebarCollapsed'

import { NotificationBell } from '@/features/activity-feed/components/NotificationBell'
import { SidebarContent } from '@/features/layout/SidebarContent'
import { UserMenu } from '@/features/layout/UserMenu'
import { GlobalSearch } from '@/features/search/components/GlobalSearch'

export default function AppLayout() {
  const { t } = useTranslation()
  const [mobileOpen, setMobileOpen] = useState(false)
  const { collapsed, toggle } = useSidebarCollapsed()

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Desktop Sidebar */}
      <aside
        className="sticky top-0 hidden h-screen flex-col border-r bg-white transition-[width] duration-200 dark:bg-gray-800 md:flex"
        style={{ width: collapsed ? '64px' : '256px' }}
      >
        <SidebarContent collapsed={collapsed} onToggleCollapse={toggle} />
      </aside>

      {/* Main Content */}
      <main className="flex min-w-0 flex-1 flex-col overflow-auto bg-gray-50/50 dark:bg-gray-900/50">
        <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-white px-6 shadow-sm dark:bg-gray-800">
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">{t('app.navigation.toggleMenu')}</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-0">
              <SheetTitle className="sr-only">{t('app.navigation.toggleMenu')}</SheetTitle>
              <SheetDescription className="sr-only">
                {t('app.navigation.toggleMenu')}
              </SheetDescription>
              <SidebarContent onNavigate={() => setMobileOpen(false)} />
            </SheetContent>
          </Sheet>

          <div className="ml-auto flex items-center gap-4">
            <GlobalSearch />
            <NotificationBell />
            <UserMenu />
          </div>
        </header>
        <div className="flex-1 p-8">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
