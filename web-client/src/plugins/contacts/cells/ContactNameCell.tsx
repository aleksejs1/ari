import { ContactNameInlineEdit } from '@/plugins/contacts/components/ContactNameInlineEdit'
import {
  useCreateContactName,
  useDeleteContactName,
  useUpdateContactName,
} from '@/plugins/contacts/useContacts'
import { type Contact, type ContactName } from '@/types/models'

interface ContactNameCellProps {
  contact: Contact
}

export function ContactNameCell({ contact }: ContactNameCellProps) {
  const updateNameMutation = useUpdateContactName()
  const createNameMutation = useCreateContactName()
  const deleteNameMutation = useDeleteContactName()

  const names = contact.contactNames?.length
    ? contact.contactNames
    : ([{ given: '', family: '' }] as ContactName[])

  const onUpdateName = async (name: ContactName) => {
    if (!contact['@id']) {
      return
    }

    if (name['@id']) {
      await updateNameMutation.mutateAsync({
        id: name['@id'],
        data: name,
      })
    } else {
      await createNameMutation.mutateAsync({
        ...name,
        contact: contact['@id'],
      })
    }
  }

  const onDeleteName = async (name: ContactName) => {
    if (!name['@id']) {
      return
    }
    await deleteNameMutation.mutateAsync(name['@id'])
  }

  return (
    <div className="flex flex-col gap-1">
      {names.slice(0, 1).map((name, i) => (
        <ContactNameInlineEdit
          key={i}
          name={name}
          onUpdate={onUpdateName}
          onDelete={() => onDeleteName(name)}
        />
      ))}
    </div>
  )
}
