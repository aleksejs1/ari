import { type ContactFormValues, type Group } from '@/types/models'

export const enforceMin = <T>(arr: T[] | undefined, defaultItem: T): T[] => {
  if (!arr || arr.length === 0) {
    return [defaultItem]
  }
  return arr
}

export const processContactGroups = async (
  groups: ContactFormValues['contactGroups'],
  createGroup: (data: { name: string }) => Promise<Group>,
) => {
  const processed: { groupResource: string }[] = []
  if (!groups) {
    return processed
  }

  for (const group of groups) {
    if (typeof group.groupResource === 'object' && group.groupResource.name) {
      try {
        const newGroup = await createGroup({ name: group.groupResource.name })
        if (newGroup['@id']) {
          processed.push({ groupResource: newGroup['@id'] })
        }
      } catch {
        // ignore
      }
    } else if (typeof group.groupResource === 'string') {
      processed.push({ groupResource: group.groupResource })
    }
  }
  return processed
}

export const cleanContactData = (data: ContactFormValues) => {
  const contactRelations = data.contactRelations?.map((relation) => ({
    ...relation,
    relatedContact:
      typeof relation.relatedContact === 'object'
        ? relation.relatedContact['@id']
        : relation.relatedContact,
  }))

  const phoneNumbers = data.phoneNumbers.filter((p) => p.value.trim() !== '')
  const contactEmailAdresses = data.contactEmailAdresses.filter((e) => e.value.trim() !== '')
  const contactBiographies = data.contactBiographies?.filter((b) => b.value.trim() !== '')
  const contactOrganizations = data.contactOrganizations?.filter(
    (o) =>
      o.name?.trim() ||
      o.title?.trim() ||
      o.department?.trim() ||
      o.jobDescription?.trim() ||
      o.startDate ||
      o.endDate,
  )
  const contactAddresses = data.contactAddresses.filter((a) =>
    [a.street, a.streetExtended, a.city, a.region, a.postalCode, a.country].some((v) => v?.trim()),
  )
  const contactDates = data.contactDates.filter((d) => d.text.trim() !== '' && d.date !== '')

  return {
    ...data,
    contactRelations,
    phoneNumbers,
    contactEmailAdresses,
    contactBiographies,
    contactOrganizations,
    contactAddresses,
    contactDates,
  }
}

export const getContactFormDefaultValues = (
  t: (key: string) => string,
  defaultValues?: ContactFormValues,
): ContactFormValues => {
  const d = (defaultValues ?? {}) as Partial<ContactFormValues>

  return {
    ...d,
    contactNames: d.contactNames?.length ? d.contactNames : [{ given: '', family: '' }],
    contactDates: enforceMin(d.contactDates, {
      text: t('birthday'),
      date: '',
    }),
    phoneNumbers: enforceMin(d.phoneNumbers, { value: '', type: 'Mobile' }),
    contactEmailAdresses: enforceMin(d.contactEmailAdresses, {
      value: '',
      type: 'Personal',
      '@type': 'ContactEmailAdress',
    }),
    contactAddresses: enforceMin(d.contactAddresses, {
      type: 'Home',
      street: '',
      city: '',
      postalCode: '',
      country: '',
    }),
    contactOrganizations: enforceMin(d.contactOrganizations, {
      name: '',
      title: '',
      department: '',
      type: 'Work',
      jobDescription: '',
      startDate: '',
      endDate: '',
    }),
    contactGroups: d.contactGroups || [],
    contactBiographies: enforceMin(d.contactBiographies, { value: '', type: 'Bio' }),
    contactRelations: d.contactRelations || [],
  }
}
