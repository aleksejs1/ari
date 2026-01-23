import { ArrowLeft } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'

import { ContactTimeline } from '../components/ContactTimeline'

import { Button } from '@/components/ui/button'

export default function ContactTimelinePage() {
  const { id } = useParams<{ id: string }>()
  const { t } = useTranslation()
  const navigate = useNavigate()

  if (!id) {
    return null
  }

  return (
    <div className="flex h-[calc(100vh-64px)] flex-col">
      <div className="mb-6 flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          {t('common.back')}
        </Button>
        <h1 className="text-2xl font-bold">{t('auditLogs.timeline')}</h1>
      </div>

      <div className="flex-1 overflow-auto rounded-lg border bg-white p-6 shadow-sm dark:bg-gray-800">
        <ContactTimeline contactId={id} fullHeight />
      </div>
    </div>
  )
}
