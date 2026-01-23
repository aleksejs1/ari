import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Check, X } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { ScrollArea } from '@/components/ui/scroll-area'
import { getContrastingTextColor } from '@/lib/colors'
import { type Contact, type Group } from '@/types/models'

import { InlineEditTrigger } from './InlineEditTrigger'

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

  const MAX_VISIBLE_GROUPS = 3
  const userGroups = (contact.contactGroups || [])
    .map((cg) => {
      const groupIri =
        typeof cg.groupResource === 'string'
          ? cg.groupResource
          : (cg.groupResource as { '@id'?: string })?.['@id']

      if (!groupIri) {
        return null
      }

      return groups.find((g) => g['@id'] === groupIri)
    })
    .filter((g): g is Group => !!g)

  const visibleGroups = userGroups.slice(0, MAX_VISIBLE_GROUPS)
  const hiddenCount = userGroups.length - MAX_VISIBLE_GROUPS

  const content = (
    <div className="flex flex-wrap gap-1">
      {visibleGroups.map((group, i) => (
        <span
          key={i}
          className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${
            group.color ? 'border-transparent' : 'bg-blue-50 text-blue-700 ring-blue-700/10'
          }`}
          style={
            group.color
              ? {
                  backgroundColor: group.color,
                  borderColor: group.color,
                  color: getContrastingTextColor(group.color),
                }
              : undefined
          }
        >
          {group.name}
        </span>
      ))}
      {hiddenCount > 0 && (
        <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-600/10">
          +{hiddenCount}
        </span>
      )}
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
