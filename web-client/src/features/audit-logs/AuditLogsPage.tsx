import { useQuery } from '@tanstack/react-query'
import { type TFunction } from 'i18next'
import { Loader2, History, User } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useNavigate } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import { api } from '@/lib/axios'
import { formatLocalizedDate, formatLocalizedDateTime } from '@/lib/utils'
import { type TimelineEvent } from '@/types/models'

const getLogDescription = (log: TimelineEvent, t: TFunction): string => {
  const { action, entityType } = log
  const type = entityType.replace(/^App\\Entity\\/, '')
  const key = `auditLogs.entities.${type}.${action}`
  const translated = t(key)

  if (translated !== key) {
    return translated
  }

  // Fallback to generic format if specific translation is missing
  return `${action} ${type}`
}

const getDirectContactId = (
  entityType: string,
  entityId: string | number | undefined,
): string | null => {
  const type = entityType.replace(/^App\\Entity\\/, '')
  if (type === 'Contact' && entityId) {
    return entityId.toString()
  }
  return null
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

const getContactId = (log: TimelineEvent): string | null => {
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

/**
 * Check if a specific value represents a contact ID
 */
const extractIdFromValue = (key: string, val: unknown): string | null => {
  if (typeof val === 'string' && val.startsWith('/api/contacts/')) {
    return val.split('/').pop() ?? null
  }
  if ((key === 'contact' || key === 'contactId' || key === 'owner') && looksLikeId(val)) {
    return val ? String(val) : null
  }
  return null
}

/**
 * Recursively search for a contact IRI in an object.
 */
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

/**
 * Detect if a value looks like a contact ID (numeric or UUID string).
 */
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

/**
 * Extract contact ID from a string (URI or raw ID).
 */
const extractStringId = (val: string): string | null => {
  if (val.startsWith('/api/contacts/')) {
    return val.split('/').pop() ?? null
  }
  return looksLikeId(val) ? val : null
}

/**
 * Extract contact ID from an object's contact or owner field.
 */
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

/**
 * Format an array of values, recursively calling formatChangeValue.
 */
const formatArrayValue = (
  arr: unknown[],
  language: string,
  fieldName?: string,
): React.ReactElement | null => {
  return (
    <span className="flex flex-wrap gap-1">
      {arr.map((v, i) => (
        <span key={i}>
          {i > 0 && <span className="mx-1 text-gray-400">→</span>}
          {formatChangeValue(v, language, fieldName)}
        </span>
      ))}
    </span>
  )
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
 * Format a date string within an object.
 */
const formatDateValue = (dateStr: string, language: string): React.ReactElement | null => {
  try {
    return <>{formatLocalizedDate(dateStr, language)}</>
  } catch {
    return <>{dateStr}</>
  }
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
 * Format a general object, filtering internal fields.
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

  // 2. Check if it's a date object
  if (obj.date && typeof obj.date === 'string') {
    return formatDateValue(obj.date, language)
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

/**
 * Handle string values, specifically looking for contact URIs and ID-like strings in contact fields.
 */
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

/**
 * Main helper to format change values with clickable contact links and ID filtering.
 */
const formatChangeValue = (
  val: unknown,
  language: string,
  fieldName?: string,
): React.ReactElement | null => {
  if (val === null || val === undefined) {
    return <></>
  }

  if (Array.isArray(val)) {
    return formatArrayValue(val, language, fieldName)
  }

  if (typeof val === 'object') {
    return formatObjectValue(val as Record<string, unknown>, language, fieldName)
  }

  return formatStringValue(String(val), fieldName)
}

interface AuditLogCollection {
  member: TimelineEvent[]
  totalItems: number
}

const getBadgeStyles = (action: string): string => {
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

const LogItem = ({ log, language }: { log: TimelineEvent; language: string }) => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const contactId = getContactId(log)
  const isContactRelated = !!contactId

  const filterFields = (obj: Record<string, unknown> | null | undefined) => {
    if (!obj) {
      return []
    }
    return Object.entries(obj).filter(
      ([key]) => !['id', '@id', '@type', 'user', 'tenant'].includes(key),
    )
  }

  return (
    <div className="dark:hover:bg-gray-750 p-6 transition-colors hover:bg-gray-50">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1 space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`inline-flex items-center rounded px-2 py-0.5 text-xs font-semibold leading-5 ${getBadgeStyles(
                log.action,
              )}`}
            >
              {getLogDescription(log, t)}
            </span>
            {!isContactRelated ? (
              <span className="text-xs text-gray-400">#{log.entityId}</span>
            ) : null}
          </div>
          <div className="text-sm text-gray-500">
            {formatLocalizedDateTime(log.createdAt, language)}
          </div>
        </div>

        {isContactRelated ? (
          <div className="flex shrink-0 items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="h-8 gap-1.5"
              onClick={() => navigate(`/contacts/${contactId}`)}
            >
              <User className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">{t('common.viewDetails')}</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 gap-1.5 text-gray-500 hover:text-blue-600"
              onClick={() => navigate(`/contacts/${contactId}/timeline`)}
              title={t('auditLogs.viewTimeline')}
            >
              <History className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">{t('auditLogs.timeline')}</span>
            </Button>
          </div>
        ) : null}
      </div>

      {log.changes && filterFields(log.changes as Record<string, unknown>).length > 0 ? (
        <div className="mt-4 rounded-md bg-gray-50 p-4 text-sm dark:bg-gray-900">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {filterFields(log.changes as Record<string, unknown>).map(([key, val]) => (
              <div key={key} className="break-all">
                <span className="font-semibold text-gray-700 dark:text-gray-300">{key}:</span>{' '}
                <span className="text-gray-600 dark:text-gray-400">
                  {formatChangeValue(val, language, key)}
                </span>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {log.action === 'REMOVE' && log.snapshotBefore ? (
        <div className="mt-4">
          <div className="mb-1 text-xs font-semibold uppercase tracking-wider text-gray-500">
            {t('auditLogs.snapshotBeforeRemoval')}
          </div>
          <div className="rounded-md border border-red-100 bg-red-50 p-4 text-sm dark:border-red-900/30 dark:bg-red-900/20">
            <div className="grid grid-cols-1 gap-x-4 gap-y-2 sm:grid-cols-2">
              {filterFields(log.snapshotBefore).map(([key, val]) => (
                <div key={key} className="break-all">
                  <span className="font-semibold text-red-800 dark:text-red-300">{key}:</span>{' '}
                  <span className="text-red-700 dark:text-red-400">
                    {formatChangeValue(val, language, key)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : null}

      {log.action === 'INSERT' && log.snapshotAfter ? (
        <div className="mt-4">
          <div className="mb-1 text-xs font-semibold uppercase tracking-wider text-gray-500">
            {t('auditLogs.snapshotAfterInsertion')}
          </div>
          <div className="rounded-md border border-green-100 bg-green-50 p-4 text-sm dark:border-green-900/30 dark:bg-green-900/20">
            <div className="grid grid-cols-1 gap-x-4 gap-y-2 sm:grid-cols-2">
              {filterFields(log.snapshotAfter).map(([key, val]) => (
                <div key={key} className="break-all">
                  <span className="font-semibold text-green-800 dark:text-green-300">{key}:</span>{' '}
                  <span className="text-green-700 dark:text-green-400">
                    {formatChangeValue(val, language, key)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}

const LogList = ({
  logs,
  isPlaceholderData,
  t,
  language,
}: {
  logs: TimelineEvent[]
  isPlaceholderData: boolean
  t: TFunction
  language: string
}) => {
  if (logs.length === 0) {
    return <div className="p-12 text-center text-gray-500">{t('auditLogs.noLogs')}</div>
  }

  return (
    <div
      className={`divide-y divide-gray-200 dark:divide-gray-700 ${
        isPlaceholderData ? 'opacity-50' : ''
      }`}
    >
      {logs.map((log) => (
        <LogItem key={log.id} log={log} language={language} />
      ))}
    </div>
  )
}

export default function AuditLogsPage() {
  const { t, i18n } = useTranslation()
  const language = i18n.language
  const [page, setPage] = useState(1)

  const {
    data: logsData,
    isLoading,
    isPlaceholderData,
    error,
  } = useQuery({
    queryKey: ['audit-logs', page],
    queryFn: async () => {
      const res = await api.get<AuditLogCollection>(
        `/audit_logs?page=${page}&order%5BcreatedAt%5D=desc`,
      )
      return res.data
    },
    placeholderData: (previousData) => previousData,
  })

  if (isLoading) {
    return (
      <div className="flex justify-center p-12">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    )
  }

  if (error) {
    return <div className="p-12 text-center text-red-500">{t('errors.failedToLoadLogs')}</div>
  }

  const logs = logsData?.member || []
  const totalItems = logsData?.totalItems || 0
  const ITEMS_PER_PAGE = 30
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <History className="h-8 w-8 text-blue-500" />
          <h1 className="text-3xl font-bold tracking-tight">{t('auditLogs.title')}</h1>
        </div>
        <div className="text-sm text-gray-500">
          {t('auditLogs.totalCount', { count: totalItems })}
        </div>
      </div>

      <div className="flex min-h-[400px] flex-col overflow-hidden rounded-lg bg-white shadow dark:bg-gray-800">
        <div className="flex-1">
          <LogList logs={logs} isPlaceholderData={isPlaceholderData} t={t} language={language} />
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-gray-200 bg-gray-50 px-6 py-4 dark:border-gray-700 dark:bg-gray-800/50">
            <div className="text-sm text-gray-700 dark:text-gray-300">
              {t('pagination.pageInfo', {
                current: page,
                total: totalPages,
              })}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1 || isPlaceholderData}
                className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
              >
                {t('pagination.previous')}
              </button>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages || isPlaceholderData}
                className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
              >
                {t('pagination.next')}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
