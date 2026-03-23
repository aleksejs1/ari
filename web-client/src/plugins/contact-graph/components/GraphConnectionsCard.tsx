import { useTranslation } from 'react-i18next'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { Contact } from '@/types/models'

import { useContactGraph } from '../api/useContactGraph'

import { ContactGraphWidget } from './ContactGraphWidget'

export function GraphConnectionsCard({ contact }: { contact: Contact }) {
  const { t } = useTranslation()
  const contactId = contact.id?.toString() ?? ''
  // Same query key as ContactGraphWidget — TanStack Query returns cached data, no extra request.
  const { data, isLoading } = useContactGraph(contactId ? { contactId, level: 2 } : {})

  if (!contact.id) {
    return null
  }

  if (!isLoading && data && data.nodes.length <= 1) {
    return null
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('contactGraph.widgetTitle', 'Graph Connections')}</CardTitle>
      </CardHeader>
      <CardContent>
        <ContactGraphWidget contactId={contactId} />
      </CardContent>
    </Card>
  )
}
