import {
  Briefcase,
  Calendar,
  FileText,
  Mail,
  MapPin,
  Pencil,
  Phone,
  Star,
  Users,
} from 'lucide-react'
import type React from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import { useContactFavorite } from '../hooks/useContactFavorite'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useUserPrefs } from '@/hooks/useUserPrefs.hook'
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
          <DisplayItem
            key={i}
            icon={Phone}
            label={phone.type ?? undefined}
            value={phone.value ?? undefined}
          />
        ))}
        {contact.contactEmailAdresses?.map((email, i) => (
          <DisplayItem
            key={i}
            icon={Mail}
            label={email.type ?? undefined}
            value={email.value ?? undefined}
          />
        ))}
        {contact.contactAddresses?.map((address, i) => (
          <DisplayItem
            key={i}
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
            value={
              typeof group.groupResource === 'object' &&
              group.groupResource !== null &&
              'name' in group.groupResource
                ? group.groupResource.name
                : ''
            }
          />
        ))}
      </CardContent>
    </Card>
  )
}

const DatesCard = ({ contact }: { contact: Contact }) => {
  const { t } = useTranslation()
  const { formatDate } = useUserPrefs()
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
            label={date.text ?? undefined}
            value={(() => {
              if (!date.date) {
                return ''
              }
              const formattedDate = formatDate(date.date)
              return date.yearsPassed ? `${formattedDate} (${date.yearsPassed})` : formattedDate
            })()}
          />
        ))}
      </CardContent>
    </Card>
  )
}

const UpcomingDatesCard = ({ contact }: { contact: Contact }) => {
  const { t } = useTranslation()
  const { formatDate } = useUserPrefs()
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
            label={date.text ?? undefined}
            value={`${formatDate(date.nextAnniversaryDate ?? '')} (${date.yearsAtNextAnniversary})`}
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
          <DisplayItem
            key={i}
            icon={FileText}
            label={bio.type ?? undefined}
            value={bio.value ?? undefined}
          />
        ))}
      </CardContent>
    </Card>
  )
}

const getRelatedContactId = (relatedContact: unknown): string | undefined => {
  if (typeof relatedContact === 'string') {
    return relatedContact.split('/').pop()
  }
  if (
    typeof relatedContact === 'object' &&
    relatedContact !== null &&
    '@id' in relatedContact &&
    typeof relatedContact['@id'] === 'string'
  ) {
    return relatedContact['@id'].split('/').pop()
  }
  return undefined
}

const getRelatedContactName = (
  relation: NonNullable<Contact['contactRelations']>[number],
  t: (key: string, options?: { defaultValue?: string }) => string,
): string => {
  if (relation.displayName) {
    return relation.displayName
  }
  if (
    typeof relation.relatedContact === 'object' &&
    relation.relatedContact !== null &&
    relation.relatedContact.displayName
  ) {
    return relation.relatedContact.displayName
  }
  return t('common.unknown')
}

const RelationsCard = ({ contact }: { contact: Contact }) => {
  const { t } = useTranslation()
  if (!contact.contactRelations || contact.contactRelations.length === 0) {
    return null
  }
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{t('contacts.relations')}</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        {contact.contactRelations.map((relation, i) => {
          const relatedId = getRelatedContactId(relation.relatedContact)
          const label = t(`contacts.relationTypes.${relation.type}`, {
            defaultValue: relation.type,
          })
          const name = getRelatedContactName(relation, t)

          return (
            <div key={i} className="flex items-start gap-3 py-2">
              <div className="mt-1 rounded-md bg-muted p-2">
                <Users className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="flex-1 space-y-1">
                <p className="text-xs font-medium text-muted-foreground">{label}</p>
                {relatedId ? (
                  <Link
                    to={`/contacts/${relatedId}`}
                    className="text-sm font-medium leading-none text-primary hover:underline"
                  >
                    {name}
                  </Link>
                ) : (
                  <p className="text-sm font-medium leading-none">{name}</p>
                )}
              </div>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}

export function ContactView({ contact, onEdit }: ContactViewProps) {
  const { t } = useTranslation()
  const { isContactFavorite, toggleFavorite } = useContactFavorite()
  const isFavorite = isContactFavorite(contact)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="flex items-center gap-2 text-2xl font-bold">
          {contact.contactNames?.[0]?.given} {contact.contactNames?.[0]?.family}
          <Star
            className={`h-6 w-6 cursor-pointer transition-transform hover:scale-110 ${
              isFavorite ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'
            }`}
            onClick={() => toggleFavorite(contact)}
          />
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
        <RelationsCard contact={contact} />
        <BiographyCard contact={contact} />
      </div>
    </div>
  )
}
