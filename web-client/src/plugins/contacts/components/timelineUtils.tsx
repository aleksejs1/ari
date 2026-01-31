import { Link } from 'react-router-dom'
import { type TFunction } from 'i18next'

import { formatLocalizedDate } from '@/lib/utils'
import { type ContactOrganization, type TimelineEvent } from '@/types/models'

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

  const label = val.displayName || (val as { name?: string }).name || `Contact #${cid} `

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

  if (val.startsWith('/api/groups/')) {
    const gid = val.split('/').pop()
    if (gid) {
      return <>{`Group #${gid} `}</>
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
 * Format an object value, handling date objects, contact references, and other structures.
 */
const formatObjectValue = (
  obj: Record<string, unknown>,
  language: string,
  fieldName?: string,
): React.ReactElement | null => {
  if (isContactReference(obj, fieldName)) {
    return formatContactValue(obj)
  }

  // Check for date fields
  if (obj.date) {
    if (typeof obj.date === 'object' && isDateTimeObject(obj.date)) {
      return formatDateString(obj.date.date, language)
    }
    if (typeof obj.date === 'string') {
      return formatDateString(obj.date, language)
    }
  }

  if (isDateTimeObject(obj)) {
    return formatDateString(obj.date, language)
  }

  // Fallback to JSON
  const filtered = Object.entries(obj)
    .filter(([key]) => !['id', '@id', '@type', 'user', 'tenant'].includes(key))
    .reduce((acc, [key, val]) => ({ ...acc, [key]: val }), {})

  if (Object.keys(filtered).length === 0) {
    return null
  }

  return <>{JSON.stringify(filtered)}</>
}

/**
 * Format an array value by recursively formatting each element.
 */
const formatArrayValue = (
  val: unknown[],
  language: string,
  fieldName?: string,
  recursiveFormatter?: (
    val: unknown,
    language: string,
    fieldName?: string,
  ) => React.ReactElement | null,
): React.ReactElement | null => {
  return (
    <span className="flex flex-wrap gap-1">
      {val.map((v, i) => (
        <span key={i}>
          {i > 0 && <span className="mx-1 text-gray-400">→</span>}
          {recursiveFormatter ? recursiveFormatter(v, language, fieldName) : JSON.stringify(v)}
        </span>
      ))}
    </span>
  )
}

/**
 * Helper to format change values, handling nested objects, contact references, and dates.
 */
export const formatChangeValue = (
  val: unknown,
  language: string,
  fieldName?: string,
): React.ReactElement | null => {
  if (val === null || val === undefined) {
    return <></>
  }

  if (typeof val === 'object') {
    if (Array.isArray(val)) {
      return formatArrayValue(val as unknown[], language, fieldName, formatChangeValue)
    }
    return formatObjectValue(val as Record<string, unknown>, language, fieldName)
  }

  return formatStringValue(String(val), fieldName)
}

export const getLogLabel = (log: TimelineEvent, t: TFunction): string => {
  const { action, entityType } = log
  const type = entityType.replace(/^Ari\\Entity\\/, '')
  return t(`contacts.history.actions.${type}.${action} `, `${action} ${type} `)
}

const getContactNameLabel = (snapshot: Record<string, unknown>) => {
  return `${(snapshot.family as string) || ''} ${(snapshot.given as string) || ''} `.trim()
}

const getContactDateLabel = (snapshot: Record<string, unknown>, language: string) => {
  const dateStr = snapshot.date ? formatChangeValue({ date: snapshot.date }, language) : ''
  return (
    <>
      {dateStr} ({(snapshot.text as string) || ''})
    </>
  )
}

const getContactValueTypeLabel = (snapshot: Record<string, unknown>) => {
  return (
    <>
      {(snapshot.value as string) || ''} ({(snapshot.type as string) || ''})
    </>
  )
}

const getContactAddressLabel = (snapshot: Record<string, unknown>) => {
  const parts = [
    snapshot.street,
    snapshot.streetExtended,
    snapshot.postalCode,
    snapshot.city,
    snapshot.region,
    snapshot.country,
  ]
    .filter(Boolean)
    .join(', ')

  return (
    <>
      {parts} ({(snapshot.type as string) || ''})
    </>
  )
}

const getContactOrganizationLabel = (
  snapshot: Record<string, unknown> | ContactOrganization,
  language: string,
) => {
  const parts = [snapshot.name, snapshot.title, snapshot.department].filter(Boolean).join(', ')

  // Format dates if present
  const start =
    snapshot.startDate && !isNaN(new Date(snapshot.startDate as string).getTime())
      ? formatLocalizedDate(snapshot.startDate as string, language)
      : ''
  const end =
    snapshot.endDate && !isNaN(new Date(snapshot.endDate as string).getTime())
      ? formatLocalizedDate(snapshot.endDate as string, language)
      : ''
  let dates = ''
  if (start || end) {
    const range = end ? ` - ${end}` : ''
    dates = `(${start}${range})`
  }

  return (
    <>
      {parts} {dates} ({(snapshot.type as string) || ''})
    </>
  )
}

export const getLogSnapshotDetails = (
  log: TimelineEvent,
  language: string,
): React.ReactElement | null => {
  const { action, entityType, snapshotAfter, snapshotBefore } = log
  const snapshot = (action === 'INSERT' ? snapshotAfter : snapshotBefore) as Record<
    string,
    unknown
  > | null

  if (!snapshot) {
    return null
  }

  const type = entityType.replace(/^Ari\\Entity\\/, '')

  const renderers: Record<string, () => React.ReactElement | null> = {
    ContactName: () => <>{getContactNameLabel(snapshot)}</>,
    ContactDate: () => getContactDateLabel(snapshot, language),
    ContactPhoneNumber: () => getContactValueTypeLabel(snapshot),
    ContactEmailAdress: () => getContactValueTypeLabel(snapshot),
    ContactAddress: () => getContactAddressLabel(snapshot),
    ContactOrganization: () => getContactOrganizationLabel(snapshot, language),
    ContactBiography: () => getContactValueTypeLabel(snapshot),
    ContactGroup: () => (
      <>
        {(snapshot.groupResource as { name?: string })?.name ||
          (snapshot.groupResource as string) ||
          ''}
      </>
    ),
  }

  return renderers[type] ? renderers[type]() : null
}

export const getBadgeStyles = (action: string): string => {
  switch (action) {
    case 'INSERT':
      return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
    case 'UPDATE':
      return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
    case 'REMOVE':
      return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
    default:
      return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
  }
}
