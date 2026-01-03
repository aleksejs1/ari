import { Check, X } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { InlineEditTrigger } from './InlineEditTrigger'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { ScrollArea } from '@/components/ui/scroll-area'
import { type Contact, type Group } from '@/types/models'

interface ContactGroupInlineEditProps {
  contact: Contact
  groups: Group[]
  onUpdate: (contact: Contact, groupIds: string[]) => void
}

export function ContactGroupInlineEdit({ contact, groups, onUpdate }: ContactGroupInlineEditProps) {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)

  // Extract group IDs from contact's groups.
  // contact.contactGroups items usually have a groupResource which is the IRI (string) or an object with @id.
  const initialGroupIds = (contact.contactGroups || [])
    .map((cg) => {
      if (typeof cg.groupResource === 'string') {
        return cg.groupResource
      }
      return (cg.groupResource as { '@id': string })?.['@id']
    })
    .filter(Boolean) as string[]

  const [selectedGroupIds, setSelectedGroupIds] = useState<string[]>(initialGroupIds)

  const handleOpenChange = (isOpen: boolean) => {
    if (isOpen) {
      // Reset state on open
      const currentIds = (contact.contactGroups || [])
        .map((cg) => {
          if (typeof cg.groupResource === 'string') {
            return cg.groupResource
          }
          return (cg.groupResource as { '@id': string })?.['@id']
        })
        .filter(Boolean) as string[]
      setSelectedGroupIds(currentIds)
    }
    setOpen(isOpen)
  }

  const handleToggleGroup = (groupId: string) => {
    setSelectedGroupIds((prev) =>
      prev.includes(groupId) ? prev.filter((id) => id !== groupId) : [...prev, groupId],
    )
  }

  const handleSave = () => {
    onUpdate(contact, selectedGroupIds)
    setOpen(false)
  }

  const hasGroups = (contact.contactGroups || []).length > 0

  const formContent = (
    <div className="flex flex-col gap-2">
      <ScrollArea className="h-[200px] w-full rounded-md border p-2">
        <div className="flex flex-col gap-2">
          {groups.map((group) => (
            <div key={group['@id']} className="flex items-center space-x-2">
              <Checkbox
                id={`group-${group['@id']}`}
                checked={selectedGroupIds.includes(group['@id'])}
                onCheckedChange={() => handleToggleGroup(group['@id'])}
              />
              <Label
                htmlFor={`group-${group['@id']}`}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {group.name}
              </Label>
            </div>
          ))}
        </div>
      </ScrollArea>
      <div className="flex justify-end gap-2">
        <Button
          size="sm"
          variant="ghost"
          onClick={() => setOpen(false)}
          className="h-8 text-gray-500"
        >
          <X className="mr-1 h-4 w-4" />
          {t('common.cancel')}
        </Button>
        <Button
          size="sm"
          onClick={handleSave}
          className="h-8 bg-green-600 text-white hover:bg-green-700"
        >
          <Check className="mr-1 h-4 w-4" />
          {t('common.save')}
        </Button>
      </div>
    </div>
  )

  const content = (
    <div className="flex flex-wrap gap-1">
      {contact.contactGroups?.map((cg, i) => {
        const groupIri =
          typeof cg.groupResource === 'string'
            ? cg.groupResource
            : (cg.groupResource as { '@id'?: string })?.['@id']

        if (!groupIri) {
          return null
        }

        const group = groups.find((g) => g['@id'] === groupIri)
        const label = group?.name || '...'

        return (
          <span
            key={i}
            className="inline-flex items-center rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10"
          >
            {label}
          </span>
        )
      })}
    </div>
  )

  return (
    <InlineEditTrigger
      isExistent={hasGroups}
      label={t('contacts.groups')}
      open={open}
      onOpenChange={handleOpenChange}
      popoverContent={formContent}
    >
      {content}
    </InlineEditTrigger>
  )
}
