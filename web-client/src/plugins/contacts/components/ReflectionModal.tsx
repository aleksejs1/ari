import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'

import { useSaveReflection } from '../hooks/useContactPlaybook'
import type { ContactTask } from '../hooks/useContactTasks'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  task: ContactTask
  contactId: string | number
}

export function ReflectionModal({ open, onOpenChange, task, contactId }: Props) {
  const { t } = useTranslation('contacts')
  const [answer, setAnswer] = useState('')
  const [error, setError] = useState<string | null>(null)
  const saveReflection = useSaveReflection(contactId)

  const question = task.reflection?.question || t('playbook.reflection.question.fallback')

  const submit = async (value: string) => {
    if (!task.reflection) {
      return
    }
    setError(null)
    try {
      await saveReflection.mutateAsync({ reflectionId: task.reflection.id, answer: value })
      onOpenChange(false)
      setAnswer('')
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { detail?: string } } }
      setError(axiosErr?.response?.data?.detail ?? t('playbook.error'))
    }
  }

  const handleOpenChange = (v: boolean) => {
    if (!v) {
      setAnswer('')
    }
    onOpenChange(v)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent data-testid="reflection-modal">
        <DialogHeader>
          <DialogTitle>{t('playbook.reflection.title')}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">{question}</p>
          <Textarea
            data-testid="reflection-answer-input"
            placeholder={t('playbook.reflection.answerPlaceholder')}
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            rows={4}
          />
          {error !== null ? <p className="text-sm text-destructive">{error}</p> : null}
          <div className="flex justify-between gap-2">
            <Button variant="ghost" size="sm" onClick={() => onOpenChange(false)}>
              {t('playbook.reflection.skip')}
            </Button>
            <Button
              data-testid="reflection-submit"
              onClick={() => void submit(answer)}
              disabled={saveReflection.isPending}
            >
              {t('playbook.reflection.submit')}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
