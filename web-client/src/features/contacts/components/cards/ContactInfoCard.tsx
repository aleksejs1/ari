import { Mail, MapPin, Phone } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { ContactAddressInlineEdit } from '../ContactAddressInlineEdit'
import { ContactEmailInlineEdit } from '../ContactEmailInlineEdit'
import { ContactPhoneInlineEdit } from '../ContactPhoneInlineEdit'
import { DisplayItem } from '../DisplayItem'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type {
  Contact,
  ContactAddress,
  ContactEmailAdress,
  ContactPhoneNumber,
} from '@/types/models'

interface ContactInfoCardProps {
  contact: Contact
  onUpdatePhone: (phone: ContactPhoneNumber) => void
  onDeletePhone: (phone: ContactPhoneNumber) => void
  onUpdateEmail: (email: ContactEmailAdress) => void
  onDeleteEmail: (email: ContactEmailAdress) => void
  onUpdateAddress: (address: ContactAddress) => void
  onDeleteAddress: (address: ContactAddress) => void
}

export const ContactInfoCard = ({
  contact,
  onUpdatePhone,
  onDeletePhone,
  onUpdateEmail,
  onDeleteEmail,
  onUpdateAddress,
  onDeleteAddress,
}: ContactInfoCardProps) => {
  const { t } = useTranslation()
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{t('contacts.contactInfo')}</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        {contact.phoneNumbers?.map((phone, i) => (
          <ContactPhoneInlineEdit
            key={i}
            phone={phone}
            onUpdate={onUpdatePhone}
            onDelete={() => onDeletePhone(phone)}
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
        {contact.contactEmailAdresses?.map((email, i) => (
          <ContactEmailInlineEdit
            key={i}
            email={email}
            onUpdate={onUpdateEmail}
            onDelete={() => onDeleteEmail(email)}
            hideAddButton
            className="h-auto w-full"
          >
            <DisplayItem
              icon={Mail}
              label={email.type ?? undefined}
              value={email.value ?? undefined}
            />
          </ContactEmailInlineEdit>
        ))}
        {contact.contactAddresses?.map((address, i) => (
          <ContactAddressInlineEdit
            key={i}
            address={address}
            onUpdate={onUpdateAddress}
            onDelete={() => onDeleteAddress(address)}
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
        ))}
      </CardContent>
    </Card>
  )
}
