import { useTranslation } from 'react-i18next'
import { Mail, MapPin, Phone } from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type {
  Contact,
  ContactAddress,
  ContactEmailAdress,
  ContactPhoneNumber,
} from '@/types/models'

import { ContactAddressInlineEdit } from '../../components/ContactAddressInlineEdit'
import { ContactEmailInlineEdit } from '../../components/ContactEmailInlineEdit'
import { ContactPhoneInlineEdit } from '../../components/ContactPhoneInlineEdit'
import { DisplayItem } from '../../components/DisplayItem'
import {
  useCreateContactAddress,
  useCreateContactEmail,
  useCreateContactPhone,
  useDeleteContactAddress,
  useDeleteContactEmail,
  useDeleteContactPhone,
  useUpdateContactAddress,
  useUpdateContactEmail,
  useUpdateContactPhone,
} from '../../useContacts'

export const ContactInfoSection = ({ contact }: { contact: Contact }) => {
  const { t } = useTranslation('contacts')

  // Phone Mutations
  const handleCreatePhoneMutation = useCreateContactPhone()
  const handleUpdatePhoneMutation = useUpdateContactPhone()
  const handleDeletePhoneMutation = useDeleteContactPhone()

  const handleUpdatePhone = async (phone: ContactPhoneNumber) => {
    if (!contact['@id']) {
      return
    }
    if (phone['@id']) {
      await handleUpdatePhoneMutation.mutateAsync({ id: phone['@id'], data: phone })
    } else {
      await handleCreatePhoneMutation.mutateAsync({ ...phone, contact: contact['@id'] })
    }
  }

  const handleDeletePhone = async (phone: ContactPhoneNumber) => {
    if (phone['@id']) {
      await handleDeletePhoneMutation.mutateAsync(phone['@id'])
    }
  }

  // Email Mutations
  const handleCreateEmailMutation = useCreateContactEmail()
  const handleUpdateEmailMutation = useUpdateContactEmail()
  const handleDeleteEmailMutation = useDeleteContactEmail()

  const handleUpdateEmail = async (email: ContactEmailAdress) => {
    if (!contact['@id']) {
      return
    }
    if (email['@id']) {
      await handleUpdateEmailMutation.mutateAsync({ id: email['@id'], data: email })
    } else {
      await handleCreateEmailMutation.mutateAsync({ ...email, contact: contact['@id'] })
    }
  }

  const handleDeleteEmail = async (email: ContactEmailAdress) => {
    if (email['@id']) {
      await handleDeleteEmailMutation.mutateAsync(email['@id'])
    }
  }

  // Address Mutations
  const handleCreateAddressMutation = useCreateContactAddress()
  const handleUpdateAddressMutation = useUpdateContactAddress()
  const handleDeleteAddressMutation = useDeleteContactAddress()

  const handleUpdateAddress = async (address: ContactAddress) => {
    if (!contact['@id']) {
      return
    }
    if (address['@id']) {
      await handleUpdateAddressMutation.mutateAsync({ id: address['@id'], data: address })
    } else {
      await handleCreateAddressMutation.mutateAsync({ ...address, contact: contact['@id'] })
    }
  }

  const handleDeleteAddress = async (address: ContactAddress) => {
    if (address['@id']) {
      await handleDeleteAddressMutation.mutateAsync(address['@id'])
    }
  }

  const hasPhones = Array.isArray(contact.phoneNumbers) && contact.phoneNumbers.length > 0
  const hasEmails =
    Array.isArray(contact.contactEmailAdresses) && contact.contactEmailAdresses.length > 0
  const hasAddresses =
    Array.isArray(contact.contactAddresses) && contact.contactAddresses.length > 0

  if (!hasPhones && !hasEmails && !hasAddresses) {
    return null
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{t('contactInfo')}</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        {(Array.isArray(contact.phoneNumbers) ? contact.phoneNumbers : []).map((phone, i) => (
          <ContactPhoneInlineEdit
            key={i}
            phone={phone}
            onUpdate={handleUpdatePhone}
            onDelete={() => handleDeletePhone(phone)}
            hideAddButton
            className="h-auto w-full"
          >
            <DisplayItem
              icon={Phone}
              label={phone.type ?? undefined}
              value={phone.value ?? undefined}
            />
          </ContactPhoneInlineEdit>
        ))}
        {(Array.isArray(contact.contactEmailAdresses) ? contact.contactEmailAdresses : []).map(
          (email, i) => (
            <ContactEmailInlineEdit
              key={i}
              email={email}
              onUpdate={handleUpdateEmail}
              onDelete={() => handleDeleteEmail(email)}
              hideAddButton
              className="h-auto w-full"
            >
              <DisplayItem
                icon={Mail}
                label={email.type ?? undefined}
                value={email.value ?? undefined}
              />
            </ContactEmailInlineEdit>
          ),
        )}
        {(Array.isArray(contact.contactAddresses) ? contact.contactAddresses : []).map(
          (address, i) => (
            <ContactAddressInlineEdit
              key={i}
              address={address}
              onUpdate={handleUpdateAddress}
              onDelete={() => handleDeleteAddress(address)}
            >
              <DisplayItem
                icon={MapPin}
                label={address.type ?? undefined}
                value={[
                  address.street,
                  address.streetExtended,
                  address.city,
                  address.region,
                  address.postalCode,
                  address.country,
                ]
                  .filter(Boolean)
                  .join(', ')}
              />
            </ContactAddressInlineEdit>
          ),
        )}
      </CardContent>
    </Card>
  )
}
