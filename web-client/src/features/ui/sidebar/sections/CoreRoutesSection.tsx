import { useTranslation } from 'react-i18next'
import { Users } from 'lucide-react'

import { SidebarNavItem } from '../SidebarNavItem'

export function CoreRoutesSection({ onNavigate }: { onNavigate?: () => void }) {
  const { t } = useTranslation()

  return (
    <>
      <SidebarNavItem
        to="/groups"
        icon={Users}
        label={t('app.navigation.sidebar.groups', 'Groups')}
        onClick={onNavigate}
      />
    </>
  )
}
