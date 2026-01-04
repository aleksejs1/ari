import { Briefcase } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { ContactOrganizationInlineEdit } from '../ContactOrganizationInlineEdit'
import { DisplayItem } from '../DisplayItem'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { Contact, ContactOrganization } from '@/types/models'

interface ProfessionalCardProps {
  contact: Contact
  onUpdateOrganization: (org: ContactOrganization) => void
  onDeleteOrganization: (org: ContactOrganization) => void
}

export const ProfessionalCard = ({
  contact,
  onUpdateOrganization,
  onDeleteOrganization,
}: ProfessionalCardProps) => {
  const { t } = useTranslation()
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{t('contacts.professional')}</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        {contact.contactOrganizations?.map((org, i) => (
          <ContactOrganizationInlineEdit
            key={i}
            organization={org}
            onUpdate={onUpdateOrganization}
            onDelete={() => onDeleteOrganization(org)}
            hideAddButton
            className="h-auto w-full"
          >
            <DisplayItem
              icon={Briefcase}
              label={org.type || t('contacts.organization')}
              value={org.name}
              subValue={[org.title, org.department].filter(Boolean).join(' - ')}
            />
          </ContactOrganizationInlineEdit>
        ))}
      </CardContent>
    </Card>
  )
}
