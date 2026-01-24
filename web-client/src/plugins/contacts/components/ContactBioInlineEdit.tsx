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
import { Textarea } from '@/components/ui/textarea'
import { type ContactBiography } from '@/types/models'

import { InlineEditTrigger } from './InlineEditTrigger'

interface ContactBioInlineEditProps {
  bio: ContactBiography
  onUpdate: (bio: ContactBiography) => void
  onDelete: () => void
  children?: ReactNode
  hideAddButton?: boolean
  className?: string
}

export function ContactBioInlineEdit({
  bio,
  onUpdate,
  onDelete,
  children,
  hideAddButton,
  className,
}: ContactBioInlineEditProps) {
  const { t } = useTranslation('contacts')
  const [open, setOpen] = useState(false)

  const [value, setValue] = useState(bio.value ?? '')
  const [type, setType] = useState(bio.type ?? 'General')
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  const handleOpenChange = (isOpen: boolean) => {
    if (isOpen) {
      setValue(bio.value ?? '')
      setType(bio.type ?? 'General')
    }
    setOpen(isOpen)
  }

  const handleSave = () => {
    onUpdate({
      ...bio,
      value,
      type,
    })
    setOpen(false)
  }

  const handleDeleteConfirm = () => {
    onDelete()
    setIsDeleteDialogOpen(false)
  }

  const hasBio = !!bio.value

  const formContent = (
    <div className="flex flex-col gap-2">
      <div className="flex flex-col gap-2">
        <Input
          value={type}
          onChange={(e) => setType(e.target.value)}
          placeholder={t('typeLabel')}
          className="h-8"
          aria-label={t('type')}
        />
        <Textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={t('biography')}
          className="min-h-[100px]"
          aria-label={t('biography')}
        />
      </div>
      <div className="flex justify-end gap-2">
        {hasBio ? (
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
      isExistent={hasBio}
      label={t('biography')}
      open={open}
      onOpenChange={handleOpenChange}
      popoverContent={formContent}
      hideAddButton={hideAddButton}
      className={className}
    >
      {children || (
        <>
          <span className="font-medium">{bio.value}</span>
          <span className="text-gray-500">({bio.type})</span>
        </>
      )}
    </InlineEditTrigger>
  )
}
