import { Check, X, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { InlineEditTrigger } from './InlineEditTrigger'

import { Button } from '@/components/ui/button'
import { DateInput } from '@/components/ui/DateInput'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { formatApiDate } from '@/lib/utils'
import { type ContactDate } from '@/types/models'

interface ContactDateInlineEditProps {
  date: ContactDate
  onUpdate: (date: ContactDate) => void
  onDelete: () => void
}

export function ContactDateInlineEdit({ date, onUpdate, onDelete }: ContactDateInlineEditProps) {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)

  const initialDate = date.date ? new Date(date.date).toISOString().split('T')[0] : ''
  const [dateValue, setDateValue] = useState(initialDate)
  const [text, setText] = useState(date.text ?? '')
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  const handleOpenChange = (isOpen: boolean) => {
    if (isOpen) {
      const d = date.date ? new Date(date.date).toISOString().split('T')[0] : ''
      setDateValue(d)
      setText(date.text ?? '')
    }
    setOpen(isOpen)
  }

  const handleSave = () => {
    onUpdate({
      ...date,
      date: dateValue ? formatApiDate(dateValue) : undefined,
      text,
    })
    setOpen(false)
  }

  const handleDeleteConfirm = () => {
    onDelete()
    setIsDeleteDialogOpen(false)
  }

  const hasDate = !!date.date

  const formContent = (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <DateInput
          value={dateValue}
          onChange={(d) => setDateValue(d || '')}
          className="h-8 flex-1"
          aria-label={t('contacts.date')}
        />
        <Input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={t('contacts.dateLabel')}
          className="h-8 flex-1"
          aria-label={t('contacts.dateLabel')}
        />
      </div>
      <div className="flex justify-end gap-2">
        {hasDate ? (
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
      isExistent={hasDate}
      label={t('contacts.date')}
      open={open}
      onOpenChange={handleOpenChange}
      popoverContent={formContent}
    >
      <>
        <span className="font-medium">
          {date.date ? new Date(date.date).toLocaleDateString() : ''}
        </span>
        <span className="text-gray-500">({date.text ?? t('contacts.noLabel')})</span>
      </>
    </InlineEditTrigger>
  )
}
