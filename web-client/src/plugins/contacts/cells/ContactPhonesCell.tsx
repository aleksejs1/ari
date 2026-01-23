import { type Contact, type ContactPhoneNumber } from '@/types/models'

import { ContactPhoneInlineEdit } from '@/plugins/contacts/components/ContactPhoneInlineEdit'
import {
  useCreateContactPhone,
  useDeleteContactPhone,
  useUpdateContactPhone,
} from '@/plugins/contacts/useContacts'

interface ContactPhonesCellProps {
  contact: Contact
}

export function ContactPhonesCell({ contact }: ContactPhonesCellProps) {
  const updatePhoneMutation = useUpdateContactPhone()
  const createPhoneMutation = useCreateContactPhone()
  const deletePhoneMutation = useDeleteContactPhone()

  const onUpdatePhone = async (phone: ContactPhoneNumber) => {
    if (!contact['@id']) {
      return
    }

    if (phone['@id']) {
      await updatePhoneMutation.mutateAsync({
        id: phone['@id'],
        data: phone,
      })
    } else {
      await createPhoneMutation.mutateAsync({
        ...phone,
        contact: contact['@id'],
      })
    }
  }

  const onDeletePhone = async (phone: ContactPhoneNumber) => {
    if (!phone['@id']) {
      return
    }
    await deletePhoneMutation.mutateAsync(phone['@id'])
  }

  const phones = contact.phoneNumbers?.length
    ? (contact.phoneNumbers as ContactPhoneNumber[])
    : ([{ value: '', type: '' }] as ContactPhoneNumber[])

  return (
    <div className="flex flex-col gap-1">
      {phones.slice(0, 1).map((phone, i) => (
        <ContactPhoneInlineEdit
          key={i}
          phone={phone}
          onUpdate={onUpdatePhone}
          onDelete={() => onDeletePhone(phone)}
        />
      ))}
    </div>
  )
}
