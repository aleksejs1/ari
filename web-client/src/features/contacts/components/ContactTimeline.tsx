import { useQuery } from '@tanstack/react-query'
import { type TFunction } from 'i18next'
import { Loader2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { api } from '@/lib/axios'
import { formatLocalizedDate, formatLocalizedDateTime } from '@/lib/utils'
import { type ContactTimeline, type TimelineEvent } from '@/types/models'

const isDateTimeObject = (val: unknown): val is { date: string } => {
  return (
    val !== null &&
    typeof val === 'object' &&
    'date' in val &&
    typeof (val as { date: unknown }).date === 'string'
  )
}

/**
 * Safely format a date string, returning the original string if parsing fails.
 */
const formatDateString = (dateStr: string, language: string): string => {
  try {
    return formatLocalizedDate(dateStr, language)
  } catch {
    return dateStr
  }
}

/**
 * Format a date value from various date object structures.
 */
const formatDateValue = (obj: Record<string, unknown>, language: string): string | null => {
  const dateField = obj.date

  if (typeof dateField === 'object' && isDateTimeObject(dateField)) {
    return formatDateString(dateField.date, language)
  }

  if (typeof dateField === 'string') {
    return formatDateString(dateField, language)
  }

  return null
}

/**
 * Format an array value by recursively formatting each element.
 */
const formatArrayValue = (val: unknown[], language: string): string => {
  return val.map((v) => formatChangeValue(v, language)).join(' → ')
}

/**
 * Format an object value, handling date objects and other structures.
 */
const formatObjectValue = (obj: Record<string, unknown>, language: string): string => {
  // Try to format as date object with date field
  if (obj.date) {
    const formatted = formatDateValue(obj, language)
    if (formatted) {
      return formatted
    }
  }

  // Try to format as direct DateTime object
  if (isDateTimeObject(obj)) {
    return formatDateString(obj.date, language)
  }

  // Fallback to JSON representation
  return JSON.stringify(obj)
}

/**
 * Helper to format change values, handling nested DateTime objects from API.
 */
const formatChangeValue = (val: unknown, language: string): string => {
  if (val === null || val === undefined) {
    return ''
  }

  if (typeof val === 'object') {
    if (Array.isArray(val)) {
      return formatArrayValue(val, language)
    }

    return formatObjectValue(val as Record<string, unknown>, language)
  }

  return String(val)
}

const getLogLabel = (log: TimelineEvent, t: TFunction): string => {
  const { action, entityType } = log
  const type = entityType.replace(/^App\\Entity\\/, '')
  return t(`contacts.history.actions.${type}.${action}`, `${action} ${type}`)
}

const getLogSnapshotDetails = (log: TimelineEvent, language: string): React.ReactElement | null => {
  const { action, entityType, snapshotAfter, snapshotBefore } = log
  const snapshot = (action === 'INSERT' ? snapshotAfter : snapshotBefore) as Record<
    string,
    unknown
  > | null

  if (!snapshot) {
    return null
  }

  const type = entityType.replace(/^App\\Entity\\/, '')

  if (type === 'ContactName') {
    return <>{`${(snapshot.family as string) || ''} ${(snapshot.given as string) || ''}`.trim()}</>
  }

  if (type === 'ContactDate') {
    const dateStr = snapshot.date ? formatChangeValue({ date: snapshot.date }, language) : ''
    return (
      <>
        {dateStr} ({(snapshot.text as string) || ''})
      </>
    )
  }

  return null
}

interface ContactTimelineProps {
  contactId: string
}

export function ContactTimeline({ contactId }: ContactTimelineProps) {
  const { t, i18n } = useTranslation()
  const language = i18n.language

  const {
    data: timeline,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['contacts', contactId, 'timeline'],
    queryFn: async () => {
      const res = await api.get<ContactTimeline>(`/contacts/${contactId}/timeline`)
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
        {t('contacts.history.failedToLoadTimeline')}
      </div>
    )
  }

  const logs = Array.isArray(timeline?.logs) ? timeline.logs : []

  if (logs.length === 0) {
    return (
      <div className="p-4 text-center text-sm text-gray-500">{t('contacts.history.noHistory')}</div>
    )
  }

  return (
    <div className="mt-6 border-t pt-4">
      <h3 className="mb-3 text-sm font-medium">{t('contacts.history.timeline')}</h3>
      <div className="h-[300px] overflow-y-auto pr-4">
        <div className="relative ml-2 space-y-6 border-l border-gray-200 pb-4">
          {logs.map((log: TimelineEvent) => {
            const snapshotDetails = getLogSnapshotDetails(log, language)
            const changes = log.changes || {}
            const hasChanges = Object.keys(changes).length > 0

            return (
              <div key={log.id} className="relative mb-6 ml-4">
                <span className="absolute -left-[21px] top-1 h-2.5 w-2.5 rounded-full bg-gray-300 ring-4 ring-white" />
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-gray-500">
                    {formatLocalizedDateTime(log.createdAt, language)}
                  </span>
                  <p className="text-sm font-medium text-gray-900">{getLogLabel(log, t)}</p>

                  {snapshotDetails ? (
                    <div className="mt-1 rounded bg-gray-50 p-2 text-xs text-gray-600">
                      {snapshotDetails}
                    </div>
                  ) : null}

                  {hasChanges ? (
                    <div className="mt-1 rounded bg-gray-50 p-2 text-xs text-gray-600">
                      {Object.entries(changes)
                        .filter(([key]) => key !== 'user' && key !== 'tenant')
                        .map(([key, val]) => (
                          <div key={key}>
                            <span className="font-semibold">{key}</span>:{' '}
                            {formatChangeValue(val, language)}
                          </div>
                        ))}
                    </div>
                  ) : null}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
