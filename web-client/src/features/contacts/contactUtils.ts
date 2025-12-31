import { formatApiDate } from '@/lib/utils'
import { type Contact, type ContactFormValues, type ContactAddress } from '@/types/models'

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
    contactGroups: (contact.contactGroups ?? []).map((g) => ({
      id: g.id,
      '@id': g['@id'],
      '@type': 'ContactGroup',
      groupResource:
        typeof g.groupResource === 'object' && g.groupResource?.['@id']
          ? (g.groupResource['@id'] as string)
          : (g.groupResource as unknown as string),
    })),
  }
}
