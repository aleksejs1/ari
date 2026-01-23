import { describe, expect, it } from 'vitest'

import { type Contact } from '@/types/models'

import { mapContactToFormValues } from './contactUtils'

describe('mapContactToFormValues', () => {
  it('maps all collection fields correctly', () => {
    const contact: Contact = {
      '@id': '/api/contacts/1',
      '@type': 'Contact',
      id: 1,
      contactNames: [
        { given: 'John', family: 'Doe', '@type': 'ContactName', id: 101, '@id': '/cn/101' },
      ],
      contactDates: [
        { date: '2023-01-01', text: 'Birthday', '@type': 'ContactDate', id: 102, '@id': '/cd/102' },
      ],
      phoneNumbers: [
        { value: '123456', type: 'Work', '@type': 'ContactPhoneNumber', id: 103, '@id': '/cp/103' },
      ],
      contactEmailAdresses: [
        {
          value: 'john@doe.com',
          type: 'Home',
          '@type': 'ContactEmailAdress',
          id: 104,
          '@id': '/ce/104',
        },
      ],
      contactAddresses: [
        { street: 'Main St', city: 'NY', '@type': 'ContactAddress', id: 105, '@id': '/ca/105' },
      ],
      contactOrganizations: [
        {
          name: 'Acme',
          title: 'Manager',
          '@type': 'ContactOrganization',
          id: 106,
          '@id': '/co/106',
        },
      ],
      contactBiographies: [
        { value: 'Bio text', type: 'Note', '@type': 'ContactBiography', id: 107, '@id': '/cb/107' },
      ],
      contactGroups: [
        {
          '@id': '/api/groups/1',
          '@type': 'ContactGroup',
          id: 1,
          groupResource: {
            '@id': '/api/groups/100',
            '@type': 'Group',
            name: 'Friends',
          },
        },
      ],
    }

    const result = mapContactToFormValues(contact)

    expect(result.contactNames).toHaveLength(1)
    expect(result.contactNames[0]).toEqual(
      expect.objectContaining({ given: 'John', family: 'Doe' }),
    )

    expect(result.contactDates).toHaveLength(1)
    expect(result.contactDates[0]).toEqual(
      expect.objectContaining({ date: '2023-01-01', text: 'Birthday' }),
    )

    expect(result.phoneNumbers).toHaveLength(1)
    expect(result.phoneNumbers[0]).toEqual(
      expect.objectContaining({ value: '123456', type: 'Work' }),
    )

    expect(result.contactEmailAdresses).toHaveLength(1)
    expect(result.contactEmailAdresses[0]).toEqual(
      expect.objectContaining({ value: 'john@doe.com', type: 'Home' }),
    )

    expect(result.contactAddresses).toHaveLength(1)
    expect(result.contactAddresses[0]).toEqual(
      expect.objectContaining({ street: 'Main St', city: 'NY' }),
    )

    expect(result.contactOrganizations).toHaveLength(1)
    expect(result.contactOrganizations?.[0]).toEqual(
      expect.objectContaining({ name: 'Acme', title: 'Manager' }),
    )

    expect(result.contactBiographies).toHaveLength(1)
    expect(result.contactBiographies?.[0]).toEqual(
      expect.objectContaining({ value: 'Bio text', type: 'Note' }),
    )

    expect(result.contactGroups).toHaveLength(1)
    expect(result.contactGroups?.[0]).toMatchObject({
      groupResource: '/api/groups/100',
    })
  })

  it('maps with empty or null optional fields', () => {
    const contact: Contact = {
      '@id': '/api/contacts/2',
      '@type': 'Contact',
      id: 2,
      // All collections undefined
    }

    const result = mapContactToFormValues(contact)

    expect(result.contactNames).toEqual([])
    expect(result.contactDates).toEqual([])
    expect(result.phoneNumbers).toEqual([])
    expect(result.contactEmailAdresses).toEqual([])
    expect(result.contactAddresses).toEqual([])
    expect(result.contactOrganizations).toEqual([])
    expect(result.contactBiographies).toEqual([])
    expect(result.contactGroups).toEqual([])
  })

  it('maps objects with null properties to default empty strings', () => {
    const contact: Contact = {
      '@id': '/api/contacts/3',
      '@type': 'Contact',
      id: 3,
      // @ts-expect-error forcing null for test
      contactNames: [{ given: null, family: null, '@type': 'ContactName' }],
      // @ts-expect-error forcing null for test
      contactOrganizations: [{ name: null, title: null, '@type': 'ContactOrganization' }],
    }

    const result = mapContactToFormValues(contact)

    expect(result.contactNames[0].given).toBe('')
    expect(result.contactNames[0].family).toBe('')
    expect(result.contactOrganizations?.[0]?.name).toBe('')
    expect(result.contactOrganizations?.[0]?.title).toBe('')
  })

  it('maps contact group resource when it is a string IRI', () => {
    const contact: Contact = {
      '@id': '/api/contacts/1',
      '@type': 'Contact',
      id: 1,
      contactGroups: [
        {
          '@id': '/api/groups/1',
          '@type': 'ContactGroup',
          id: 1,
          // @ts-expect-error simulating IRI string from API
          groupResource: '/api/groups/100',
        },
      ],
    }

    const result = mapContactToFormValues(contact)
    expect(result.contactGroups?.[0].groupResource).toBe('/api/groups/100')
  })

  it('safely handles non-array collections (e.g. malformed API response or cache)', () => {
    const contact = {
      '@id': '/api/contacts/1',
      id: 1,
      // Simulate malformed data where collection is an object instead of array
      contactEmailAdresses: { some: 'object' },
      phoneNumbers: { some: 'object' },
      contactAddresses: 'some string',
      contactNames: null,
      contactDates: undefined,
      contactOrganizations: { error: true },
      contactGroups: 123,
      contactBiographies: { bio: 'test' },
      contactRelations: 'invalid',
    } as unknown as Contact

    // Should not throw error
    const result = mapContactToFormValues(contact)

    expect(result.contactEmailAdresses).toEqual([])
    expect(result.phoneNumbers).toEqual([])
    expect(result.contactAddresses).toEqual([])
    expect(result.contactNames).toEqual([])
    expect(result.contactDates).toEqual([])
    expect(result.contactOrganizations).toEqual([])
    expect(result.contactGroups).toEqual([])
    expect(result.contactBiographies).toEqual([])
    expect(result.contactRelations).toEqual([])
  })
})
