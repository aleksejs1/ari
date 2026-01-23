import { Monitor } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { SidebarNavItem } from '../SidebarNavItem'

export function SessionRoutesSection({ onNavigate }: { onNavigate?: () => void }) {
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
