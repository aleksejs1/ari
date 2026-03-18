import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { BookOpen, Pause, Play, Plus, Trash2 } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { Contact } from '@/types/models'

import type { ContactPlaybook } from '../hooks/useContactPlaybook'
import {
  useContactPlaybook,
  useDeletePlaybook,
  useUpdatePlaybook,
} from '../hooks/useContactPlaybook'
import type { ContactTask } from '../hooks/useContactTasks'
import { useContactTasks } from '../hooks/useContactTasks'

import { PlaybookWizard } from './PlaybookWizard'
import { TaskCard } from './TaskCard'

const ACTIVE_STATUSES = ['pending', 'snoozed', 'awaiting_reflection'] as const

interface ActivePlaybookCardProps {
  playbook: ContactPlaybook
  tasks: ContactTask[]
  contactId: number
  onWizardOpen: () => void
  onPause: () => void
  onDelete: () => void
  pausePending: boolean
  deletePending: boolean
}

function ActivePlaybookCard({
  playbook,
  tasks,
  contactId,
  onWizardOpen,
  onPause,
  onDelete,
  pausePending,
  deletePending,
}: ActivePlaybookCardProps) {
  const { t } = useTranslation('contacts')
  const pendingTasks = tasks
    .filter((task) => (ACTIVE_STATUSES as readonly string[]).includes(task.status))
    .slice(0, 5)

  return (
    <Card data-testid="playbook-section">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="flex items-center gap-2 text-base">
            <BookOpen className="h-4 w-4" />
            {t('playbook.tasks.title')}
            <Badge
              variant="secondary"
              data-testid="playbook-goal-badge"
              className="text-xs font-normal"
            >
              {t(`playbook.goal.${playbook.goal}`)}
            </Badge>
            {playbook.status === 'paused' && (
              <Badge variant="outline" className="text-xs font-normal">
                {t('playbook.paused')}
              </Badge>
            )}
          </CardTitle>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={onWizardOpen}
              title={t('playbook.change')}
            >
              <Plus className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={onPause}
              disabled={pausePending}
              title={playbook.status === 'active' ? t('playbook.pause') : t('playbook.resume')}
            >
              {playbook.status === 'active' ? (
                <Pause className="h-4 w-4" />
              ) : (
                <Play className="h-4 w-4" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-destructive hover:text-destructive"
              onClick={onDelete}
              disabled={deletePending}
              title={t('playbook.remove')}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div data-testid="playbook-task-list" className="space-y-2">
          {pendingTasks.length === 0 ? (
            <p className="py-2 text-sm text-muted-foreground">{t('playbook.tasks.empty')}</p>
          ) : (
            pendingTasks.map((task) => <TaskCard key={task.id} task={task} contactId={contactId} />)
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export function PlaybookSection({ contact }: { contact: Contact }) {
  const { t } = useTranslation('contacts')
  const [wizardOpen, setWizardOpen] = useState(false)

  const contactId = contact.id

  const { data: playbook, isLoading: playbookLoading } = useContactPlaybook(contactId ?? 0)
  const { data: tasks = [] } = useContactTasks(contactId ?? 0, { status: 'pending' })
  const deletePlaybook = useDeletePlaybook(contactId ?? 0)
  const updatePlaybook = useUpdatePlaybook(contactId ?? 0)

  if (!contactId) {
    return null
  }

  if (playbookLoading) {
    return (
      <Card data-testid="playbook-section">
        <CardContent className="py-6 text-center text-sm text-muted-foreground">
          {t('loading')}
        </CardContent>
      </Card>
    )
  }

  if (!playbook) {
    return (
      <Card data-testid="playbook-section">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <BookOpen className="h-4 w-4" />
            {t('playbook.addPlaybook')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4 text-sm text-muted-foreground">{t('playbook.noPlaybookCta')}</p>
          <Button variant="outline" size="sm" onClick={() => setWizardOpen(true)}>
            <Plus className="mr-1.5 h-4 w-4" />
            {t('playbook.addPlaybook')}
          </Button>
        </CardContent>
        <PlaybookWizard open={wizardOpen} onOpenChange={setWizardOpen} contactId={contactId} />
      </Card>
    )
  }

  const handlePause = () => {
    void updatePlaybook.mutateAsync({ status: playbook.status === 'active' ? 'paused' : 'active' })
  }

  const handleDelete = () => {
    if (!window.confirm(t('playbook.removeConfirm'))) {
      return
    }
    void deletePlaybook.mutateAsync()
  }

  return (
    <>
      <ActivePlaybookCard
        playbook={playbook}
        tasks={tasks}
        contactId={contactId}
        onWizardOpen={() => setWizardOpen(true)}
        onPause={handlePause}
        onDelete={handleDelete}
        pausePending={updatePlaybook.isPending}
        deletePending={deletePlaybook.isPending}
      />
      <PlaybookWizard open={wizardOpen} onOpenChange={setWizardOpen} contactId={contactId} />
    </>
  )
}
