import type { ReactNode } from 'react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { formatDistanceToNow, parseISO } from 'date-fns'
import { Heart } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import type { NeedsAttentionContact } from '@/types/models'

import { InteractionEditDrawer } from '../components/InteractionEditDrawer'
import { useCreateInteraction, useNeedsAttention } from '../hooks/useInteractions'

function ContactRow({ contact }: { contact: NeedsAttentionContact }) {
  const { t } = useTranslation('contacts')
  const [drawerOpen, setDrawerOpen] = useState(false)
  const createMutation = useCreateInteraction()

  // The needs-attention DTO returns a blank-node @id, so build the real IRI from the numeric id.
  const contactIri = contact.id ? `/api/contacts/${contact.id}` : null

  return (
    <li className="flex items-center gap-3">
      <div className="min-w-0 flex-1">
        <Link
          to={`/contacts/${contact.id}`}
          className="truncate text-sm font-medium hover:underline"
        >
          {contact.displayName ?? '—'}
        </Link>
        <p className="truncate text-xs text-muted-foreground">
          {contact.lastInteractionAt
            ? formatDistanceToNow(parseISO(contact.lastInteractionAt), { addSuffix: true })
            : t('widgets.catchUp.never')}
        </p>
      </div>
      <Badge variant="destructive" className="shrink-0 text-xs font-normal">
        {t('interactions.overdueByDays', { count: contact.overdueDays })}
      </Badge>
      <button
        onClick={() => setDrawerOpen(true)}
        className="shrink-0 rounded px-2 py-1 text-xs text-primary hover:bg-muted"
      >
        {t('interactions.log')}
      </button>
      {contactIri ? (
        <InteractionEditDrawer
          open={drawerOpen}
          onOpenChange={setDrawerOpen}
          contactIri={contactIri}
          interaction={null}
          onSave={async (data) => {
            await createMutation.mutateAsync(data)
          }}
          onUpdate={async () => {
            // widget only creates new interactions
          }}
          isSaving={createMutation.isPending}
        />
      ) : null}
    </li>
  )
}

export default function CatchUpWidget() {
  const { t } = useTranslation('contacts')
  const { data: contacts, isLoading, isError } = useNeedsAttention(7)

  let content: ReactNode
  if (isLoading) {
    content = <p className="animate-pulse text-sm text-muted-foreground">{t('loading')}</p>
  } else if (isError) {
    content = <p className="text-sm text-destructive">{t('error')}</p>
  } else if (!contacts || contacts.length === 0) {
    content = <p className="text-sm text-muted-foreground">{t('widgets.catchUp.allCaughtUp')}</p>
  } else {
    content = (
      <ul className="space-y-3">
        {contacts.map((contact) => (
          <ContactRow key={contact['@id'] ?? contact.id} contact={contact} />
        ))}
      </ul>
    )
  }

  const hasOverdue = contacts && contacts.length > 0

  return (
    <Card className="flex h-full flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Heart className="h-5 w-5 text-rose-500" />
          {t('widgets.catchUp.title')}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1">{content}</CardContent>
      {hasOverdue ? (
        <CardFooter className="pt-0">
          <Link
            to="/contacts?needsAttention=true"
            className="text-xs text-muted-foreground hover:underline"
          >
            {t('widgets.catchUp.viewAll')}
          </Link>
        </CardFooter>
      ) : null}
    </Card>
  )
}
