import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { UserPlus } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { type Contact, type ContactRelation, PREDEFINED_RELATIONS } from '@/types/models'

import { useCreateContactRelation, useSimilarContacts } from '../useContacts'

interface SimilarContactsWidgetProps {
  contactId: string
  existingRelations?: ContactRelation[]
}

const getContactDisplayName = (contact: Contact, t: (key: string) => string) => {
  if (contact.displayName) {
    return contact.displayName
  }

  const name = contact.contactNames?.[0]
  if (name) {
    const fullName = `${name.given ?? ''} ${name.family ?? ''}`.trim()
    if (fullName) {
      return fullName
    }
  }

  return t('contacts.noName')
}

const SimilarContactItem = ({
  contact,
  onAddRelation,
  isAlreadyRelated,
}: {
  contact: Contact
  onAddRelation: (contact: Contact) => void
  isAlreadyRelated: boolean
}) => {
  const { t } = useTranslation()
  const id = contact['@id']?.split('/').pop()
  const displayName = getContactDisplayName(contact, t)
  const organizationName = contact.contactOrganizations?.[0]?.name

  return (
    <li className="flex items-center justify-between">
      <div className="flex flex-col">
        <Link to={`/contacts/${id}`} className="font-medium hover:underline">
          {displayName}
        </Link>
        <span className="text-sm text-muted-foreground">{organizationName}</span>
      </div>
      {!isAlreadyRelated && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onAddRelation(contact)}
          title={t('contacts.addRelation')}
        >
          <UserPlus className="h-4 w-4" />
        </Button>
      )}
    </li>
  )
}

const RelationDialog = ({
  isOpen,
  onOpenChange,
  onSave,
  contact,
  isSaving,
}: {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  onSave: (type: string) => void
  contact: Contact | null
  isSaving: boolean
}) => {
  const { t } = useTranslation()
  const [relationType, setRelationType] = useState('')

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {t('contacts.addRelation')} {contact?.displayName}
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="relation-type">{t('contacts.relationType')}</Label>
            <Input
              id="relation-type"
              placeholder={t('contacts.relationTypePlaceholder')}
              value={relationType}
              onChange={(e) => setRelationType(e.target.value)}
              list="predefined-relations-quick"
            />
            <datalist id="predefined-relations-quick">
              {PREDEFINED_RELATIONS.map((type) => (
                <option key={type} value={type}>
                  {t(`contacts.relationTypes.${type}`)}
                </option>
              ))}
            </datalist>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t('common.cancel')}
          </Button>
          <Button onClick={() => onSave(relationType)} disabled={!relationType || isSaving}>
            {isSaving ? t('common.saving') : t('common.save')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export function SimilarContactsWidget({
  contactId,
  existingRelations,
}: SimilarContactsWidgetProps) {
  const { t } = useTranslation()
  const { data: similarContacts, isLoading, error } = useSimilarContacts(contactId)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null)
  const createRelationMutation = useCreateContactRelation()

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
    return null
  }

  const existingRelatedIds = new Set(
    existingRelations?.map((r) =>
      typeof r.relatedContact === 'string' ? r.relatedContact : r.relatedContact['@id'],
    ),
  )

  const handleSaveRelation = async (type: string) => {
    if (!selectedContact?.['@id'] || !type) {
      return
    }

    try {
      await createRelationMutation.mutateAsync({
        contact: contactId,
        relatedContact: selectedContact['@id'],
        type,
      })
      setIsDialogOpen(false)
      setSelectedContact(null)
    } catch (err) {
      console.error('Failed to create relation', err)
    }
  }

  // Limit to 5 contacts
  const displayedContacts = similarContacts.slice(0, 5)

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>{t('contacts.similarContacts')}</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-4">
            {displayedContacts.map((contact) => (
              <SimilarContactItem
                key={contact.id || contact['@id']}
                contact={contact}
                isAlreadyRelated={existingRelatedIds.has(contact['@id'])}
                onAddRelation={(c) => {
                  setSelectedContact(c)
                  setIsDialogOpen(true)
                }}
              />
            ))}
          </ul>
        </CardContent>
      </Card>

      <RelationDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        contact={selectedContact}
        onSave={(type) => void handleSaveRelation(type)}
        isSaving={createRelationMutation.isPending}
      />
    </>
  )
}
