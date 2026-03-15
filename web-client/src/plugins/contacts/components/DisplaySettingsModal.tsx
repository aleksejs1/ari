import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

import { useContactDisplayOptions } from '../hooks/useContactDisplayOptions'
import { type TypedColumnSpec } from '../utils'

function track(_event: string, _props: Record<string, unknown>): void {
  // analytics stub — wire up real tracker when pipeline is in place
}

interface DisplaySettingsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  typedColumns: TypedColumnSpec[]
  onSave: (typedColumns: TypedColumnSpec[]) => void
}

type Section = 'names' | 'phones' | 'emails' | 'dates'

export function DisplaySettingsModal({
  open,
  onOpenChange,
  typedColumns,
  onSave,
}: DisplaySettingsModalProps) {
  const { t } = useTranslation('contacts')
  const { data: displayOptions, isLoading } = useContactDisplayOptions()

  const [activeSection, setActiveSection] = useState<Section>('phones')
  const [localColumns, setLocalColumns] = useState<TypedColumnSpec[]>(typedColumns)

  useEffect(() => {
    if (open) {
      setLocalColumns(typedColumns)
      setActiveSection('phones')
    }
    // Only sync when the modal opens, not on every typedColumns reference change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  const sections: { id: Section; label: string }[] = [
    { id: 'names', label: t('displaySettings.fieldNames') },
    { id: 'phones', label: t('displaySettings.fieldPhones') },
    { id: 'emails', label: t('displaySettings.fieldEmails') },
    { id: 'dates', label: t('displaySettings.fieldDates') },
  ]

  function buildSpec(section: Section, qualifier: string): TypedColumnSpec {
    switch (section) {
      case 'names':
        return {
          baseField: 'contactNames',
          qualifier,
          id: `contactNames:${qualifier}`,
          label: t('displaySettings.localeLabel', { locale: qualifier }),
        }
      case 'phones':
        return {
          baseField: 'phoneNumbers',
          qualifier,
          id: `phoneNumbers:${qualifier}`,
          label: t('displaySettings.typeLabel', { type: qualifier }),
        }
      case 'emails':
        return {
          baseField: 'contactEmailAdresses',
          qualifier,
          id: `contactEmailAdresses:${qualifier}`,
          label: t('displaySettings.typeLabel', { type: qualifier }),
        }
      case 'dates':
        return {
          baseField: 'contactDates',
          qualifier,
          id: `contactDates:${qualifier}`,
          label: qualifier,
        }
    }
  }

  function toggleSpec(spec: TypedColumnSpec) {
    setLocalColumns((prev) => {
      const exists = prev.some((c) => c.id === spec.id)
      if (exists) {
        return prev.filter((c) => c.id !== spec.id)
      }
      return [...prev, spec]
    })
  }

  function getVariants(section: Section): string[] {
    if (!displayOptions) {
      return []
    }
    switch (section) {
      case 'names':
        return displayOptions.nameLocales
      case 'phones':
        return displayOptions.phoneTypes
      case 'emails':
        return displayOptions.emailTypes
      case 'dates':
        return displayOptions.dateTexts
    }
  }

  function handleSave() {
    onSave(localColumns)
    track('typed_columns_saved', {
      count: localColumns.length,
      fields: [...new Set(localColumns.map((c) => c.baseField))],
    })
    onOpenChange(false)
  }

  const variants = getVariants(activeSection)

  function renderVariantList() {
    if (isLoading) {
      return (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-5 w-full" />
          ))}
        </div>
      )
    }
    if (variants.length === 0) {
      return <p className="text-sm text-muted-foreground">{t('displaySettings.noVariants')}</p>
    }
    return (
      <div className="space-y-3">
        {variants.map((qualifier) => {
          const spec = buildSpec(activeSection, qualifier)
          const checked = localColumns.some((c) => c.id === spec.id)
          return (
            <label key={spec.id} className="flex cursor-pointer items-center gap-3">
              <Checkbox checked={checked} onCheckedChange={() => toggleSpec(spec)} id={spec.id} />
              <span className="text-sm">{spec.label}</span>
            </label>
          )
        })}
      </div>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl p-0" aria-describedby={undefined}>
        <DialogHeader className="px-6 pt-6">
          <DialogTitle>{t('displaySettings.title')}</DialogTitle>
        </DialogHeader>

        <div className="flex min-h-[360px]">
          {/* Left panel — section list */}
          <nav className="flex w-44 shrink-0 flex-col border-r py-2">
            {sections.map((s) => (
              <button
                key={s.id}
                type="button"
                className={cn(
                  'px-4 py-2 text-left text-sm transition-colors hover:bg-muted',
                  activeSection === s.id && 'bg-muted font-medium',
                )}
                onClick={() => setActiveSection(s.id)}
              >
                {s.label}
              </button>
            ))}
          </nav>

          {/* Right panel — variant checkboxes */}
          <div className="flex min-w-0 flex-1 flex-col">
            <ScrollArea className="flex-1 px-6 py-4" style={{ maxHeight: 360 }}>
              {renderVariantList()}
            </ScrollArea>
          </div>
        </div>

        <div className="flex items-center justify-between border-t px-6 py-4">
          <Button variant="ghost" size="sm" onClick={() => setLocalColumns([])}>
            {t('displaySettings.resetToDefaults')}
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => onOpenChange(false)}>
              {t('common.cancel')}
            </Button>
            <Button size="sm" onClick={handleSave}>
              {t('displaySettings.save')}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
