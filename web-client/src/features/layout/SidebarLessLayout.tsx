import { Users, Menu, Home as HomeIcon, Network } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Outlet, Link } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { NotificationBell } from '@/features/activity-feed/components/NotificationBell'
import { UserMenu } from '@/features/layout/UserMenu'
import { GlobalSearch } from '@/features/search/components/GlobalSearch'
import { useUserPrefs } from '@/hooks/useUserPrefs.hook'

export default function SidebarLessLayout() {
  const { t } = useTranslation()
  const { showLogo } = useUserPrefs()
  const [open, setOpen] = useState(false)

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
            <div className="flex flex-col gap-4 py-4">
              <Link
                to="/"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 rounded-lg px-2 py-1 text-lg font-semibold"
              >
                <HomeIcon className="h-5 w-5" />
                <span>{t('app.navigation.home')}</span>
              </Link>
              <Link
                to="/contacts"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 rounded-lg px-2 py-1 text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
              >
                <Users className="h-5 w-5" />
                <span>{t('app.navigation.sidebar.contacts', 'Contacts')}</span>
              </Link>
              <Link
                to="/contact-graph"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 rounded-lg px-2 py-1 text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
              >
                <Network className="h-5 w-5" />
                <span>{t('app.navigation.sidebar.graph', 'Graph')}</span>
              </Link>
            </div>
          </SheetContent>
        </Sheet>

        <div className="mr-auto flex items-center gap-4">
          {showLogo !== '0' ? (
            <Link to="/" className="hidden md:block">
              <h1 className="bg-gradient-to-r from-blue-500 to-teal-400 bg-clip-text text-2xl font-bold text-transparent">
                {t('app.title')}
              </h1>
            </Link>
          ) : (
            <Button variant="ghost" asChild className="hidden md:flex">
              <Link to="/" className="flex items-center gap-2">
                <HomeIcon className="h-4 w-4" />
                <span>{t('app.navigation.home', 'Home')}</span>
              </Link>
            </Button>
          )}
          <Button variant="ghost" asChild className="hidden md:flex">
            <Link to="/contacts" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span>{t('app.navigation.sidebar.contacts', 'Contacts')}</span>
            </Link>
          </Button>
          <Button variant="ghost" asChild className="hidden md:flex">
            <Link to="/contact-graph" className="flex items-center gap-2">
              <Network className="h-4 w-4" />
              <span>{t('app.navigation.sidebar.graph', 'Graph')}</span>
            </Link>
          </Button>
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
