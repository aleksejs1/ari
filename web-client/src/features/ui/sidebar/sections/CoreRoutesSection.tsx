import { History, Users } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { SidebarNavItem } from '../SidebarNavItem'

export function CoreRoutesSection({ onNavigate }: { onNavigate?: () => void }) {
  const { t } = useTranslation()

  return (
    <>
      <SidebarNavItem
        to="/audit-logs"
        icon={History}
        label={t('app.navigation.sidebar.auditLogs', 'Audit Logs')}
        onClick={onNavigate}
      />
      <SidebarNavItem
        to="/groups"
        icon={Users}
        label={t('app.navigation.sidebar.groups', 'Groups')}
        onClick={onNavigate}
      />
    </>
  )
}
