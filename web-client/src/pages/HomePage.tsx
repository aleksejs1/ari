import { useTranslation } from 'react-i18next'

import UpcomingAnniversariesWidget from '@/features/dashboard/UpcomingAnniversariesWidget'

export default function HomePage() {
  const { t } = useTranslation()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">{t('dashboard.title')}</h1>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <div className="md:col-span-1 lg:col-span-3">
          <UpcomingAnniversariesWidget />
        </div>
        {/* Placeholder for other potential widgets */}
        <div className="md:col-span-1 lg:col-span-4">{/* Future widgets could go here */}</div>
      </div>
    </div>
  )
}
