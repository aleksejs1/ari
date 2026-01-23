import { type ReactNode, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Check, Trash2, X } from 'lucide-react'

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
import { type ContactPhoneNumber } from '@/types/models'

import { InlineEditTrigger } from './InlineEditTrigger'
import { TypeAutocomplete } from './TypeAutocomplete'

interface ContactPhoneInlineEditProps {
  phone: ContactPhoneNumber
  onUpdate: (phone: ContactPhoneNumber) => void
  onDelete: () => void
  children?: ReactNode
  hideAddButton?: boolean
  className?: string
}

export function ContactPhoneInlineEdit({
  phone,
  onUpdate,
  onDelete,
  children,
  hideAddButton,
  className,
}: ContactPhoneInlineEditProps) {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)

  const [value, setValue] = useState(phone.value ?? '')
  const [type, setType] = useState(phone.type ?? '')
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  const handleOpenChange = (isOpen: boolean) => {
    if (isOpen) {
      setValue(phone.value ?? '')
      setType(phone.type ?? '')
    }
    setOpen(isOpen)
  }

  const handleSave = () => {
    onUpdate({
      ...phone,
      value,
      type,
    })
    setOpen(false)
  }

  const handleDeleteConfirm = () => {
    onDelete()
    setIsDeleteDialogOpen(false)
  }

  const hasPhone = !!phone.value

  const formContent = (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <Input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={t('contacts.phonePlaceholder')}
          className="h-8 flex-1"
          aria-label={t('contacts.phone')}
        />
        <TypeAutocomplete
          value={type}
          onChange={(e) => setType(e.target.value)}
          field="phoneTypes"
          placeholder={t('contacts.phoneTypePlaceholder')}
          className="h-8 w-24"
          aria-label={t('contacts.phoneType')}
        />
      </div>
      <div className="flex justify-end gap-2">
        {hasPhone ? (
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
      isExistent={hasPhone}
      label={t('contacts.phone')}
      open={open}
      onOpenChange={handleOpenChange}
      popoverContent={formContent}
      hideAddButton={hideAddButton}
      className={className}
    >
      {children || (
        <div className="flex flex-col leading-tight">
          <span className="text-sm font-medium">{phone.value}</span>
          {!!phone.type && <span className="text-[10px] text-muted-foreground">{phone.type}</span>}
        </div>
      )}
    </InlineEditTrigger>
  )
}
