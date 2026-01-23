import { ContactGroupInlineEdit } from '@/plugins/contacts/components/ContactGroupInlineEdit'
import { useGroups, useUpdateContactGroups } from '@/plugins/contacts/useContacts'
import { type Contact } from '@/types/models'

interface ContactGroupsCellProps {
  contact: Contact
}

export function ContactGroupsCell({ contact }: ContactGroupsCellProps) {
  const { data: groups } = useGroups()
  const updateGroupsMutation = useUpdateContactGroups()

  const onUpdateGroups = async (groupIds: string[]) => {
    if (!contact['@id']) {
      return
    }

    await updateGroupsMutation.mutateAsync({
      contactId: contact['@id'],
      groupIds,
    })
  }

  return (
    <ContactGroupInlineEdit
      contact={contact}
      groups={groups || []}
      onUpdate={(_contact, groupIds) => onUpdateGroups(groupIds)}
    />
  )
}
