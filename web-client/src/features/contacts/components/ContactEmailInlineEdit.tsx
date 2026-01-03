import { Check, Trash2, X } from 'lucide-react'
import { useState } from 'react'
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
import { type ContactEmailAdress } from '@/types/models'

interface ContactEmailInlineEditProps {
  email: ContactEmailAdress
  onUpdate: (email: ContactEmailAdress) => void
  onDelete: () => void
}

export function ContactEmailInlineEdit({ email, onUpdate, onDelete }: ContactEmailInlineEditProps) {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)

  const [value, setValue] = useState(email.value ?? '')
  const [type, setType] = useState(email.type ?? '')
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  const handleOpenChange = (isOpen: boolean) => {
    if (isOpen) {
      setValue(email.value ?? '')
      setType(email.type ?? '')
    }
    setOpen(isOpen)
  }

  const handleSave = () => {
    onUpdate({
      ...email,
      value,
      type,
    })
    setOpen(false)
  }

  const handleDeleteConfirm = () => {
    onDelete()
    setIsDeleteDialogOpen(false)
  }

  const hasEmail = !!email.value

  const formContent = (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <Input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={t('contacts.emailPlaceholder')}
          className="h-8 flex-1"
          aria-label={t('contacts.email')}
        />
        <Input
          value={type}
          onChange={(e) => setType(e.target.value)}
          placeholder={t('contacts.emailTypePlaceholder')}
          className="h-8 w-24"
          aria-label={t('contacts.emailType')}
        />
      </div>
      <div className="flex justify-end gap-2">
        {hasEmail ? (
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
      isExistent={hasEmail}
      label={t('contacts.email')}
      open={open}
      onOpenChange={handleOpenChange}
      popoverContent={formContent}
    >
      <div className="flex flex-col leading-tight">
        <span className="text-sm font-medium">{email.value}</span>
        {!!email.type && <span className="text-[10px] text-muted-foreground">{email.type}</span>}
      </div>
    </InlineEditTrigger>
  )
}
