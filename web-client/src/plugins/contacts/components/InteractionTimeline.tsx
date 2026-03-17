import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { format, parseISO } from 'date-fns'
import { Pencil, Trash2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import type { ContactInteraction } from '@/types/models'

import { InteractionTypeIcon } from './InteractionTypeIcon'

interface InteractionTimelineProps {
  interactions: ContactInteraction[]
  onEdit: (interaction: ContactInteraction) => void
  onDelete: (interaction: ContactInteraction) => void
  isDeleting?: boolean
}

export function InteractionTimeline({
  interactions,
  onEdit,
  onDelete,
  isDeleting = false,
}: InteractionTimelineProps) {
  const { t } = useTranslation('contacts')
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null)

  if (interactions.length === 0) {
    return <p className="text-sm text-muted-foreground">{t('interactions.noInteractions')}</p>
  }

  return (
    <div className="space-y-3">
      {interactions.map((interaction, i) => {
        const id = interaction['@id'] ?? String(i)
        const isPendingDelete = pendingDeleteId === id

        return (
          <div key={id} className="flex items-start gap-3">
            <div className="mt-0.5 shrink-0 rounded-full bg-muted p-1.5">
              <InteractionTypeIcon
                type={interaction.type}
                className="h-3.5 w-3.5 text-muted-foreground"
              />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                <span className="text-sm font-medium">
                  {t(`interactions.types.${interaction.type}`, { defaultValue: interaction.type })}
                </span>
                {interaction.initiator ? (
                  <span className="text-xs text-muted-foreground">
                    ·{' '}
                    {t(`interactions.initiators.${interaction.initiator}`, {
                      defaultValue: interaction.initiator,
                    })}
                  </span>
                ) : null}
                <span className="ml-auto text-xs text-muted-foreground">
                  {format(parseISO(interaction.timestamp), 'MMM d, yyyy')}
                </span>
              </div>
              {interaction.description ? (
                <p className="mt-0.5 line-clamp-2 text-sm text-muted-foreground">
                  {interaction.description}
                </p>
              ) : null}
              {interaction.tags && interaction.tags.length > 0 ? (
                <div className="mt-1 flex flex-wrap gap-1">
                  {interaction.tags.map((tag) => (
                    <span key={tag} className="rounded bg-muted px-1.5 py-0.5 text-xs">
                      {tag}
                    </span>
                  ))}
                </div>
              ) : null}
              {isPendingDelete ? (
                <div className="mt-2 flex items-center gap-2">
                  <span className="text-xs text-destructive">
                    {t('interactions.deleteConfirm')}
                  </span>
                  <Button
                    variant="destructive"
                    size="sm"
                    className="h-6 px-2 text-xs"
                    disabled={isDeleting}
                    onClick={() => {
                      onDelete(interaction)
                      setPendingDeleteId(null)
                    }}
                  >
                    {t('common.delete')}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 px-2 text-xs"
                    onClick={() => setPendingDeleteId(null)}
                  >
                    {t('common.cancel')}
                  </Button>
                </div>
              ) : null}
            </div>
            <div className="flex shrink-0 gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={() => onEdit(interaction)}
              >
                <Pencil className="h-3.5 w-3.5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-destructive hover:text-destructive"
                onClick={() => setPendingDeleteId(isPendingDelete ? null : id)}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        )
      })}
    </div>
  )
}
