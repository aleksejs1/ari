import { useCallback } from 'react'

import { useCreateGroup, useGroups, usePatchContact } from '../useContacts'

import type { Contact } from '@/types/models'

const getGroupIri = (cg: Contact['contactGroups'] extends (infer U)[] | undefined ? U : never) =>
  typeof cg.groupResource === 'string'
    ? cg.groupResource
    : (cg.groupResource as { '@id'?: string })?.['@id']

export function useContactFavorite() {
  const { data: groups } = useGroups()
  const { mutate: patchContact } = usePatchContact()
  const { mutateAsync: createGroup } = useCreateGroup()

  const isContactFavorite = useCallback(
    (contact: Contact) => {
      const favGroup = groups?.find((g) => g.name === 'favourites')
      if (!favGroup || !favGroup['@id']) {
        return false
      }

      const favGroupId = favGroup['@id']

      return contact.contactGroups?.some((cg) => getGroupIri(cg) === favGroupId) || false
    },
    [groups],
  )

  const getOrCreateFavGroup = useCallback(async () => {
    const favGroupName = 'favourites'
    const existingGroup = groups?.find((g) => g.name === favGroupName)
    if (existingGroup) {
      return existingGroup
    }

    try {
      return await createGroup({ name: favGroupName, color: '#FFD700' })
    } catch {
      return undefined
    }
  }, [groups, createGroup])

  const toggleFavorite = useCallback(
    async (contact: Contact) => {
      const favGroup = await getOrCreateFavGroup()

      if (!favGroup?.['@id']) {
        return
      }

      const favGroupId = favGroup['@id']

      const isFavorite = contact.contactGroups?.some((cg) => getGroupIri(cg) === favGroupId)

      const newGroups = isFavorite
        ? contact.contactGroups?.filter((cg) => getGroupIri(cg) !== favGroupId)
        : [...(contact.contactGroups || []), { groupResource: favGroupId }]

      if (contact['@id']) {
        patchContact({
          id: contact['@id'],
          data: {
            contactGroups: newGroups,
          },
        })
      }
    },
    [getOrCreateFavGroup, patchContact],
  )

  return {
    isContactFavorite,
    toggleFavorite,
  }
}
