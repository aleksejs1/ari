import { useQuery } from '@tanstack/react-query'
import { format } from 'date-fns'
import { Loader2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { api } from '@/lib/axios'
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
const formatDateString = (dateStr: string): string => {
  try {
    return format(new Date(dateStr), 'PPP')
  } catch {
    return dateStr
  }
}

/**
 * Format a date value from various date object structures.
 */
const formatDateValue = (obj: Record<string, unknown>): string | null => {
  const dateField = obj.date

  if (typeof dateField === 'object' && isDateTimeObject(dateField)) {
    return formatDateString(dateField.date)
  }

  if (typeof dateField === 'string') {
    return formatDateString(dateField)
  }

  return null
}

/**
 * Format an array value by recursively formatting each element.
 */
const formatArrayValue = (val: unknown[]): string => {
  return val.map(formatChangeValue).join(' → ')
}

/**
 * Format an object value, handling date objects and other structures.
 */
const formatObjectValue = (obj: Record<string, unknown>): string => {
  // Try to format as date object with date field
  if (obj.date) {
    const formatted = formatDateValue(obj)
    if (formatted) {
      return formatted
    }
  }

  // Try to format as direct DateTime object
  if (isDateTimeObject(obj)) {
    return formatDateString(obj.date)
  }

  // Fallback to JSON representation
  return JSON.stringify(obj)
}

/**
 * Helper to format change values, handling nested DateTime objects from API.
 */
const formatChangeValue = (val: unknown): string => {
  if (val === null || val === undefined) {
    return ''
  }

  if (typeof val === 'object') {
    if (Array.isArray(val)) {
      return formatArrayValue(val)
    }

    return formatObjectValue(val as Record<string, unknown>)
  }

  return String(val)
}

const getLogLabelByAction = (type: string, action: string): string => {
  if (action === 'INSERT') {
    if (type === 'Contact') {
      return 'Contact created'
    }
    if (type === 'ContactName') {
      return 'Name added'
    }
    if (type === 'ContactDate') {
      return 'Date added'
    }
  }

  if (action === 'UPDATE') {
    if (type === 'ContactName') {
      return 'Name changed'
    }
    if (type === 'ContactDate') {
      return 'Date changed'
    }
  }

  return `${action} ${type}`
}

const getLogLabel = (log: TimelineEvent): string => {
  const { action, entityType } = log
  const type = entityType.replace(/^App\\Entity\\/, '')
  return getLogLabelByAction(type, action)
}

const getLogInsertDetails = (log: TimelineEvent): string | null => {
  const { action, entityType, snapshotAfter } = log
  if (action !== 'INSERT' || !snapshotAfter) {
    return null
  }

  const type = entityType.replace(/^App\\Entity\\/, '')

  if (type === 'ContactName') {
    const family = (snapshotAfter.family as string) || ''
    const given = (snapshotAfter.given as string) || ''
    return `${family} ${given}`.trim()
  }

  if (type === 'ContactDate') {
    const dateVal = snapshotAfter.date
    const dateStr = dateVal ? formatChangeValue({ date: dateVal }) : ''
    const labelText = (snapshotAfter.text as string) || ''
    return `${dateStr} (${labelText})`
  }

  return null
}

interface ContactTimelineProps {
  contactId: string
}

export function ContactTimeline({ contactId }: ContactTimelineProps) {
  const { t } = useTranslation()

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
      <div className="flex justify-center p-4">
        <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4 text-center text-sm text-red-500">
        {t('errors.failedToLoadTimeline', 'Failed to load history')}
      </div>
    )
  }

  const logs = Array.isArray(timeline?.logs) ? timeline.logs : []

  if (logs.length === 0) {
    return (
      <div className="p-4 text-center text-sm text-gray-500">
        {t('contacts.noHistory', 'No history available')}
      </div>
    )
  }

  return (
    <div className="mt-6 border-t pt-4">
      <h3 className="mb-3 text-sm font-medium">{t('contacts.timeline', 'Activity History')}</h3>
      <div className="h-[300px] overflow-y-auto pr-4">
        <div className="relative ml-2 space-y-6 border-l border-gray-200 pb-4">
          {logs.map((log: TimelineEvent) => {
            const insertDetails = getLogInsertDetails(log)
            const changes = log.changes || {}
            const hasChanges = Object.keys(changes).length > 0

            return (
              <div key={log.id} className="relative mb-6 ml-4">
                <span className="absolute -left-[21px] top-1 h-2.5 w-2.5 rounded-full bg-gray-300 ring-4 ring-white" />
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-gray-500">
                    {format(new Date(log.createdAt), 'PPP p')}
                  </span>
                  <p className="text-sm font-medium text-gray-900">{getLogLabel(log)}</p>

                  {insertDetails ? (
                    <div className="mt-1 rounded bg-gray-50 p-2 text-xs text-gray-600">
                      {insertDetails}
                    </div>
                  ) : null}

                  {hasChanges ? (
                    <div className="mt-1 rounded bg-gray-50 p-2 text-xs text-gray-600">
                      {Object.entries(changes).map(([key, val]) => (
                        <div key={key}>
                          <span className="font-semibold">{key}:</span> {formatChangeValue(val)}
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
