import { Link } from 'react-router-dom'
import { type TFunction } from 'i18next'

import { formatLocalizedDate } from '@/lib/utils'
import { type TimelineEvent } from '@/types/models'

export const getLogDescription = (log: TimelineEvent, t: TFunction): string => {
  const { action, entityType } = log
  const type = (entityType || '').replace(/^Ari\\Entity\\/, '')
  const key = `auditLogs.entities.${type}.${action}`
  const translated = t(key)

  if (translated !== key) {
    return translated
  }

  // Fallback to generic format if specific translation is missing
  return `${action} ${type}`
}

const getDirectContactId = (
  entityType: string | undefined,
  entityId: string | number | undefined,
): string | null => {
  const type = (entityType || '').replace(/^Ari\\Entity\\/, '')
  if (type === 'Contact' && entityId) {
    return entityId.toString()
  }
  return null
}

const looksLikeId = (val: unknown): boolean => {
  if (typeof val === 'number') {
    return true
  }
  if (typeof val === 'string') {
    // Simple check for numbers or UUID-like strings
    return (
      /^\d+$/.test(val) ||
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(val)
    )
  }
  return false
}

const extractStringId = (val: string): string | null => {
  if (val.startsWith('/api/contacts/')) {
    return val.split('/').pop() ?? null
  }
  return looksLikeId(val) ? val : null
}

const extractFromObject = (obj: Record<string, unknown>): string | null => {
  const target = obj.contact ?? obj.owner

  if (!target) {
    return null
  }

  if (typeof target === 'string') {
    return extractStringId(target)
  }

  if (typeof target === 'number') {
    return target.toString()
  }

  if (typeof target === 'object' && 'id' in target) {
    return (target as { id: string | number }).id.toString()
  }

  return null
}

const extractIdFromValue = (key: string, val: unknown): string | null => {
  if (typeof val === 'string' && val.startsWith('/api/contacts/')) {
    return val.split('/').pop() ?? null
  }
  if ((key === 'contact' || key === 'contactId' || key === 'owner') && looksLikeId(val)) {
    return val ? String(val) : null
  }
  return null
}

const findContactIri = (obj: Record<string, unknown> | null): string | null => {
  if (!obj) {
    return null
  }

  for (const [key, val] of Object.entries(obj)) {
    const id = extractIdFromValue(key, val)
    if (id) {
      return id
    }

    if (val && typeof val === 'object') {
      const found = findInObject(val)
      if (found) {
        return found
      }
    }
  }
  return null
}

const findInArray = (arr: unknown[]): string | null => {
  for (const item of arr) {
    if (item && typeof item === 'object') {
      const found = findContactIri(item as Record<string, unknown>)
      if (found) {
        return found
      }
    }
  }
  return null
}

const findInObject = (val: unknown): string | null => {
  if (Array.isArray(val)) {
    return findInArray(val)
  }
  return findContactIri(val as Record<string, unknown>)
}

const findContactIdInSources = (log: TimelineEvent): string | null => {
  const sources = [
    log.snapshotAfter,
    log.snapshotBefore,
    log.changes,
    log as unknown as Record<string, unknown>,
  ] as Record<string, unknown>[]

  for (const source of sources) {
    const id = extractFromObject(source || {}) || findContactIri(source || {})
    if (id) {
      return id
    }
  }
  return null
}

export const getContactId = (log: TimelineEvent): string | null => {
  const { entityType, entityId, ownerEntityType, ownerEntityId } = log

  // Check direct entity
  const directId = getDirectContactId(entityType, entityId)
  if (directId) {
    return directId
  }

  // Check owner entity
  if (ownerEntityType) {
    const ownerId = getDirectContactId(ownerEntityType, ownerEntityId)
    if (ownerId) {
      return ownerId
    }
  }

  // Deep search
  return findContactIdInSources(log)
}

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

const formatDateValue = (dateStr: string, language: string): React.ReactElement | null => {
  try {
    return <>{formatLocalizedDate(dateStr, language)}</>
  } catch {
    return <>{dateStr}</>
  }
}

const isContactReference = (obj: Record<string, unknown>, fieldName?: string): boolean => {
  return (
    fieldName === 'contact' ||
    fieldName === 'owner' ||
    obj['@type'] === 'Contact' ||
    (obj['@id'] as string)?.startsWith('/api/contacts/') ||
    (!!obj.id && (!!obj.displayName || (obj as { name?: string }).name !== undefined))
  )
}

const isDateTimeObject = (val: unknown): val is { date: string } => {
  return (
    val !== null &&
    typeof val === 'object' &&
    'date' in val &&
    typeof (val as { date: unknown }).date === 'string'
  )
}

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

  // 2. Check if it's a date object
  if (obj.date) {
    if (typeof obj.date === 'object' && isDateTimeObject(obj.date)) {
      return formatDateValue(obj.date.date, language)
    }
    if (typeof obj.date === 'string') {
      return formatDateValue(obj.date, language)
    }
  }

  // 3. Fallback: Filter and stringify (excluding and hiding IDs)
  const filtered = Object.entries(obj)
    .filter(([key]) => !['id', '@id', '@type', 'user', 'tenant'].includes(key))
    .reduce((acc, [key, val]) => ({ ...acc, [key]: val }), {})

  if (Object.keys(filtered).length === 0) {
    return null
  }

  return <>{JSON.stringify(filtered)}</>
}

const formatStringValue = (val: string, fieldName?: string): React.ReactElement | null => {
  // Handle contact URIs
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

  // Handle group URIs
  if (val.startsWith('/api/groups/')) {
    const gid = val.split('/').pop()
    if (gid) {
      return <>{`Group #${gid}`}</>
    }
  }

  // Handle field-based contact linking (id values in 'contact' fields)
  if ((fieldName === 'contact' || fieldName === 'owner') && looksLikeId(val)) {
    return (
      <Link to={`/contacts/${val}`} className="text-blue-600 underline hover:text-blue-800">
        {`Contact #${val}`}
      </Link>
    )
  }

  return <>{val}</>
}

const formatArrayValue = (
  arr: unknown[],
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
      {arr.map((v, i) => (
        <span key={i}>
          {i > 0 && <span className="mx-1 text-gray-400">→</span>}
          {recursiveFormatter ? recursiveFormatter(v, language, fieldName) : JSON.stringify(v)}
        </span>
      ))}
    </span>
  )
}

export const formatChangeValue = (
  val: unknown,
  language: string,
  fieldName?: string,
): React.ReactElement | null => {
  if (val === null || val === undefined) {
    return <></>
  }

  if (Array.isArray(val)) {
    return formatArrayValue(val, language, fieldName, formatChangeValue)
  }

  if (typeof val === 'object') {
    return formatObjectValue(val as Record<string, unknown>, language, fieldName)
  }

  return formatStringValue(String(val), fieldName)
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
