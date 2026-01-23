import { API_ORIGIN } from '@/lib/axios'
import { formatApiDate } from '@/lib/utils'
import { type Contact, type ContactFormValues, type ContactAvatar } from '@/types/models'

export function getContactAvatarUrl(
  avatar?: ContactAvatar | null,
  fullSize = false,
): string | null {
  if (!avatar) {
    return null
  }

  if (!fullSize) {
    const thumbnail = (avatar as any).thumbnailDataEncoded
    if (thumbnail) {
      const mimeType = (avatar as any).mimeType || 'image/jpeg'
      return `data:${mimeType};base64,${thumbnail}`
    }
  }

  const url = (avatar as any).contentUrl || avatar.path
  if (!url) {
    return null
  }

  if (url.startsWith('http')) {
    return url
  }

  if (url.startsWith('/')) {
    return `${API_ORIGIN}${url}`
  }

  return `${API_ORIGIN}/uploads/avatars/${url}`
}

export function mapContactToFormValues(contact: Contact): ContactFormValues {
  return {
    '@id': contact['@id'],
    avatar: contact.avatar as any,
    contactNames: (Array.isArray(contact.contactNames) ? contact.contactNames : []).map((n) => ({
      id: n.id?.toString(),
      '@id': n['@id'],
      '@type': 'ContactName',
      given: n.given ?? '',
      family: n.family ?? '',
    })),
    contactDates: (Array.isArray(contact.contactDates) ? contact.contactDates : []).map((d) => ({
      id: d.id?.toString(),
      '@id': d['@id'],
      '@type': 'ContactDate',
      date: d.date ?? formatApiDate(new Date()),
      text: d.text ?? '',
    })),
    phoneNumbers: (Array.isArray(contact.phoneNumbers) ? contact.phoneNumbers : []).map((p) => ({
      id: p.id?.toString(),
      '@id': p['@id'],
      '@type': 'ContactPhoneNumber',
      value: p.value ?? '',
      type: p.type ?? '',
    })),
    contactEmailAdresses: (Array.isArray(contact.contactEmailAdresses)
      ? contact.contactEmailAdresses
      : []
    ).map((e) => ({
      id: e.id?.toString(),
      '@id': e['@id'],
      '@type': 'ContactEmailAdress',
      value: e.value ?? '',
      type: e.type ?? '',
    })),
    contactAddresses: (Array.isArray(contact.contactAddresses) ? contact.contactAddresses : []).map(
      (a) => ({
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
      }),
    ),
    contactOrganizations: (Array.isArray(contact.contactOrganizations)
      ? contact.contactOrganizations
      : []
    ).map((o) => ({
      id: o.id?.toString(),
      '@id': o['@id'],
      '@type': 'ContactOrganization',
      name: o.name ?? '',
      title: o.title ?? '',
      department: o.department ?? '',
      description: (o as any).description ?? '',
      jobDescription: o.jobDescription ?? '',
      startDate: o.startDate ?? '',
      endDate: o.endDate ?? '',
      type: o.type ?? '',
    })),
    contactGroups: (Array.isArray(contact.contactGroups) ? contact.contactGroups : []).map((g) => ({
      id: g.id,
      '@id': g['@id'],
      '@type': 'ContactGroup',
      groupResource:
        typeof g.groupResource === 'object' && g.groupResource?.['@id']
          ? (g.groupResource['@id'] as string)
          : (g.groupResource as unknown as string),
    })),
    contactBiographies: (Array.isArray(contact.contactBiographies)
      ? contact.contactBiographies
      : []
    ).map((b) => ({
      id: b.id?.toString(),
      '@id': b['@id'],
      '@type': 'ContactBiography',
      value: b.value ?? '',
      type: b.type ?? '',
    })),
    contactRelations: (Array.isArray(contact.contactRelations) ? contact.contactRelations : []).map(
      (r) => ({
        id: r.id?.toString(),
        '@id': r['@id'] ?? '',
        '@type': 'ContactRelation',
        relatedContact: r.relatedContact ?? '',
        type: r.type ?? '',
        displayName: r.displayName,
      }),
    ) as any,
  }
}
