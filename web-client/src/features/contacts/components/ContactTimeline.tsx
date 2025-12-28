import { useQuery } from '@tanstack/react-query'
import { type TFunction } from 'i18next'
import { Loader2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

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
 * Safely format a date string, returning a fragment or null.
 */
const formatDateString = (dateStr: string, language: string): React.ReactElement | null => {
  try {
    return <>{formatLocalizedDate(dateStr, language)}</>
  } catch {
    return <>{dateStr}</>
  }
}

/**
 * Format a contact reference object as a clickable link.
 */
const formatContactValue = (val: Record<string, unknown>): React.ReactElement | null => {
  const cid = val.id || (val['@id'] as string)?.split('/').pop()
  if (!cid) {
    return null
  }

  const label = val.displayName || (val as { name?: string }).name || `Contact #${cid}`

  return (
    <Link to={`/contacts/${cid}`} className="text-blue-600 underline hover:text-blue-800">
      <>{label}</>
    </Link>
  )
}

/**
 * Check if a value looks like a contact ID.
 */
const looksLikeId = (val: unknown): boolean => {
  if (typeof val === 'number') {
    return true
  }
  if (typeof val === 'string') {
    return (
      /^\d+$/.test(val) ||
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(val)
    )
  }
  return false
}

/**
 * Format an array value by recursively formatting each element.
 */
const formatArrayValue = (
  val: unknown[],
  language: string,
  fieldName?: string,
): React.ReactElement | null => {
  return (
    <span className="flex flex-wrap gap-1">
      {val.map((v, i) => (
        <span key={i}>
          {i > 0 && <span className="mx-1 text-gray-400">→</span>}
          {formatChangeValue(v, language, fieldName)}
        </span>
      ))}
    </span>
  )
}

/**
 * Check if an object is a contact reference.
 */
const isContactReference = (obj: Record<string, unknown>, fieldName?: string): boolean => {
  return (
    fieldName === 'contact' ||
    fieldName === 'owner' ||
    obj['@type'] === 'Contact' ||
    (obj['@id'] as string)?.startsWith('/api/contacts/') ||
    (!!obj.id && (!!obj.displayName || (obj as { name?: string }).name !== undefined))
  )
}

/**
 * Format an object value, handling date objects, contact references, and other structures.
 */
const formatObjectValue = (
  obj: Record<string, unknown>,
  language: string,
  fieldName?: string,
): React.ReactElement | null => {
  // 1. Check if it's a contact reference
  if (isContactReference(obj, fieldName)) {
    const link = formatContactValue(obj)
    if (link) {
      return link
    }
  }

  // 2. Check for date fields
  if (obj.date) {
    const dateField = obj.date
    if (typeof dateField === 'object' && isDateTimeObject(dateField)) {
      return formatDateString(dateField.date, language)
    }
    if (typeof dateField === 'string') {
      return formatDateString(dateField, language)
    }
  }

  // 3. Check if it's a direct DateTime object
  if (isDateTimeObject(obj)) {
    return formatDateString(obj.date, language)
  }

  // Fallback to JSON
  return <>{JSON.stringify(obj)}</>
}

/**
 * Handle string values, specifically looking for contact URIs and ID-like strings in contact fields.
 */
const formatStringValue = (val: string, fieldName?: string): React.ReactElement | null => {
  if (val.startsWith('/api/contacts/')) {
    const cid = val.split('/').pop()
    if (cid && cid !== 'undefined' && cid !== 'null') {
      return (
        <Link to={`/contacts/${cid}`} className="text-blue-600 underline hover:text-blue-800">
          {`Contact #${cid}`}
        </Link>
      )
    }
  }

  if ((fieldName === 'contact' || fieldName === 'owner') && looksLikeId(val)) {
    return (
      <Link to={`/contacts/${val}`} className="text-blue-600 underline hover:text-blue-800">
        {`Contact #${val}`}
      </Link>
    )
  }

  return <>{val}</>
}

/**
 * Helper to format change values, handling nested objects, contact references, and dates.
 */
const formatChangeValue = (
  val: unknown,
  language: string,
  fieldName?: string,
): React.ReactElement | null => {
  if (val === null || val === undefined) {
    return <></>
  }

  if (typeof val === 'object') {
    if (Array.isArray(val)) {
      return formatArrayValue(val as unknown[], language, fieldName)
    }
    return formatObjectValue(val as Record<string, unknown>, language, fieldName)
  }

  return formatStringValue(String(val), fieldName)
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
  fullHeight?: boolean
}

export function ContactTimeline({ contactId, fullHeight }: ContactTimelineProps) {
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
    <div className={fullHeight ? '' : 'mt-6 border-t pt-4'}>
      {!fullHeight && (
        <h3 className="mb-3 text-sm font-medium">{t('contacts.history.timeline')}</h3>
      )}
      <div className={fullHeight ? 'pr-4' : 'h-[300px] overflow-y-auto pr-4'}>
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
                            {formatChangeValue(val, language, key)}
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
