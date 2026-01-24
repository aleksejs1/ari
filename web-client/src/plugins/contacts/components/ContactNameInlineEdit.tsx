import { useState } from 'react'
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
import { type ContactName } from '@/types/models'

import { InlineEditTrigger } from './InlineEditTrigger'

interface ContactNameInlineEditProps {
  name: ContactName
  onUpdate: (name: ContactName) => void
  onDelete: () => void
}

export function ContactNameInlineEdit({ name, onUpdate, onDelete }: ContactNameInlineEditProps) {
  const { t } = useTranslation('contacts')
  const [open, setOpen] = useState(false)
  const [given, setGiven] = useState(name.given ?? '')
  const [family, setFamily] = useState(name.family ?? '')
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  // Reset state when opening
  const handleOpenChange = (isOpen: boolean) => {
    if (isOpen) {
      setGiven(name.given ?? '')
      setFamily(name.family ?? '')
    }
    setOpen(isOpen)
  }

  const handleSave = () => {
    onUpdate({ ...name, given, family })
    setOpen(false)
  }

  const handleDeleteConfirm = () => {
    onDelete()
    setIsDeleteDialogOpen(false)
  }

  const hasName = !!(name.given || name.family)

  const formContent = (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <Input
          value={given}
          onChange={(e) => setGiven(e.target.value)}
          placeholder={t('givenName')}
          className="h-8 flex-1"
          aria-label={t('givenName')}
        />
        <Input
          value={family}
          onChange={(e) => setFamily(e.target.value)}
          placeholder={t('familyName')}
          className="h-8 flex-1"
          aria-label={t('familyName')}
        />
      </div>
      <div className="flex justify-end gap-2">
        {hasName ? (
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
            <DialogTitle>{t('delete')}</DialogTitle>
            <DialogDescription>{t('deleteConfirm')}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              {t('common.cancel')}
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirm}>
              {t('delete')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )

  return (
    <InlineEditTrigger
      isExistent={hasName}
      label={t('name')}
      open={open}
      onOpenChange={handleOpenChange}
      popoverContent={formContent}
    >
      <span className="font-medium">
        {name.given} {name.family}
      </span>
    </InlineEditTrigger>
  )
}
