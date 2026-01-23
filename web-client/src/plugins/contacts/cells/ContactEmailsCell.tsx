import { ContactEmailInlineEdit } from '@/plugins/contacts/components/ContactEmailInlineEdit'
import {
  useCreateContactEmail,
  useDeleteContactEmail,
  useUpdateContactEmail,
} from '@/plugins/contacts/useContacts'
import { type Contact, type ContactEmailAdress } from '@/types/models'

interface ContactEmailsCellProps {
  contact: Contact
}

export function ContactEmailsCell({ contact }: ContactEmailsCellProps) {
  const updateEmailMutation = useUpdateContactEmail()
  const createEmailMutation = useCreateContactEmail()
  const deleteEmailMutation = useDeleteContactEmail()

  const onUpdateEmail = async (email: ContactEmailAdress) => {
    if (!contact['@id']) {
      return
    }

    if (email['@id']) {
      await updateEmailMutation.mutateAsync({
        id: email['@id'],
        data: email,
      })
    } else {
      await createEmailMutation.mutateAsync({
        ...email,
        contact: contact['@id'],
      })
    }
  }

  const onDeleteEmail = async (email: ContactEmailAdress) => {
    if (!email['@id']) {
      return
    }
    await deleteEmailMutation.mutateAsync(email['@id'])
  }

  const emails = contact.contactEmailAdresses?.length
    ? (contact.contactEmailAdresses as ContactEmailAdress[])
    : ([{ value: '', type: '' }] as ContactEmailAdress[])

  return (
    <div className="flex flex-col gap-1">
      {emails.slice(0, 1).map((email, i) => (
        <ContactEmailInlineEdit
          key={i}
          email={email}
          onUpdate={onUpdateEmail}
          onDelete={() => onDeleteEmail(email)}
        />
      ))}
    </div>
  )
}
