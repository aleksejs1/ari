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
import {
  useCreateContactEmail,
  useCreateContactPhone,
  useCreateContactBiography,
  useCreateContactDate,
  useDeleteContactEmail,
  useDeleteContactPhone,
  useDeleteContactDate,
  useDeleteContactBiography,
  useUpdateContactEmail,
  useUpdateContactPhone,
  useUpdateContactDate,
  useUpdateContactBiography,
} from '../useContacts'

import { ContactBioInlineEdit } from './ContactBioInlineEdit'
import { ContactDateInlineEdit } from './ContactDateInlineEdit'
import { ContactEmailInlineEdit } from './ContactEmailInlineEdit'
import { ContactPhoneInlineEdit } from './ContactPhoneInlineEdit'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useUserPrefs } from '@/hooks/useUserPrefs.hook'
import type {
  Contact,
  ContactBiography,
  ContactDate,
  ContactEmailAdress,
  ContactPhoneNumber,
} from '@/types/models'

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

const ContactInfoCard = ({
  contact,
  onUpdatePhone,
  onDeletePhone,
  onUpdateEmail,
  onDeleteEmail,
}: {
  contact: Contact
  onUpdatePhone: (phone: ContactPhoneNumber) => void
  onDeletePhone: (phone: ContactPhoneNumber) => void
  onUpdateEmail: (email: ContactEmailAdress) => void
  onDeleteEmail: (email: ContactEmailAdress) => void
}) => {
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
      </CardContent>
    </Card>
  )
}

const DatesCard = ({
  contact,
  onUpdateDate,
  onDeleteDate,
}: {
  contact: Contact
  onUpdateDate: (date: ContactDate) => void
  onDeleteDate: (date: ContactDate) => void
}) => {
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
          <ContactDateInlineEdit
            key={i}
            date={date}
            onUpdate={onUpdateDate}
            onDelete={() => onDeleteDate(date)}
            hideAddButton
            className="h-auto w-full"
          >
            <DisplayItem
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
          </ContactDateInlineEdit>
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

const BiographyCard = ({
  contact,
  onUpdateBio,
  onDeleteBio,
}: {
  contact: Contact
  onUpdateBio: (bio: ContactBiography) => void
  onDeleteBio: (bio: ContactBiography) => void
}) => {
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
          <ContactBioInlineEdit
            key={i}
            bio={bio}
            onUpdate={onUpdateBio}
            onDelete={() => onDeleteBio(bio)}
            hideAddButton
            className="h-auto w-full"
          >
            <DisplayItem
              icon={FileText}
              label={bio.type ?? undefined}
              value={bio.value ?? undefined}
            />
          </ContactBioInlineEdit>
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

const getGroupFilterValue = (
  groupResource: Contact['contactGroups'][number]['groupResource'],
): string | null => {
  if (typeof groupResource === 'string') {
    return groupResource
  }
  if (
    typeof groupResource === 'object' &&
    groupResource !== null &&
    '@id' in groupResource &&
    typeof groupResource['@id'] === 'string'
  ) {
    return groupResource['@id']
  }
  return null
}

const getGroupName = (groupResource: Contact['contactGroups'][number]['groupResource']): string => {
  if (typeof groupResource === 'string') {
    return groupResource.split('/').pop() || groupResource
  }
  if (typeof groupResource === 'object' && groupResource !== null && 'name' in groupResource) {
    return groupResource.name
  }
  return ''
}

export function ContactView({ contact, onEdit }: ContactViewProps) {
  const { t } = useTranslation()
  const { isContactFavorite, toggleFavorite } = useContactFavorite()
  const isFavorite = isContactFavorite(contact)

  const handleCreatePhoneMutation = useCreateContactPhone()
  const handleUpdatePhoneMutation = useUpdateContactPhone()
  const handleDeletePhoneMutation = useDeleteContactPhone()

  const handleUpdatePhone = async (phone: ContactPhoneNumber) => {
    if (!contact['@id']) {
      return
    }
    if (phone['@id']) {
      await handleUpdatePhoneMutation.mutateAsync({
        id: phone['@id'],
        data: phone,
      })
    } else {
      await handleCreatePhoneMutation.mutateAsync({
        ...phone,
        contact: contact['@id'],
      })
    }
  }

  const handleDeletePhone = async (phone: ContactPhoneNumber) => {
    if (!phone['@id']) {
      return
    }
    await handleDeletePhoneMutation.mutateAsync(phone['@id'])
  }

  const handleCreateEmailMutation = useCreateContactEmail()
  const handleUpdateEmailMutation = useUpdateContactEmail()
  const handleDeleteEmailMutation = useDeleteContactEmail()

  const handleUpdateEmail = async (email: ContactEmailAdress) => {
    if (!contact['@id']) {
      return
    }
    if (email['@id']) {
      await handleUpdateEmailMutation.mutateAsync({
        id: email['@id'],
        data: email,
      })
    } else {
      await handleCreateEmailMutation.mutateAsync({
        ...email,
        contact: contact['@id'],
      })
    }
  }

  const handleDeleteEmail = async (email: ContactEmailAdress) => {
    if (!email['@id']) {
      return
    }
    await handleDeleteEmailMutation.mutateAsync(email['@id'])
  }

  const handleCreateDateMutation = useCreateContactDate()
  const handleUpdateDateMutation = useUpdateContactDate()
  const handleDeleteDateMutation = useDeleteContactDate()

  const handleUpdateDate = async (date: ContactDate) => {
    if (!contact['@id']) {
      return
    }
    if (date['@id']) {
      await handleUpdateDateMutation.mutateAsync({
        id: date['@id'],
        data: date,
      })
    } else {
      await handleCreateDateMutation.mutateAsync({
        ...date,
        contact: contact['@id'],
      })
    }
  }

  const handleDeleteDate = async (date: ContactDate) => {
    if (!date['@id']) {
      return
    }
    await handleDeleteDateMutation.mutateAsync(date['@id'])
  }

  const handleCreateBioMutation = useCreateContactBiography()
  const handleUpdateBioMutation = useUpdateContactBiography()
  const handleDeleteBioMutation = useDeleteContactBiography()

  const handleUpdateBio = async (bio: ContactBiography) => {
    if (!contact['@id']) {
      return
    }
    if (bio['@id']) {
      await handleUpdateBioMutation.mutateAsync({
        id: bio['@id'],
        data: bio,
      })
    } else {
      await handleCreateBioMutation.mutateAsync({
        ...bio,
        contact: contact['@id'],
      })
    }
  }

  const handleDeleteBio = async (bio: ContactBiography) => {
    if (!bio['@id']) {
      return
    }
    await handleDeleteBioMutation.mutateAsync(bio['@id'])
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <h1 className="flex items-center gap-2 text-2xl font-bold">
            {contact.contactNames?.[0]?.given} {contact.contactNames?.[0]?.family}
            <Star
              className={`h-6 w-6 cursor-pointer transition-transform hover:scale-110 ${
                isFavorite ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'
              }`}
              onClick={() => toggleFavorite(contact)}
            />
          </h1>
          {!!contact.contactGroups && contact.contactGroups.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {contact.contactGroups.map((group, i) => {
                const filterValue = getGroupFilterValue(group.groupResource)
                const name = getGroupName(group.groupResource)
                if (!name) {
                  return null
                }

                return (
                  <Link
                    key={i}
                    to={filterValue ? `/contacts?group=${encodeURIComponent(filterValue)}` : '#'}
                    className="hover:opacity-80"
                  >
                    <Badge variant="secondary">{name}</Badge>
                  </Link>
                )
              })}
            </div>
          )}
        </div>
        <Button onClick={onEdit} className="gap-2">
          <Pencil className="h-4 w-4" />
          {t('common.edit')}
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <ContactInfoCard
          contact={contact}
          onUpdatePhone={handleUpdatePhone}
          onDeletePhone={handleDeletePhone}
          onUpdateEmail={handleUpdateEmail}
          onDeleteEmail={handleDeleteEmail}
        />
        <ProfessionalCard contact={contact} />
        <DatesCard
          contact={contact}
          onUpdateDate={handleUpdateDate}
          onDeleteDate={handleDeleteDate}
        />
        <UpcomingDatesCard contact={contact} />
        <RelationsCard contact={contact} />
        <RelationsCard contact={contact} />
        <BiographyCard
          contact={contact}
          onUpdateBio={handleUpdateBio}
          onDeleteBio={handleDeleteBio}
        />
      </div>
    </div>
  )
}
