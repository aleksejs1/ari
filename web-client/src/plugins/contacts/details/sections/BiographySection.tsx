import { useTranslation } from 'react-i18next'
import { FileText } from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { Contact, ContactBiography } from '@/types/models'

import { ContactBioInlineEdit } from '../../components/ContactBioInlineEdit'
import { DisplayItem } from '../../components/DisplayItem'
import {
  useCreateContactBiography,
  useDeleteContactBiography,
  useUpdateContactBiography,
} from '../../useContacts'

export const BiographySection = ({ contact }: { contact: Contact }) => {
  const { t } = useTranslation('contacts')

  // Bio Mutations
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

  if (
    !contact.contactBiographies ||
    !Array.isArray(contact.contactBiographies) ||
    contact.contactBiographies.length === 0
  ) {
    return null
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{t('biography')}</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        {contact.contactBiographies.map((bio, i) => (
          <ContactBioInlineEdit
            key={i}
            bio={bio}
            onUpdate={handleUpdateBio}
            onDelete={() => handleDeleteBio(bio)}
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
