import { Pencil, Check, X, Trash2 } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

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

interface ContactNameInlineEditProps {
  name: ContactName
  onUpdate: (name: ContactName) => void
  onDelete: () => void
}

export function ContactNameInlineEdit({ name, onUpdate, onDelete }: ContactNameInlineEditProps) {
  const { t } = useTranslation()
  const [isEditing, setIsEditing] = useState(false)
  const [given, setGiven] = useState(name.given ?? '')
  const [family, setFamily] = useState(name.family ?? '')
  const [isHovered, setIsHovered] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isEditing])

  const handleSave = () => {
    onUpdate({ ...name, given, family })
    setIsEditing(false)
  }

  const handleCancel = () => {
    setGiven(name.given ?? '')
    setFamily(name.family || '')
    setIsEditing(false)
  }

  const handleDeleteConfirm = () => {
    onDelete()
    setIsDeleteDialogOpen(false)
  }

  if (isEditing) {
    return (
      <div className="flex items-center gap-2">
        <Input
          ref={inputRef}
          value={given}
          onChange={(e) => setGiven(e.target.value)}
          placeholder={t('contacts.givenName')}
          className="h-8 w-32"
        />
        <Input
          value={family}
          onChange={(e) => setFamily(e.target.value)}
          placeholder={t('contacts.familyName')}
          className="h-8 w-32"
        />
        <Button
          size="icon"
          variant="ghost"
          onClick={handleSave}
          className="h-8 w-8 text-green-600"
          aria-label="Save"
        >
          <Check className="h-4 w-4" />
        </Button>
        <Button
          size="icon"
          variant="ghost"
          onClick={() => setIsDeleteDialogOpen(true)}
          className="h-8 w-8 text-red-600"
          aria-label="Delete"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
        <Button
          size="icon"
          variant="ghost"
          onClick={handleCancel}
          className="h-8 w-8 text-gray-500"
          aria-label="Cancel"
        >
          <X className="h-4 w-4" />
        </Button>

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
  }

  return (
    <div
      className="flex items-center gap-2 h-8"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <span className="font-medium">
        {name.given} {name.family}
      </span>
      {isHovered && (
        <Button
          size="icon"
          variant="ghost"
          onClick={() => setIsEditing(true)}
          className="h-6 w-6 opacity-50 hover:opacity-100"
        >
          <Pencil className="h-3 w-3" />
        </Button>
      )}
    </div>
  )
}
