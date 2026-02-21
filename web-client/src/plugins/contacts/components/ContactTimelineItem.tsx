import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { History } from 'lucide-react'

import { formatLocalizedDateTime } from '@/lib/utils'
import { type TimelineEvent } from '@/types/models'

import { ContactSnapshotModal } from './ContactSnapshotModal'
import {
  formatChangeValue,
  getBadgeStyles,
  getLogLabel,
  getLogSnapshotDetails,
} from './timelineUtils'

interface ContactTimelineItemProps {
  log: TimelineEvent
  contactId: string
}

export function ContactTimelineItem({ log, contactId }: ContactTimelineItemProps) {
  const { t, i18n } = useTranslation('contacts')
  const language = i18n.language
  const [snapshotOpen, setSnapshotOpen] = useState(false)

  const snapshotDetails = getLogSnapshotDetails(log, language)
  const changes = log.changes || {}
  const hasChanges = Object.keys(changes).length > 0

  return (
    <div className="relative mb-6 ml-4">
      <span className="absolute -left-[21px] top-1 h-2.5 w-2.5 rounded-full bg-gray-300 ring-4 ring-white" />
      <div className="flex flex-col items-start gap-2">
        <div className="flex w-full items-center justify-between">
          <span className="text-xs text-gray-500">
            {formatLocalizedDateTime(log.createdAt, language)}
          </span>
          <button
            type="button"
            onClick={() => setSnapshotOpen(true)}
            className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
            title={t('history.viewSnapshot')}
          >
            <History className="h-3.5 w-3.5" />
          </button>
        </div>
        <span className={`rounded px-2 py-0.5 text-sm font-semibold ${getBadgeStyles(log.action)}`}>
          {getLogLabel(log, t)}
        </span>

        {snapshotDetails ? (
          <div className="mt-1 w-full rounded bg-gray-50 p-2 text-xs text-gray-600">
            {snapshotDetails}
          </div>
        ) : null}

        {hasChanges ? (
          <div className="mt-1 w-full rounded bg-gray-50 p-2 text-xs text-gray-600">
            {Object.entries(changes)
              .filter(([key]) => key !== 'user' && key !== 'tenant')
              .map(([key, val]) => (
                <div key={key}>
                  <span className="font-semibold">{key}</span>:{' '}
                  {formatChangeValue(val, language, key)}
                </div>
              ))}
          </div>
        ) : null}
      </div>

      <ContactSnapshotModal
        open={snapshotOpen}
        onOpenChange={setSnapshotOpen}
        contactId={contactId}
        logId={log.id}
        logDate={log.createdAt}
      />
    </div>
  )
}
