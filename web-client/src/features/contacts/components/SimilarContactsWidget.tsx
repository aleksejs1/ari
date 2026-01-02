import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import { useSimilarContacts } from '../useContacts'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface SimilarContactsWidgetProps {
  contactId: string
}

export function SimilarContactsWidget({ contactId }: SimilarContactsWidgetProps) {
  const { t } = useTranslation()
  const { data: similarContacts, isLoading, error } = useSimilarContacts(contactId)

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t('contacts.similarContacts')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="py-4 text-center text-muted-foreground">{t('app.loading')}</div>
        </CardContent>
      </Card>
    )
  }

  if (error || !similarContacts || similarContacts.length === 0) {
    // If error or no similar contacts, we might choose not to render anything or render a message.
    // Spec didn't say to hide if empty, but usually "list of similar contacts" implies showing them.
    // If empty, displaying "No similar contacts" or hiding is better than error.
    if (similarContacts?.length === 0) {
      return null
    }
    return null // Hide if empty or error for now, or could show empty state.
  }

  // Limit to 5 contacts
  const displayedContacts = similarContacts.slice(0, 5)

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('contacts.similarContacts')}</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {displayedContacts.map((contact) => {
            const id = contact['@id']?.split('/').pop()
            return (
              <li key={contact.id || contact['@id']} className="flex items-center justify-between">
                <Link to={`/contacts/${id}`} className="font-medium hover:underline">
                  {contact.displayName || contact.contactNames?.[0]?.name || t('contacts.noName')}
                </Link>
                {/* Add more details if needed, e.g. organization */}
                <span className="text-sm text-muted-foreground">
                  {contact.contactOrganizations?.[0]?.name}
                </span>
              </li>
            )
          })}
        </ul>
      </CardContent>
    </Card>
  )
}
