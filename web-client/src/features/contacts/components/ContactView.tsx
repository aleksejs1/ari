import { Pencil, Star } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import {
  useCreateContactAddress,
  useCreateContactBiography,
  useCreateContactDate,
  useCreateContactEmail,
  useCreateContactOrganization,
  useCreateContactPhone,
  useDeleteContactAddress,
  useDeleteContactBiography,
  useDeleteContactDate,
  useDeleteContactEmail,
  useDeleteContactOrganization,
  useDeleteContactPhone,
  useUpdateContactAddress,
  useUpdateContactBiography,
  useUpdateContactDate,
  useUpdateContactEmail,
  useUpdateContactOrganization,
  useUpdateContactPhone,
  useGroups,
} from '../useContacts'

import { AvatarUpload } from './AvatarUpload'
import { BiographyCard } from './cards/BiographyCard'
import { ContactInfoCard } from './cards/ContactInfoCard'
import { DatesCard } from './cards/DatesCard'
import { ProfessionalCard } from './cards/ProfessionalCard'
import { RelationsCard } from './cards/RelationsCard'
import { UpcomingDatesCard } from './cards/UpcomingDatesCard'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useContactFavorite } from '@/features/contacts/hooks/useContactFavorite'
import { getContrastingTextColor } from '@/lib/colors'
import type {
  Contact,
  ContactAddress,
  ContactBiography,
  ContactDate,
  ContactEmailAdress,
  ContactOrganization,
  ContactPhoneNumber,
} from '@/types/models'

interface ContactViewProps {
  contact: Contact
  onEdit: () => void
}

const getGroupFilterValue = (groupResource: any): string | null => {
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

const getGroupName = (groupResource: any): string => {
  if (typeof groupResource === 'string') {
    return groupResource.split('/').pop() || groupResource
  }
  if (typeof groupResource === 'object' && groupResource !== null && 'name' in groupResource) {
    return groupResource.name
  }
  return ''
}

export function ContactView({ contact, onEdit }: ContactViewProps) {
  const { isContactFavorite } = useContactFavorite()
  const isFavorite = isContactFavorite(contact)
  const actions = useContactViewActions(contact)

  return (
    <div className="space-y-6">
      <ContactViewHeader contact={contact} onEdit={onEdit} isFavorite={isFavorite} />
      <ContactViewCardsGrid contact={contact} {...actions} />
    </div>
  )
}

function useContactViewActions(contact: Contact) {
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

  const handleCreateDateMutation = useCreateContactDate()
  const handleUpdateDateMutation = useUpdateContactDate()
  const handleDeleteDateMutation = useDeleteContactDate()

  const handleUpdateDate = async (date: ContactDate) => {
    if (!contact['@id']) {
      return
    }
    if (date['@id']) {
      await handleUpdateDateMutation.mutateAsync({ id: date['@id'], data: date })
    } else {
      await handleCreateDateMutation.mutateAsync({ ...date, contact: contact['@id'] })
    }
  }

  const handleDeleteDate = async (date: ContactDate) => {
    if (date['@id']) {
      await handleDeleteDateMutation.mutateAsync(date['@id'])
    }
  }

  const handleCreateBioMutation = useCreateContactBiography()
  const handleUpdateBioMutation = useUpdateContactBiography()
  const handleDeleteBioMutation = useDeleteContactBiography()

  const handleUpdateBio = async (bio: ContactBiography) => {
    if (!contact['@id']) {
      return
    }
    if (bio['@id']) {
      await handleUpdateBioMutation.mutateAsync({ id: bio['@id'], data: bio })
    } else {
      await handleCreateBioMutation.mutateAsync({ ...bio, contact: contact['@id'] })
    }
  }

  const handleDeleteBio = async (bio: ContactBiography) => {
    if (bio['@id']) {
      await handleDeleteBioMutation.mutateAsync(bio['@id'])
    }
  }

  const handleCreateOrganizationMutation = useCreateContactOrganization()
  const handleUpdateOrganizationMutation = useUpdateContactOrganization()
  const handleDeleteOrganizationMutation = useDeleteContactOrganization()

  const handleUpdateOrganization = async (org: ContactOrganization) => {
    if (!contact['@id']) {
      return
    }
    if (org['@id']) {
      await handleUpdateOrganizationMutation.mutateAsync({ id: org['@id'], data: org })
    } else {
      await handleCreateOrganizationMutation.mutateAsync({ ...org, contact: contact['@id'] })
    }
  }

  const handleDeleteOrganization = async (org: ContactOrganization) => {
    if (org['@id']) {
      await handleDeleteOrganizationMutation.mutateAsync(org['@id'])
    }
  }

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

  return {
    handleUpdatePhone,
    handleDeletePhone,
    handleUpdateEmail,
    handleDeleteEmail,
    handleUpdateAddress,
    handleDeleteAddress,
    handleUpdateOrganization,
    handleDeleteOrganization,
    handleUpdateDate,
    handleDeleteDate,
    handleUpdateBio,
    handleDeleteBio,
  }
}

function ContactViewHeader({
  contact,
  onEdit,
  isFavorite,
}: {
  contact: Contact
  onEdit: () => void
  isFavorite: boolean
}) {
  const { t } = useTranslation()

  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
      <div className="flex items-start gap-4">
        <AvatarUpload
          currentAvatar={contact.avatar}
          displayName={`${contact.contactNames?.[0]?.given} ${contact.contactNames?.[0]?.family}`}
          className="mt-1"
        />
        <div className="space-y-2">
          <h1 className="flex items-center gap-2 text-2xl font-bold">
            {contact.contactNames?.[0]?.given} {contact.contactNames?.[0]?.family}
            <ContactFavoriteButton contact={contact} isFavorite={isFavorite} />
          </h1>
          <ContactGroupsBadgeList contactGroups={contact.contactGroups} />
        </div>
      </div>
      <Button onClick={onEdit} className="w-full gap-2 md:w-auto">
        <Pencil className="h-4 w-4" />
        {t('common.edit')}
      </Button>
    </div>
  )
}

function ContactFavoriteButton({ contact, isFavorite }: { contact: Contact; isFavorite: boolean }) {
  const { t } = useTranslation()
  const { toggleFavorite } = useContactFavorite()

  return (
    <button
      className="ml-2 rounded-full p-2 hover:bg-muted focus:outline-none focus:ring-2 focus:ring-primary"
      onClick={() => toggleFavorite(contact)}
      aria-label={isFavorite ? t('contacts.removeFromFavorites') : t('contacts.addToFavorites')}
    >
      <Star
        className={`h-6 w-6 transition-transform hover:scale-110 ${
          isFavorite ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'
        }`}
      />
    </button>
  )
}

function ContactGroupsBadgeList({ contactGroups }: { contactGroups: Contact['contactGroups'] }) {
  const { data: groupsFetched } = useGroups()

  if (!contactGroups || contactGroups.length === 0) {
    return null
  }

  return (
    <div className="flex flex-wrap gap-2">
      {contactGroups.map((cg, i) => {
        const groupIri = getGroupFilterValue(cg.groupResource)
        const name = getGroupName(cg.groupResource)
        if (!name) {
          return null
        }

        const fullGroup = groupsFetched?.find((g) => g['@id'] === groupIri)

        return (
          <Link
            key={i}
            to={groupIri ? `/contacts?group=${encodeURIComponent(groupIri)}` : '#'}
            className="hover:opacity-80"
          >
            <Badge
              variant="secondary"
              className={fullGroup?.color ? 'border-transparent' : ''}
              style={
                fullGroup?.color
                  ? {
                      backgroundColor: fullGroup.color,
                      borderColor: fullGroup.color,
                      color: getContrastingTextColor(fullGroup.color),
                    }
                  : undefined
              }
            >
              {name}
            </Badge>
          </Link>
        )
      })}
    </div>
  )
}

function ContactViewCardsGrid({
  contact,
  handleUpdatePhone,
  handleDeletePhone,
  handleUpdateEmail,
  handleDeleteEmail,
  handleUpdateAddress,
  handleDeleteAddress,
  handleUpdateOrganization,
  handleDeleteOrganization,
  handleUpdateDate,
  handleDeleteDate,
  handleUpdateBio,
  handleDeleteBio,
}: any) {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <ContactInfoCard
        contact={contact}
        onUpdatePhone={handleUpdatePhone}
        onDeletePhone={handleDeletePhone}
        onUpdateEmail={handleUpdateEmail}
        onDeleteEmail={handleDeleteEmail}
        onUpdateAddress={handleUpdateAddress}
        onDeleteAddress={handleDeleteAddress}
      />
      <ProfessionalCard
        contact={contact}
        onUpdateOrganization={handleUpdateOrganization}
        onDeleteOrganization={handleDeleteOrganization}
      />
      <DatesCard
        contact={contact}
        onUpdateDate={handleUpdateDate}
        onDeleteDate={handleDeleteDate}
      />
      <UpcomingDatesCard contact={contact} />
      <RelationsCard contact={contact} />
      <BiographyCard
        contact={contact}
        onUpdateBio={handleUpdateBio}
        onDeleteBio={handleDeleteBio}
      />
    </div>
  )
}
