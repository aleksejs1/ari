import { Briefcase, Calendar, FileText, Mail, MapPin, Pencil, Phone, Users } from 'lucide-react'
import type React from 'react'
import { useTranslation } from 'react-i18next'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatLocalizedDate } from '@/lib/utils'
import type { Contact } from '@/types/models'

interface ContactViewProps {
  contact: Contact
  onEdit: () => void
}

const DisplayItem = ({
  icon: Icon,
  label,
  value,
  subValue,
}: {
  icon: React.ElementType
  label?: string
  value?: string | null
  subValue?: string | null
}) => {
  if (!value) {
    return null
  }
  return (
    <div className="flex items-start gap-3 py-2">
      <div className="mt-1 rounded-md bg-muted p-2">
        <Icon className="h-4 w-4 text-muted-foreground" />
      </div>
      <div className="flex-1 space-y-1">
        {!!label && <p className="text-xs font-medium text-muted-foreground">{label}</p>}
        <p className="text-sm font-medium leading-none">{value}</p>
        {!!subValue && <p className="text-sm text-muted-foreground">{subValue}</p>}
      </div>
    </div>
  )
}

const ContactInfoCard = ({ contact }: { contact: Contact }) => {
  const { t } = useTranslation()
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{t('contacts.contactInfo')}</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        {contact.phoneNumbers?.map((phone, i) => (
          <DisplayItem key={i} icon={Phone} label={phone.type} value={phone.value} />
        ))}
        {contact.contactEmailAdresses?.map((email, i) => (
          <DisplayItem key={i} icon={Mail} label={email.type} value={email.value} />
        ))}
        {contact.contactAddresses?.map((address, i) => (
          <DisplayItem
            key={i}
            icon={MapPin}
            label={address.type}
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
        ))}
      </CardContent>
    </Card>
  )
}

const ProfessionalCard = ({ contact }: { contact: Contact }) => {
  const { t } = useTranslation()
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{t('contacts.professional')}</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        {contact.contactOrganizations?.map((org, i) => (
          <DisplayItem
            key={i}
            icon={Briefcase}
            label={org.type || t('contacts.organization')}
            value={org.name}
            subValue={[org.title, org.department].filter(Boolean).join(' - ')}
          />
        ))}
        {contact.contactGroups?.map((group, i) => (
          <DisplayItem
            key={i}
            icon={Users}
            value={typeof group.groupResource === 'object' ? group.groupResource?.name : ''}
          />
        ))}
      </CardContent>
    </Card>
  )
}

const DatesCard = ({ contact }: { contact: Contact }) => {
  const { t, i18n } = useTranslation()
  if (!contact.contactDates || contact.contactDates.length === 0) {
    return null
  }
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{t('contacts.dates')}</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        {contact.contactDates.map((date, i) => (
          <DisplayItem
            key={i}
            icon={Calendar}
            label={date.text}
            value={(() => {
              if (!date.date) {
                return ''
              }
              const formattedDate = formatLocalizedDate(date.date, i18n.language)
              return date.yearsPassed ? `${formattedDate} (${date.yearsPassed})` : formattedDate
            })()}
          />
        ))}
      </CardContent>
    </Card>
  )
}

const UpcomingDatesCard = ({ contact }: { contact: Contact }) => {
  const { t, i18n } = useTranslation()
  const upcomingDates = contact.contactDates?.filter((d) => d.nextAnniversaryDate)

  if (!upcomingDates || upcomingDates.length === 0) {
    return null
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{t('contacts.nextAnniversary')}</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        {upcomingDates.map((date, i) => (
          <DisplayItem
            key={i}
            icon={Calendar}
            label={date.text}
            value={`${formatLocalizedDate(date.nextAnniversaryDate ?? '', i18n.language)} (${
              date.yearsAtNextAnniversary
            })`}
          />
        ))}
      </CardContent>
    </Card>
  )
}

const BiographyCard = ({ contact }: { contact: Contact }) => {
  const { t } = useTranslation()
  if (!contact.contactBiographies || contact.contactBiographies.length === 0) {
    return null
  }
  return (
    <Card className="md:col-span-2">
      <CardHeader>
        <CardTitle className="text-base">{t('contacts.biography')}</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        {contact.contactBiographies.map((bio, i) => (
          <DisplayItem key={i} icon={FileText} label={bio.type} value={bio.value} />
        ))}
      </CardContent>
    </Card>
  )
}

export function ContactView({ contact, onEdit }: ContactViewProps) {
  const { t } = useTranslation()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">
          {contact.contactNames?.[0]?.given} {contact.contactNames?.[0]?.family}
        </h1>
        <Button onClick={onEdit} className="gap-2">
          <Pencil className="h-4 w-4" />
          {t('common.edit')}
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <ContactInfoCard contact={contact} />
        <ProfessionalCard contact={contact} />
        <DatesCard contact={contact} />
        <UpcomingDatesCard contact={contact} />
        <BiographyCard contact={contact} />
      </div>
    </div>
  )
}
