import { useTranslation } from 'react-i18next'

import DynamicDashboard from '@/features/dashboard/DynamicDashboard'

export default function HomePage() {
  const { t } = useTranslation()

  // This would eventually come from user settings/API
  const defaultLayout = ['groups', 'upcoming-anniversaries', 'recent-audit-logs']

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">{t('dashboard.title')}</h1>
      </div>

      <DynamicDashboard layout={defaultLayout} />
    </div>
  )
}
