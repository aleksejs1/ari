import { Check, Trash2, X } from 'lucide-react'
import { type ReactNode, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { InlineEditTrigger } from './InlineEditTrigger'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { type ContactOrganization } from '@/types/models'

interface ContactOrganizationInlineEditProps {
  organization: ContactOrganization
  onUpdate: (organization: ContactOrganization) => void
  onDelete: () => void
  children?: ReactNode
  hideAddButton?: boolean
  className?: string
}

export function ContactOrganizationInlineEdit({
  organization,
  onUpdate,
  onDelete,
  children,
  hideAddButton,
  className,
}: ContactOrganizationInlineEditProps) {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)

  const [name, setName] = useState(organization.name ?? '')
  const [title, setTitle] = useState(organization.title ?? '')
  const [department, setDepartment] = useState(organization.department ?? '')
  const [type, setType] = useState(organization.type ?? '')

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  const handleOpenChange = (isOpen: boolean) => {
    if (isOpen) {
      setName(organization.name ?? '')
      setTitle(organization.title ?? '')
      setDepartment(organization.department ?? '')
      setType(organization.type ?? '')
    }
    setOpen(isOpen)
  }

  const handleSave = () => {
    onUpdate({
      ...organization,
      name,
      title,
      department,
      type,
    })
    setOpen(false)
  }

  const handleDeleteConfirm = () => {
    onDelete()
    setIsDeleteDialogOpen(false)
  }

  const hasOrganization = !!organization.name

  const formContent = (
    <div className="flex flex-col gap-4">
      <div className="grid gap-2">
        <Label htmlFor="org-type">{t('contacts.typeLabel')}</Label>
        <Input
          id="org-type"
          value={type}
          onChange={(e) => setType(e.target.value)}
          placeholder={t('contacts.organizationTypePlaceholder')}
          className="h-8"
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="org-name">{t('contacts.organizationName')}</Label>
        <Input
          id="org-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={t('contacts.organizationNamePlaceholder')}
          className="h-8"
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="org-title">{t('contacts.jobTitle')}</Label>
        <Input
          id="org-title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder={t('contacts.jobTitlePlaceholder')}
          className="h-8"
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="org-department">{t('contacts.department')}</Label>
        <Input
          id="org-department"
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
          placeholder={t('contacts.departmentPlaceholder')}
          className="h-8"
        />
      </div>

      <div className="flex justify-end gap-2 pt-2">
        {hasOrganization ? (
          <Button
            size="icon"
            variant="ghost"
            onClick={() => setIsDeleteDialogOpen(true)}
            className="h-8 w-8 text-red-600 hover:bg-red-50 hover:text-red-700"
            aria-label="Delete"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        ) : null}
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

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('contacts.delete')}</DialogTitle>
            <DialogDescription>{t('contacts.deleteConfirm')}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              {t('common.cancel')}
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirm}>
              {t('contacts.delete')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )

  return (
    <InlineEditTrigger
      isExistent={hasOrganization}
      label={t('contacts.organization')}
      open={open}
      onOpenChange={handleOpenChange}
      popoverContent={formContent}
      hideAddButton={hideAddButton}
      className={className}
    >
      {children || (
        <div className="flex flex-col">
          <span className="font-medium">{organization.name}</span>
          <span className="text-sm text-gray-500">
            {[organization.title, organization.department].filter(Boolean).join(' - ')}
          </span>
        </div>
      )}
    </InlineEditTrigger>
  )
}
