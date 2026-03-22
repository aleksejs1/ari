import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { Contact, ContactInteraction } from '@/types/models'

import { InteractionEditDrawer } from '../../components/InteractionEditDrawer'
import { InteractionTimeline } from '../../components/InteractionTimeline'
import { useDeleteInteraction, useUpdateInteraction } from '../../hooks/useInteractions'

export function InteractionHistorySection({ contact }: { contact: Contact }) {
  const { t } = useTranslation('contacts')
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [editingInteraction, setEditingInteraction] = useState<ContactInteraction | null>(null)

  const updateMutation = useUpdateInteraction()
  const deleteMutation = useDeleteInteraction()

  if (!contact['@id']) {
    return null
  }

  const interactions = contact.contactInteractions ?? []
  const sorted = [...interactions].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
  )

  if (sorted.length === 0) {
    return null
  }

  const handleEdit = (interaction: ContactInteraction) => {
    setEditingInteraction(interaction)
    setDrawerOpen(true)
  }

  const handleDelete = async (interaction: ContactInteraction) => {
    if (!interaction['@id']) {
      return
    }
    try {
      await deleteMutation.mutateAsync(interaction['@id'])
    } catch (error) {
      console.error('Failed to delete interaction', error)
    }
  }

  return (
    <>
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">{t('interactions.historyTitle')}</CardTitle>
        </CardHeader>
        <CardContent>
          <InteractionTimeline
            interactions={sorted}
            onEdit={handleEdit}
            onDelete={(i) => void handleDelete(i)}
            isDeleting={deleteMutation.isPending}
          />
        </CardContent>
      </Card>

      <InteractionEditDrawer
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        contactIri={contact['@id']}
        interaction={editingInteraction}
        onSave={async () => {
          // edit-only drawer
        }}
        onUpdate={async (id, data) => {
          await updateMutation.mutateAsync({ id, data })
        }}
        isSaving={updateMutation.isPending}
      />
    </>
  )
}
