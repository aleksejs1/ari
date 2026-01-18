import { Menu } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Outlet } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet'
import { NotificationBell } from '@/features/activity-feed/components/NotificationBell'
import { SidebarContent } from '@/features/layout/SidebarContent'
import { UserMenu } from '@/features/layout/UserMenu'
import { GlobalSearch } from '@/features/search/components/GlobalSearch'

export default function DashboardLayout() {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Desktop Sidebar */}
      <aside className="sticky top-0 hidden h-screen w-64 flex-col border-r bg-white dark:bg-gray-800 md:flex">
        <SidebarContent />
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto bg-gray-50/50 dark:bg-gray-900/50">
        <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-white px-6 shadow-sm dark:bg-gray-800">
          <Sheet open={open} onOpenChange={setOpen}>
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
              <SidebarContent onNavigate={() => setOpen(false)} />
            </SheetContent>
          </Sheet>

          <div className="ml-auto flex items-center gap-4">
            <GlobalSearch />
            <NotificationBell />
            <UserMenu />
          </div>
        </header>
        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
