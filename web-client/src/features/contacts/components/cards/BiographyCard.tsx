import { FileText } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { ContactBioInlineEdit } from '../ContactBioInlineEdit'
import { DisplayItem } from '../DisplayItem'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { Contact, ContactBiography } from '@/types/models'

interface BiographyCardProps {
  contact: Contact
  onUpdateBio: (bio: ContactBiography) => void
  onDeleteBio: (bio: ContactBiography) => void
}

export const BiographyCard = ({ contact, onUpdateBio, onDeleteBio }: BiographyCardProps) => {
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
