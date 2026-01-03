import { useCallback } from 'react'

import { useCreateGroup, useGroups, usePatchContact } from '../useContacts'

import { useUserPrefs } from '@/hooks/useUserPrefs.hook'
import type { Contact } from '@/types/models'

const getGroupIri = (cg: Contact['contactGroups'] extends (infer U)[] | undefined ? U : never) =>
  typeof cg.groupResource === 'string'
    ? cg.groupResource
    : (cg.groupResource as { '@id'?: string })?.['@id']

export function useContactFavorite() {
  const { favouriteGroupName } = useUserPrefs()
  const { data: groups } = useGroups()
  const { mutate: patchContact } = usePatchContact()
  const { mutateAsync: createGroup } = useCreateGroup()

  const isContactFavorite = useCallback(
    (contact: Contact) => {
      const favGroup = groups?.find((g) => g.name === favouriteGroupName)
      if (!favGroup || !favGroup['@id']) {
        return false
      }

      const favGroupId = favGroup['@id']

      return contact.contactGroups?.some((cg) => getGroupIri(cg) === favGroupId) || false
    },
    [groups, favouriteGroupName],
  )

  const getOrCreateFavGroup = useCallback(async () => {
    const existingGroup = groups?.find((g) => g.name === favouriteGroupName)
    if (existingGroup) {
      return existingGroup
    }

    try {
      return await createGroup({ name: favouriteGroupName, color: '#FFD700' })
    } catch {
      return undefined
    }
  }, [groups, createGroup, favouriteGroupName])

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
