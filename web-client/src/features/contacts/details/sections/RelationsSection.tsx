import { Users } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { Contact } from '@/types/models'

// Helper functions (duplicated from RelationsCard, can be shared later in utils)
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
  relation: any,
  t: (key: string, options?: { defaultValue?: string }) => string,
): string => {
  if (relation.displayName) {
    return relation.displayName
  }
  if (
    typeof relation.relatedContact === 'object' &&
    relation.relatedContact !== null &&
    (relation.relatedContact as any).displayName
  ) {
    return (relation.relatedContact as any).displayName
  }
  return t('common.unknown')
}

export const RelationsSection = ({ contact }: { contact: Contact }) => {
  const { t } = useTranslation()
  if (
    !contact.contactRelations ||
    !Array.isArray(contact.contactRelations) ||
    contact.contactRelations.length === 0
  ) {
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
