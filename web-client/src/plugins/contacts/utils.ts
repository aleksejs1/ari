export type { HydraCollection } from '@/lib/api/hydra'
export { getHydraMember, getHydraPagination } from '@/lib/api/hydra'

import type { Contact } from '@/types/models'

export interface TypedColumnSpec {
  baseField: 'contactNames' | 'phoneNumbers' | 'contactEmailAdresses' | 'contactDates'
  qualifier: string // locale for names, type string for phones/emails, text for dates
  id: string // `${baseField}:${qualifier}`
  label: string // human-readable label e.g. "Mobile phone"
}

export type FormatDate = (date: Date | string | null | undefined) => string

function getPhoneValue(contact: Contact, spec: TypedColumnSpec): string {
  return contact.phoneNumbers?.find((p) => p.type === spec.qualifier)?.value ?? '—'
}

function getEmailValue(contact: Contact, spec: TypedColumnSpec): string {
  return contact.contactEmailAdresses?.find((e) => e.type === spec.qualifier)?.value ?? '—'
}

function getNameValue(contact: Contact, spec: TypedColumnSpec): string {
  const name = contact.contactNames?.find((n) => n.locale === spec.qualifier)
  if (!name) {
    return '—'
  }
  return [name.given, name.family].filter(Boolean).join(' ') || '—'
}

function getDateValue(contact: Contact, spec: TypedColumnSpec, formatDate: FormatDate): string {
  const raw = contact.contactDates?.find((d) => d.text === spec.qualifier)?.date
  return raw ? formatDate(raw) : '—'
}

export function renderTypedCell(
  contact: Contact,
  spec: TypedColumnSpec,
  formatDate: FormatDate,
): string {
  switch (spec.baseField) {
    case 'phoneNumbers':
      return getPhoneValue(contact, spec)
    case 'contactEmailAdresses':
      return getEmailValue(contact, spec)
    case 'contactNames':
      return getNameValue(contact, spec)
    case 'contactDates':
      return getDateValue(contact, spec, formatDate)
    default:
      return '—'
  }
}
