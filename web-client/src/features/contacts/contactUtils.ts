import { formatApiDate } from '@/lib/utils'
import {
  type Contact,
  type ContactFormValues,
  type ContactAddress,
  type ContactBiography,
} from '@/types/models'

export function mapContactToFormValues(contact: Contact): ContactFormValues {
  return {
    contactNames: (contact.contactNames ?? []).map((n) => ({
      id: n.id?.toString(),
      '@id': n['@id'],
      '@type': 'ContactName',
      given: n.given ?? '',
      family: n.family ?? '',
    })),
    contactDates: (contact.contactDates ?? []).map((d) => ({
      id: d.id?.toString(),
      '@id': d['@id'],
      '@type': 'ContactDate',
      date: d.date ?? formatApiDate(new Date()),
      text: d.text ?? '',
    })),
    phoneNumbers: (contact.phoneNumbers ?? []).map((p) => ({
      id: p.id?.toString(),
      '@id': p['@id'],
      '@type': 'ContactPhoneNumber',
      value: p.value ?? '',
      type: p.type ?? '',
    })),
    contactEmailAdresses: (contact.contactEmailAdresses ?? []).map((e) => ({
      id: e.id?.toString(),
      '@id': e['@id'],
      '@type': 'ContactEmailAdress',
      value: e.value ?? '',
      type: e.type ?? '',
    })),
    contactAddresses: ((contact.contactAddresses as ContactAddress[]) ?? []).map((a) => ({
      id: a.id?.toString(),
      '@id': a['@id'],
      '@type': 'ContactAddress',
      type: a.type ?? '',
      street: a.street ?? '',
      streetExtended: a.streetExtended ?? '',
      city: a.city ?? '',
      region: a.region ?? '',
      postalCode: a.postalCode ?? '',
      country: a.country ?? '',
      countryCode: a.countryCode ?? '',
    })),
    contactOrganizations: (contact.contactOrganizations ?? []).map((o) => ({
      id: o.id?.toString(),
      '@id': o['@id'],
      '@type': 'ContactOrganization',
      name: o.name ?? '',
      title: o.title ?? '',
      department: o.department ?? '',
      description: o.description ?? '',
      jobDescription: o.jobDescription ?? '',
      startDate: o.startDate ?? '',
      endDate: o.endDate ?? '',
      type: o.type ?? '',
    })),
    contactGroups: (contact.contactGroups ?? []).map((g) => ({
      id: g.id,
      '@id': g['@id'],
      '@type': 'ContactGroup',
      groupResource:
        typeof g.groupResource === 'object' && g.groupResource?.['@id']
          ? (g.groupResource['@id'] as string)
          : (g.groupResource as unknown as string),
    })),
    contactBiographies: ((contact.contactBiographies as ContactBiography[]) ?? []).map((b) => ({
      id: b.id?.toString(),
      '@id': b['@id'],
      '@type': 'ContactBiography',
      value: b.value ?? '',
      type: b.type ?? '',
    })),
    contactRelations: (contact.contactRelations ?? []).map((r) => ({
      id: r.id?.toString(),
      '@id': r['@id'],
      '@type': 'ContactRelation',
      relatedContact: r.relatedContact,
      type: r.type,
      displayName: r.displayName,
    })),
  }
}
