import { useTranslation } from 'react-i18next'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { Contact, ContactName } from '@/types/models'

import { AiSuggestionBadge } from '../../components/AiSuggestionBadge'
import { ContactNameInlineEdit } from '../../components/ContactNameInlineEdit'
import { useCreateContactName, useDeleteContactName, useUpdateContactName } from '../../useContacts'

export function ContactNamesSection({ contact }: { contact: Contact }) {
  const { t } = useTranslation('contacts')
  const updateMutation = useUpdateContactName()
  const createMutation = useCreateContactName()
  const deleteMutation = useDeleteContactName()

  const names = contact.contactNames ?? []

  if (names.length === 0) {
    return null
  }

  const handleUpdate = async (name: ContactName) => {
    if (!contact['@id']) {
      return
    }
    if (name['@id']) {
      await updateMutation.mutateAsync({ id: name['@id'], data: name })
    } else {
      await createMutation.mutateAsync({ ...name, contact: contact['@id'] })
    }
  }

  const handleDelete = async (name: ContactName) => {
    if (name['@id']) {
      await deleteMutation.mutateAsync(name['@id'])
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{t('names')}</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-2">
        {names.map((name, i) => (
          <div key={i} className="flex items-center gap-1">
            <div className="min-w-0 flex-1">
              <ContactNameInlineEdit
                name={name}
                onUpdate={(n) => void handleUpdate(n)}
                onDelete={() => void handleDelete(name)}
              />
            </div>
            {name.id ? <AiSuggestionBadge nameId={name.id} /> : null}
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
