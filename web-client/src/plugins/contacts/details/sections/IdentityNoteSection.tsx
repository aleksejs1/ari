import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import type { Contact } from '@/types/models'

import { useCreateContactBiography } from '../../useContacts'

/**
 * Returns true if the right column already has at least one visible section.
 * Mirrors the hide-when-empty logic of each right-column section component.
 * Graph Connections is async and omitted intentionally (rare enough to ignore).
 */
function hasRightColumnContent(contact: Contact): boolean {
  return [
    (contact.contactNames?.length ?? 0) > 1,
    (contact.phoneNumbers?.length ?? 0) > 0,
    (contact.contactEmailAdresses?.length ?? 0) > 0,
    (contact.contactAddresses?.length ?? 0) > 0,
    (contact.contactOrganizations?.length ?? 0) > 0,
    (contact.contactDates?.length ?? 0) > 0,
    (contact.contactBiographies?.length ?? 0) > 0,
    (contact.contactRelations?.length ?? 0) > 0,
  ].some(Boolean)
}

export function IdentityNoteSection({ contact }: { contact: Contact }) {
  const { t } = useTranslation('contacts')
  const [isAdding, setIsAdding] = useState(false)
  const [value, setValue] = useState('')
  const createBio = useCreateContactBiography()
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (isAdding) {
      textareaRef.current?.focus()
    }
  }, [isAdding])

  if (hasRightColumnContent(contact)) {
    return null
  }

  const firstName = contact.contactNames?.[0]?.given
  const lastName = contact.contactNames?.[0]?.family
  const name =
    contact.displayName ||
    [firstName, lastName].filter(Boolean).join(' ') ||
    t('identityNote.thisContact')

  const handleSave = async () => {
    if (!contact['@id'] || !value.trim()) {
      return
    }
    await createBio.mutateAsync({ value: value.trim(), type: 'private', contact: contact['@id'] })
    setIsAdding(false)
    setValue('')
  }

  const handleCancel = () => {
    setIsAdding(false)
    setValue('')
  }

  return (
    <Card className="border-dashed">
      <CardHeader>
        <CardTitle className="text-base">{t('identityNote.title')}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm font-medium">{t('identityNote.question', { name })}</p>
        <p className="text-sm text-muted-foreground">{t('identityNote.hint')}</p>
        {isAdding ? (
          <div className="space-y-2">
            <Textarea
              ref={textareaRef}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder={t('identityNote.placeholder')}
              rows={3}
            />
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={() => void handleSave()}
                disabled={!value.trim() || createBio.isPending}
              >
                {t('common.save')}
              </Button>
              <Button size="sm" variant="ghost" onClick={handleCancel}>
                {t('common.cancel')}
              </Button>
            </div>
          </div>
        ) : (
          <Button
            variant="link"
            size="sm"
            className="h-auto p-0 text-sm"
            onClick={() => setIsAdding(true)}
          >
            {t('identityNote.addNote')}
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
