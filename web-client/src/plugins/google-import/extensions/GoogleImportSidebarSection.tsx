import { Download } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { SidebarNavItem } from '@/features/ui/sidebar/SidebarNavItem'

export function GoogleImportSidebarSection({ onNavigate }: { onNavigate?: () => void }) {
  const { t } = useTranslation()

  return (
    <SidebarNavItem
      to="/google-import"
      icon={Download}
      label={t('app.navigation.sidebar.googleImport', 'Google Import')}
      onClick={onNavigate}
    />
  )
}
