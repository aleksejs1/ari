import { useTranslation } from 'react-i18next'
import { Monitor } from 'lucide-react'

import { SidebarNavItem } from '@/features/ui/sidebar/SidebarNavItem'

export function SessionsSidebarSection({ onNavigate }: { onNavigate?: () => void }) {
  const { t } = useTranslation()

  return (
    <SidebarNavItem
      to="/sessions"
      icon={Monitor}
      label={t('app.navigation.sidebar.sessions', 'Sessions')}
      onClick={onNavigate}
    />
  )
}
