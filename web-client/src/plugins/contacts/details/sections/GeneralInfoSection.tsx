import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { Download, Loader2, Pencil, Star, Trash2 } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { getContrastingTextColor } from '@/lib/colors'
import type { Contact } from '@/types/models'

import { AvatarUpload } from '../../components/AvatarUpload'
import { ContactForm } from '../../components/ContactForm'
import { mapContactToFormValues } from '../../contactUtils'
import { useContactFavorite } from '../../hooks/useContactFavorite'
import { useGroups, useUpdateContact, useUploadContactAvatar } from '../../useContacts'

const getGroupFilterValue = (groupResource: any): string | null => {
  if (typeof groupResource === 'string') {
    return groupResource
  }
  if (
    typeof groupResource === 'object' &&
    groupResource !== null &&
    '@id' in groupResource &&
    typeof groupResource['@id'] === 'string'
  ) {
    return groupResource['@id']
  }
  return null
}

const getGroupName = (groupResource: any): string => {
  if (typeof groupResource === 'string') {
    return groupResource.split('/').pop() || groupResource
  }
  if (typeof groupResource === 'object' && groupResource !== null && 'name' in groupResource) {
    return groupResource.name
  }
  return ''
}

interface ContactActionButtonsProps {
  onEditingChange?: (val: boolean) => void
  onExport?: () => void
  isExportPending?: boolean
  onDelete?: () => void
  setEffectiveIsEditing: (val: boolean) => void
}

function ContactActionButtons({
  onEditingChange,
  onExport,
  isExportPending,
  onDelete,
  setEffectiveIsEditing,
}: ContactActionButtonsProps) {
  const { t } = useTranslation('contacts')

  if (!onExport && !onDelete && !onEditingChange) {
    return null
  }

  return (
    <TooltipProvider>
      <div className="flex shrink-0 items-center gap-1">
        {onEditingChange ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setEffectiveIsEditing(true)}
                data-testid="contact-edit-button"
              >
                <Pencil className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>{t('edit')}</TooltipContent>
          </Tooltip>
        ) : null}
        {onExport ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={onExport}
                disabled={isExportPending}
                data-testid="contact-export-vcard"
              >
                {isExportPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Download className="h-4 w-4" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>{t('exportVcard')}</TooltipContent>
          </Tooltip>
        ) : null}
        {onDelete ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={onDelete}
                data-testid="contact-delete-button"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>{t('common.delete')}</TooltipContent>
          </Tooltip>
        ) : null}
      </div>
    </TooltipProvider>
  )
}

function ContactFavoriteButton({ contact, isFavorite }: { contact: Contact; isFavorite: boolean }) {
  const { t } = useTranslation('contacts')
  const { toggleFavorite } = useContactFavorite()

  return (
    <button
      className="ml-2 rounded-full p-2 hover:bg-muted focus:outline-none focus:ring-2 focus:ring-primary"
      onClick={() => toggleFavorite(contact)}
      aria-label={isFavorite ? t('removeFromFavorites') : t('addToFavorites')}
    >
      <Star
        className={`h-6 w-6 transition-transform hover:scale-110 ${
          isFavorite ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'
        }`}
      />
    </button>
  )
}

function ContactGroupsBadgeList({ contactGroups }: { contactGroups: Contact['contactGroups'] }) {
  const { data: groupsFetched } = useGroups()

  if (!contactGroups || !Array.isArray(contactGroups) || contactGroups.length === 0) {
    return null
  }

  return (
    <div className="flex flex-wrap gap-2">
      {contactGroups.map((cg, i) => {
        const groupIri = getGroupFilterValue(cg.groupResource)
        const name = getGroupName(cg.groupResource)
        if (!name) {
          return null
        }

        const fullGroup = groupsFetched?.find((g) => g['@id'] === groupIri)

        return (
          <Link
            key={i}
            to={groupIri ? `/contacts?group=${encodeURIComponent(groupIri)}` : '#'}
            className="hover:opacity-80"
          >
            <Badge
              variant="secondary"
              className={fullGroup?.color ? 'border-transparent' : ''}
              style={
                fullGroup?.color
                  ? {
                      backgroundColor: fullGroup.color,
                      borderColor: fullGroup.color,
                      color: getContrastingTextColor(fullGroup.color),
                    }
                  : undefined
              }
            >
              {name}
            </Badge>
          </Link>
        )
      })}
    </div>
  )
}

function useGeneralInfoEditing(
  contact: Contact,
  onEditingChange: ((val: boolean) => void) | undefined,
  isEditing: boolean,
) {
  const [localIsEditing, setLocalIsEditing] = useState(false)
  const effectiveIsEditing = onEditingChange !== undefined ? isEditing : localIsEditing
  const setEffectiveIsEditing = onEditingChange ?? setLocalIsEditing
  const updateMutation = useUpdateContact()
  const uploadAvatarMutation = useUploadContactAvatar()
  const defaultValues = mapContactToFormValues(contact)

  const handleAvatarUpload = async (file: File) => {
    if (contact['@id']) {
      await uploadAvatarMutation.mutateAsync({ id: contact['@id'], file })
    }
  }

  const handleSubmit = async (data: any) => {
    if (contact['@id']) {
      try {
        await updateMutation.mutateAsync({ id: contact['@id'], data })
        setEffectiveIsEditing(false)
      } catch (error) {
        console.error('Failed to update contact', error)
      }
    }
  }

  return {
    effectiveIsEditing,
    setEffectiveIsEditing,
    updateMutation,
    defaultValues,
    handleAvatarUpload,
    handleSubmit,
  }
}

export function GeneralInfoSection({
  contact,
  isEditing = false,
  onEditingChange,
  onExport,
  isExportPending,
  onDelete,
}: {
  contact: Contact
  isEditing?: boolean
  onEditingChange?: (val: boolean) => void
  onExport?: () => void
  isExportPending?: boolean
  onDelete?: () => void
}) {
  const { t } = useTranslation('contacts')
  const { isContactFavorite } = useContactFavorite()
  const isFavorite = isContactFavorite(contact)
  const primaryName = contact.contactNames?.[0]
  const givenName = primaryName?.given
  const familyName = primaryName?.family
  const {
    effectiveIsEditing,
    setEffectiveIsEditing,
    updateMutation,
    defaultValues,
    handleAvatarUpload,
    handleSubmit,
  } = useGeneralInfoEditing(contact, onEditingChange, isEditing)

  // NOTE: The previous design had the "Edit" button in the Header trigger the FULL PAGE edit mode.
  // The User Request says: "GeneralInfoSection.tsx (Former ContactViewHeader)".
  // AND: "ContactDetailsPage ... Left static header ... Instead of <ContactView /> render list of sections".
  // BUT: The original ContactDetailsPage handled the "Edit Mode" for the MAIN form (name, etc).
  // AND: The original ContactViewHeader had the "Edit" button that triggered `onEdit` prop passed from ContactDetailsPage.

  // Implementation Decision:
  // Since we are moving to Smart Sections, this section should ideally handle its own editing (Name, Avatar).
  // However, the original "Edit" button switched the WHOLE page to `ContactForm`.
  // Ideally we should inline edit, but for now to preserve behavior, we might need a way to edit the main contact info.
  // Refactoring `ContactForm` into `GeneralInfoSection` is a bit complex because `ContactForm` is big.

  // Let's implement an Inline Edit for this section only?
  // The Task says "ContactDetailsPage should render sections".
  // In `ContactDetailsPage.tsx`:
  // 119:       {isEditing ? (
  // 120:         <Card> ... <ContactForm ... /> ... </Card>
  // 133:         <ContactView ... />

  // The "Edit" mode was mutually exclusive with the View mode.
  // If we move to sections, "Edit Mode" for the whole page is slightly awkward if we want "Smart Sections".
  // HOWEVER, `ContactForm` edits core fields (Name, Avatar, Bio, etc) ALL AT ONCE.
  // Many "Smart Sections" (Phones, Emails) interact with `useContactPhones` etc individually.
  // BUT `GeneralInfo` (Name) is usually on the main `Contact` entity.

  // Current Strategy:
  // Render "Read View" by default.
  // When "Edit" is clicked IN THIS SECTION, show the `ContactForm` form logic IN THIS SECTION?
  // Or maybe we treat `GeneralInfoSection` as the place where you edit the core details.

  if (effectiveIsEditing) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>{t('editContact')}</CardTitle>
          <Button variant="ghost" size="sm" onClick={() => setEffectiveIsEditing(false)}>
            {t('common.cancel')}
          </Button>
        </CardHeader>
        <CardContent>
          <ContactForm
            defaultValues={defaultValues}
            onSubmit={handleSubmit}
            isSubmitting={updateMutation.isPending}
          />
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="flex items-start justify-between gap-4">
      <div className="flex items-start gap-4">
        <AvatarUpload
          currentAvatar={contact.avatar}
          displayName={`${givenName} ${familyName}`}
          className="mt-1"
          onUpload={handleAvatarUpload}
        />
        <div className="space-y-2">
          <h1 className="flex items-center gap-2 text-2xl font-bold">
            {givenName} {familyName}
            <ContactFavoriteButton contact={contact} isFavorite={isFavorite} />
          </h1>
          <ContactGroupsBadgeList contactGroups={contact.contactGroups} />
        </div>
      </div>

      <ContactActionButtons
        onEditingChange={onEditingChange}
        onExport={onExport}
        isExportPending={isExportPending}
        onDelete={onDelete}
        setEffectiveIsEditing={setEffectiveIsEditing}
      />
    </div>
  )
}
