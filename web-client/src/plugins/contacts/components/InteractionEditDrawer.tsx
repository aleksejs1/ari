import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Loader2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Textarea } from '@/components/ui/textarea'
import type { ContactInteraction } from '@/types/models'

const INTERACTION_TYPES = ['call', 'email', 'meeting', 'other'] as const
const INITIATORS = ['me', 'them'] as const

function toDateInputValue(isoString: string): string {
  return isoString.slice(0, 10)
}

function toIsoString(dateValue: string): string {
  return `${dateValue}T12:00:00+00:00`
}

interface FormDefaults {
  type: string
  timestamp: string
  description: string
  initiator: string
  tagsInput: string
}

function getFormDefaults(
  interaction: ContactInteraction | null | undefined,
  today: string,
): FormDefaults {
  if (!interaction) {
    return { type: 'call', timestamp: today, description: '', initiator: '', tagsInput: '' }
  }
  return {
    type: interaction.type,
    timestamp: interaction.timestamp ? toDateInputValue(interaction.timestamp) : today,
    description: interaction.description ?? '',
    initiator: interaction.initiator ?? '',
    tagsInput: interaction.tags ? interaction.tags.join(', ') : '',
  }
}

interface InteractionEditDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  contactIri: string
  interaction?: ContactInteraction | null
  onSave: (
    data: Omit<ContactInteraction, '@id' | '@type' | 'createdAt'> & { contact: string },
  ) => Promise<void>
  onUpdate: (id: string, data: Partial<ContactInteraction>) => Promise<void>
  isSaving?: boolean
}

export function InteractionEditDrawer({
  open,
  onOpenChange,
  contactIri,
  interaction,
  onSave,
  onUpdate,
  isSaving = false,
}: InteractionEditDrawerProps) {
  const { t } = useTranslation('contacts')

  const [type, setType] = useState<string>('call')
  const [timestamp, setTimestamp] = useState<string>('')
  const [description, setDescription] = useState<string>('')
  const [initiator, setInitiator] = useState<string>('')
  const [tagsInput, setTagsInput] = useState<string>('')

  useEffect(() => {
    if (!open) {
      return
    }
    const today = new Date().toISOString().slice(0, 10)
    const defaults = getFormDefaults(interaction, today)
    setType(defaults.type)
    setTimestamp(defaults.timestamp)
    setDescription(defaults.description)
    setInitiator(defaults.initiator)
    setTagsInput(defaults.tagsInput)
  }, [open, interaction])

  const buildPayload = () => {
    const tags = tagsInput
      .split(',')
      .map((tag) => tag.trim())
      .filter(Boolean)
    return {
      type,
      timestamp: toIsoString(timestamp),
      description: description || null,
      initiator: (initiator as 'me' | 'them') || null,
      tags: tags.length > 0 ? tags : null,
    }
  }

  const handleSubmit = async () => {
    if (!timestamp) {
      return
    }
    try {
      const payload = buildPayload()
      if (interaction?.['@id']) {
        await onUpdate(interaction['@id'], payload)
      } else {
        await onSave({ ...payload, contact: contactIri })
      }
      onOpenChange(false)
    } catch (error) {
      console.error('Failed to save interaction', error)
    }
  }

  const isEditing = !!interaction?.['@id']

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex flex-col gap-0 overflow-y-auto">
        <SheetHeader className="mb-6">
          <SheetTitle>
            {isEditing ? t('interactions.editTitle') : t('interactions.addTitle')}
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="interaction-type">{t('interactions.type')}</Label>
            <select
              id="interaction-type"
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              {INTERACTION_TYPES.map((interactionType) => (
                <option key={interactionType} value={interactionType}>
                  {t(`interactions.types.${interactionType}`, { defaultValue: interactionType })}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="interaction-date">{t('interactions.date')}</Label>
            <Input
              id="interaction-date"
              type="date"
              value={timestamp}
              onChange={(e) => setTimestamp(e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="interaction-description">{t('interactions.description')}</Label>
            <Textarea
              id="interaction-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t('interactions.descriptionPlaceholder')}
              rows={3}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="interaction-initiator">{t('interactions.initiator')}</Label>
            <select
              id="interaction-initiator"
              value={initiator}
              onChange={(e) => setInitiator(e.target.value)}
              className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              <option value="">{t('interactions.initiatorNone')}</option>
              {INITIATORS.map((v) => (
                <option key={v} value={v}>
                  {t(`interactions.initiators.${v}`, { defaultValue: v })}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="interaction-tags">{t('interactions.tags')}</Label>
            <Input
              id="interaction-tags"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder={t('interactions.tagsPlaceholder')}
            />
          </div>
        </div>

        <SheetFooter className="mt-6">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t('common.cancel')}
          </Button>
          <Button onClick={() => void handleSubmit()} disabled={isSaving || !timestamp}>
            {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            {t('common.save')}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
