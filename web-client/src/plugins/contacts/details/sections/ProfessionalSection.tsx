import { useTranslation } from 'react-i18next'
import { Briefcase } from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { Contact, ContactOrganization } from '@/types/models'

import { ContactOrganizationInlineEdit } from '../../components/ContactOrganizationInlineEdit'
import { DisplayItem } from '../../components/DisplayItem'
import {
  useCreateContactOrganization,
  useDeleteContactOrganization,
  useUpdateContactOrganization,
} from '../../useContacts'

export const ProfessionalSection = ({ contact }: { contact: Contact }) => {
  const { t } = useTranslation()

  // Organization Mutations
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

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{t('contacts.professional')}</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        {(Array.isArray(contact.contactOrganizations) ? contact.contactOrganizations : []).map(
          (org, i) => (
            <ContactOrganizationInlineEdit
              key={i}
              organization={org}
              onUpdate={handleUpdateOrganization}
              onDelete={() => handleDeleteOrganization(org)}
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
          ),
        )}
      </CardContent>
    </Card>
  )
}
