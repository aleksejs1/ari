import { describe, it, expect } from 'vitest'

import { mapContactToFormValues } from './contactUtils'

import { type Contact } from '@/types/models'

describe('mapContactToFormValues', () => {
  it('maps contact groups correctly', () => {
    const contact: Contact = {
      '@id': '/api/contacts/1',
      '@type': 'Contact',
      id: 1,
      contactNames: [],
      contactDates: [],
      phoneNumbers: [],
      contactEmailAdresses: [],
      contactAddresses: [],
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

    expect(result.contactGroups).toHaveLength(1)
    expect(result.contactGroups?.[0]).toMatchObject({
      groupResource: '/api/groups/100',
    })
  })

  it('maps other attributes correctly', () => {
    const contact: Contact = {
      '@id': '/api/contacts/1',
      '@type': 'Contact',
      id: 1,
      contactNames: [{ given: 'John', family: 'Doe', '@type': 'ContactName' }],
      contactDates: [],
      phoneNumbers: [],
      contactEmailAdresses: [],
      contactAddresses: [],
      contactGroups: [],
    }

    const result = mapContactToFormValues(contact)

    expect(result.contactNames).toHaveLength(1)
    expect(result.contactNames[0]).toMatchObject({
      given: 'John',
      family: 'Doe',
    })
  })
})
