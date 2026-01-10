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

const getGroupFilterValue = (
  groupResource: any,
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
  const { t } = useTranslation()
  const { isContactFavorite, toggleFavorite } = useContactFavorite()
  const isFavorite = isContactFavorite(contact)
  const { data: groupsFetched } = useGroups()

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

  const handleCreateOrganizationMutation = useCreateContactOrganization()
  const handleUpdateOrganizationMutation = useUpdateContactOrganization()
  const handleDeleteOrganizationMutation = useDeleteContactOrganization()

  const handleUpdateOrganization = async (org: ContactOrganization) => {
    if (!contact['@id']) {
      return
    }
    if (org['@id']) {
      await handleUpdateOrganizationMutation.mutateAsync({
        id: org['@id'],
        data: org,
      })
    } else {
      await handleCreateOrganizationMutation.mutateAsync({
        ...org,
        contact: contact['@id'],
      })
    }
  }

  const handleDeleteOrganization = async (org: ContactOrganization) => {
    if (!org['@id']) {
      return
    }
    await handleDeleteOrganizationMutation.mutateAsync(org['@id'])
  }

  const handleCreateAddressMutation = useCreateContactAddress()
  const handleUpdateAddressMutation = useUpdateContactAddress()
  const handleDeleteAddressMutation = useDeleteContactAddress()

  const handleUpdateAddress = async (address: ContactAddress) => {
    if (!contact['@id']) {
      return
    }
    if (address['@id']) {
      await handleUpdateAddressMutation.mutateAsync({
        id: address['@id'],
        data: address,
      })
    } else {
      await handleCreateAddressMutation.mutateAsync({
        ...address,
        contact: contact['@id'],
      })
    }
  }

  const handleDeleteAddress = async (address: ContactAddress) => {
    if (!address['@id']) {
      return
    }
    await handleDeleteAddressMutation.mutateAsync(address['@id'])
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <h1 className="flex items-center gap-2 text-2xl font-bold">
            {contact.contactNames?.[0]?.given} {contact.contactNames?.[0]?.family}
            <Star
              className={`h-6 w-6 cursor-pointer transition-transform hover:scale-110 ${isFavorite ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'
                }`}
              onClick={() => toggleFavorite(contact)}
            />
          </h1>
          {!!contact.contactGroups && contact.contactGroups.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {contact.contactGroups.map((cg, i) => {
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
    </div>
  )
}
