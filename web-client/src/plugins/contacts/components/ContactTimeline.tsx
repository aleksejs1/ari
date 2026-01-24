import { useTranslation } from 'react-i18next'
import { useQuery } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'

import { api } from '@/lib/axios'
import { type ContactTimeline as ContactTimelineType, type TimelineEvent } from '@/types/models'

import { ContactTimelineItem } from './ContactTimelineItem'

interface ContactTimelineProps {
  contactId: string
  fullHeight?: boolean
}

export function ContactTimeline({ contactId, fullHeight }: ContactTimelineProps) {
  const { t } = useTranslation('contacts')

  const {
    data: timeline,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['contacts', contactId, 'timeline'],
    queryFn: async () => {
      const res = await api.get<ContactTimelineType>(`/contacts/${contactId}/timeline`)
      return res.data
    },
  })

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4 text-center text-sm text-red-500">
        {t('history.failedToLoadTimeline')}
      </div>
    )
  }

  const logs = Array.isArray(timeline?.logs) ? timeline.logs : []

  if (logs.length === 0) {
    return <div className="p-4 text-center text-sm text-gray-500">{t('history.noHistory')}</div>
  }

  return (
    <div className={fullHeight ? '' : 'mt-6 border-t pt-4'}>
      {!fullHeight && <h3 className="mb-3 text-sm font-medium">{t('history.timeline')}</h3>}
      <div className={fullHeight ? 'pr-4' : 'h-[300px] overflow-y-auto pr-4'}>
        <div className="relative ml-2 space-y-6 border-l border-gray-200 pb-4">
          {logs.map((log: TimelineEvent) => (
            <ContactTimelineItem key={log.id} log={log} />
          ))}
        </div>
      </div>
    </div>
  )
}
