import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, Outlet } from 'react-router-dom'
import { Menu } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { useUserPrefs } from '@/hooks/useUserPrefs.hook'
import { TopMenuRegistry } from '@/lib/ui/topmenu/TopMenuRegistry'

import { NotificationBell } from '@/features/activity-feed/components/NotificationBell'
import { UserMenu } from '@/features/layout/UserMenu'
import { GlobalSearch } from '@/features/search/components/GlobalSearch'

export default function SidebarLessLayout() {
  const { t } = useTranslation()
  const { showLogo } = useUserPrefs()
  const [open, setOpen] = useState(false)
  const topMenuSections = TopMenuRegistry.getInstance().getAll()

  return (
    <div className="flex min-h-screen flex-col bg-gray-100 dark:bg-gray-900">
      <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-white px-6 shadow-sm dark:bg-gray-800">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">{t('app.navigation.toggleMenu')}</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64">
            <SheetTitle className="sr-only">{t('app.navigation.toggleMenu')}</SheetTitle>
            <SheetDescription className="sr-only">
              {t('app.navigation.toggleMenu')}
            </SheetDescription>
            <div className="flex flex-col gap-4 py-4">
              {topMenuSections.map((section) => {
                const Component = section.component
                return <Component key={`${section.id}-mobile`} onNavigate={() => setOpen(false)} />
              })}
            </div>
          </SheetContent>
        </Sheet>

        <div className="mr-auto flex items-center gap-4">
          {showLogo !== '0' && (
            <Link to="/" className="hidden md:block">
              <h1 className="bg-gradient-to-r from-blue-500 to-teal-400 bg-clip-text text-2xl font-bold text-transparent">
                {t('app.title')}
              </h1>
            </Link>
          )}

          <div className="hidden items-center gap-4 md:flex">
            {topMenuSections.map((section) => {
              const Component = section.component
              return <Component key={section.id} />
            })}
          </div>
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
