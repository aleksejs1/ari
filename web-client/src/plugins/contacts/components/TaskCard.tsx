import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Check, Clock, SkipForward } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useRegionalPrefs } from '@/contexts/RegionalPrefsContext'

import type { ContactTask } from '../hooks/useContactTasks'
import { useUpdateTask } from '../hooks/useContactTasks'

import { ReflectionModal } from './ReflectionModal'

interface Props {
  task: ContactTask
  contactId: string | number
}

export function TaskCard({ task, contactId }: Props) {
  const { t } = useTranslation('contacts')
  const [snoozing, setSnoozing] = useState(false)
  const [snoozeDate, setSnoozeDate] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [reflecting, setReflecting] = useState(false)

  const updateTask = useUpdateTask(contactId)
  const { formatDate } = useRegionalPrefs()

  const handleComplete = async () => {
    setError(null)
    try {
      await updateTask.mutateAsync({ taskId: task.id, data: { status: 'completed' } })
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { detail?: string } } }
      setError(axiosErr?.response?.data?.detail ?? t('playbook.tasks.error'))
    }
  }

  const handleSkip = async () => {
    setError(null)
    try {
      await updateTask.mutateAsync({ taskId: task.id, data: { status: 'archived' } })
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { detail?: string } } }
      setError(axiosErr?.response?.data?.detail ?? t('playbook.tasks.error'))
    }
  }

  const handleSnooze = async () => {
    if (!snoozeDate) {
      return
    }
    setError(null)
    try {
      await updateTask.mutateAsync({
        taskId: task.id,
        data: { status: 'snoozed', snoozedUntil: snoozeDate },
      })
      setSnoozing(false)
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { detail?: string } } }
      setError(axiosErr?.response?.data?.detail ?? t('playbook.tasks.error'))
    }
  }

  const isAwaitingReflection = task.status === 'awaiting_reflection'

  return (
    <div
      data-testid={`task-card-${task.id}`}
      className="flex items-center justify-between gap-2 rounded-md border p-3"
    >
      <div className="flex min-w-0 flex-col gap-0.5">
        <span className="text-sm font-medium">{t(`playbook.tasks.type.${task.type}`)}</span>
        {task.dueDate !== null ? (
          <span className="text-xs text-muted-foreground">
            {isAwaitingReflection
              ? t('playbook.tasks.awaitingReflection')
              : t('playbook.tasks.dueDate', { date: formatDate(task.dueDate) })}
          </span>
        ) : null}
        {task.status === 'snoozed' && task.snoozedUntil !== null ? (
          <span className="text-xs text-muted-foreground">
            {t('playbook.tasks.snoozedUntil', { date: formatDate(task.snoozedUntil) })}
          </span>
        ) : null}
        {error !== null ? <span className="text-xs text-destructive">{error}</span> : null}
      </div>

      <div className="flex shrink-0 items-center gap-1">
        {isAwaitingReflection ? (
          <>
            <Button
              size="sm"
              variant="secondary"
              className="h-7 px-2 text-xs"
              data-testid={`task-reflect-${task.id}`}
              onClick={() => setReflecting(true)}
            >
              {t('playbook.tasks.reflect')}
            </Button>
            <ReflectionModal
              open={reflecting}
              onOpenChange={setReflecting}
              task={task}
              contactId={contactId}
            />
          </>
        ) : (
          <>
            {snoozing ? (
              <div className="flex items-center gap-1">
                <Input
                  type="date"
                  value={snoozeDate}
                  onChange={(e) => setSnoozeDate(e.target.value)}
                  className="h-7 w-32 text-xs"
                />
                <Button
                  size="sm"
                  variant="outline"
                  className="h-7 px-2 text-xs"
                  onClick={() => void handleSnooze()}
                  disabled={!snoozeDate || updateTask.isPending}
                >
                  {t('playbook.tasks.snoozeConfirm')}
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-7 px-2 text-xs"
                  onClick={() => {
                    setSnoozing(false)
                    setSnoozeDate('')
                  }}
                >
                  ✕
                </Button>
              </div>
            ) : (
              <>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-7 w-7"
                  data-testid={`task-complete-${task.id}`}
                  onClick={() => void handleComplete()}
                  disabled={updateTask.isPending}
                  title={t('playbook.tasks.complete')}
                >
                  <Check className="h-4 w-4 text-green-600" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-7 w-7"
                  data-testid={`task-snooze-${task.id}`}
                  onClick={() => setSnoozing(true)}
                  disabled={updateTask.isPending}
                  title={t('playbook.tasks.snooze')}
                >
                  <Clock className="h-4 w-4" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-7 w-7"
                  data-testid={`task-skip-${task.id}`}
                  onClick={() => void handleSkip()}
                  disabled={updateTask.isPending}
                  title={t('playbook.tasks.skip')}
                >
                  <SkipForward className="h-4 w-4 text-muted-foreground" />
                </Button>
              </>
            )}
          </>
        )}
      </div>
    </div>
  )
}
