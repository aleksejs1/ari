import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Check, Pencil, Plus, X } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import type { Contact, ContactInteraction } from '@/types/models'

import { InteractionEditDrawer } from '../../components/InteractionEditDrawer'
import { useCreateInteraction, useUpdateContactCadence } from '../../hooks/useInteractions'

function computeOverdueDays(
  interactions: ContactInteraction[],
  cadenceDays: number,
): number | null {
  if (interactions.length === 0) {
    return cadenceDays
  }
  const sorted = [...interactions].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
  )
  const lastMs = new Date(sorted[0].timestamp).getTime()
  const nowMs = Date.now()
  const daysSinceLast = Math.floor((nowMs - lastMs) / 86_400_000)
  const overdue = daysSinceLast - cadenceDays
  return overdue > 0 ? overdue : null
}

interface CadenceEditorProps {
  contactIri: string
  cadenceDays: number | null | undefined
}

function CadenceEditor({ contactIri, cadenceDays }: CadenceEditorProps) {
  const { t } = useTranslation('contacts')
  const [editing, setEditing] = useState(false)
  const [value, setValue] = useState(cadenceDays?.toString() ?? '')
  const updateCadence = useUpdateContactCadence()

  const handleSave = async () => {
    const parsed = value === '' ? null : parseInt(value, 10)
    if (parsed !== null && (isNaN(parsed) || parsed <= 0)) {
      return
    }
    try {
      await updateCadence.mutateAsync({ id: contactIri, cadenceDays: parsed })
      setEditing(false)
    } catch (error) {
      console.error('Failed to update cadence', error)
    }
  }

  const handleCancel = () => {
    setValue(cadenceDays?.toString() ?? '')
    setEditing(false)
  }

  if (editing) {
    return (
      <div className="flex items-center gap-2">
        <Input
          type="number"
          min={1}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="h-7 w-24 text-sm"
          placeholder={t('interactions.cadencePlaceholder')}
        />
        <span className="text-sm text-muted-foreground">{t('interactions.days')}</span>
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => void handleSave()}>
          <Check className="h-3.5 w-3.5" />
        </Button>
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={handleCancel}>
          <X className="h-3.5 w-3.5" />
        </Button>
      </div>
    )
  }

  return (
    <button
      onClick={() => {
        setValue(cadenceDays?.toString() ?? '')
        setEditing(true)
      }}
      className="flex items-center gap-1.5 rounded px-1 py-0.5 text-sm hover:bg-muted"
    >
      {cadenceDays !== null && cadenceDays !== undefined ? (
        <>
          {t('interactions.everyNDays', { count: cadenceDays })}
          <Pencil className="h-3 w-3 text-muted-foreground" />
        </>
      ) : (
        <span className="text-muted-foreground">{t('interactions.setCadence')}</span>
      )}
    </button>
  )
}

export function KeepInTouchSection({ contact }: { contact: Contact }) {
  const { t } = useTranslation('contacts')
  const [drawerOpen, setDrawerOpen] = useState(false)

  const createMutation = useCreateInteraction()

  if (!contact['@id']) {
    return null
  }

  const interactions = contact.contactInteractions ?? []
  const overdueDays =
    contact.cadenceDays !== null && contact.cadenceDays !== undefined
      ? computeOverdueDays(interactions, contact.cadenceDays)
      : null

  return (
    <>
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between gap-2">
            <CardTitle className="flex items-center gap-2 text-base">
              {t('interactions.sectionTitle')}
              {overdueDays !== null && (
                <Badge variant="destructive" className="text-xs font-normal">
                  {t('interactions.overdueByDays', { count: overdueDays })}
                </Badge>
              )}
            </CardTitle>
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5"
              onClick={() => setDrawerOpen(true)}
            >
              <Plus className="h-3.5 w-3.5" />
              {t('interactions.log')}
            </Button>
          </div>
          <div className="mt-1">
            <CadenceEditor contactIri={contact['@id']} cadenceDays={contact.cadenceDays} />
          </div>
        </CardHeader>
      </Card>

      <InteractionEditDrawer
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        contactIri={contact['@id']}
        interaction={null}
        onSave={async (data) => {
          await createMutation.mutateAsync(data)
        }}
        onUpdate={async () => {
          // create-only drawer
        }}
        isSaving={createMutation.isPending}
      />
    </>
  )
}
