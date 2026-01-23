import { useTranslation } from 'react-i18next'

import { formatLocalizedDateTime } from '@/lib/utils'
import { type TimelineEvent } from '@/types/models'

import {
  formatChangeValue,
  getBadgeStyles,
  getLogLabel,
  getLogSnapshotDetails,
} from './timelineUtils'

interface ContactTimelineItemProps {
  log: TimelineEvent
}

export function ContactTimelineItem({ log }: ContactTimelineItemProps) {
  const { t, i18n } = useTranslation()
  const language = i18n.language

  const snapshotDetails = getLogSnapshotDetails(log, language)
  const changes = log.changes || {}
  const hasChanges = Object.keys(changes).length > 0

  return (
    <div className="relative mb-6 ml-4">
      <span className="absolute -left-[21px] top-1 h-2.5 w-2.5 rounded-full bg-gray-300 ring-4 ring-white" />
      <div className="flex flex-col items-start gap-2">
        <span className="text-xs text-gray-500">
          {formatLocalizedDateTime(log.createdAt, language)}
        </span>
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
    </div>
  )
}
