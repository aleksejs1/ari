import { useTranslation } from 'react-i18next'
import { Laptop, Moon, Sun } from 'lucide-react'

import {
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu'
import { useUserPrefs } from '@/hooks/useUserPrefs.hook'

export function ThemeSection() {
  const { t } = useTranslation()
  const { theme, setTheme } = useUserPrefs()

  return (
    <>
      <DropdownMenuLabel className="font-normal opacity-70">
        <span className="px-4 text-xs font-semibold uppercase tracking-wider md:px-2">
          {t('settings.theme', 'Theme')}
        </span>
      </DropdownMenuLabel>
      <DropdownMenuGroup>
        <DropdownMenuItem
          onClick={() => setTheme('light')}
          className="cursor-pointer p-4 md:px-2 md:py-1.5"
        >
          <Sun
            className={`mr-3 h-5 w-5 md:mr-2 md:h-4 md:w-4 ${theme === 'light' ? 'text-primary' : 'opacity-70'}`}
          />
          <span className={`text-base md:text-sm ${theme === 'light' ? 'font-bold' : ''}`}>
            {t('settings.themeLight', 'Light')}
          </span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme('dark')}
          className="cursor-pointer p-4 md:px-2 md:py-1.5"
        >
          <Moon
            className={`mr-3 h-5 w-5 md:mr-2 md:h-4 md:w-4 ${theme === 'dark' ? 'text-primary' : 'opacity-70'}`}
          />
          <span className={`text-base md:text-sm ${theme === 'dark' ? 'font-bold' : ''}`}>
            {t('settings.themeDark', 'Dark')}
          </span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme('system')}
          className="cursor-pointer p-4 md:px-2 md:py-1.5"
        >
          <Laptop
            className={`mr-3 h-5 w-5 md:mr-2 md:h-4 md:w-4 ${theme === 'system' ? 'text-primary' : 'opacity-70'}`}
          />
          <span className={`text-base md:text-sm ${theme === 'system' ? 'font-bold' : ''}`}>
            {t('settings.themeSystem', 'System')}
          </span>
        </DropdownMenuItem>
      </DropdownMenuGroup>
    </>
  )
}
