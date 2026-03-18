import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'

import type { PlaybookTemplate } from '../hooks/useContactPlaybook'
import { useActivatePlaybook, usePlaybookTemplates } from '../hooks/useContactPlaybook'

const GOALS = ['maintain', 'deepen', 'reignite', 'rekindle', 'appreciate'] as const
const WHY_TAGS = [
  'inspires_me',
  'we_have_history',
  'want_to_be_closer',
  'dont_want_to_lose_touch',
  'want_to_give_back',
] as const

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  contactId: string | number
}

function goalEmoji(goal: string): string {
  const map: Record<string, string> = {
    maintain: '🤝',
    deepen: '💪',
    reignite: '🔥',
    rekindle: '🌱',
    appreciate: '🌟',
  }
  return map[goal] ?? '💬'
}

function parseApiError(err: unknown, fallback: string): string {
  const data = (
    err as { response?: { data?: { detail?: string; violations?: Array<{ message?: string }> } } }
  )?.response?.data
  return String(data?.detail ?? data?.violations?.[0]?.message ?? fallback)
}

interface Step1Props {
  onSelect: (goal: string) => void
}
function Step1Goals({ onSelect }: Step1Props) {
  const { t } = useTranslation('contacts')
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {GOALS.map((goal) => (
        <button
          key={goal}
          data-testid={`goal-card-${goal}`}
          onClick={() => onSelect(goal)}
          className="flex flex-col items-center gap-2 rounded-lg border p-4 text-center transition-colors hover:bg-muted"
        >
          <span className="text-2xl">{goalEmoji(goal)}</span>
          <span className="text-sm font-medium">{t(`playbook.goal.${goal}`)}</span>
        </button>
      ))}
    </div>
  )
}

interface Step2Props {
  templates: PlaybookTemplate[]
  loading: boolean
  onSelect: (preset: string) => void
  onBack: () => void
}
function Step2Presets({ templates, loading, onSelect, onBack }: Step2Props) {
  const { t } = useTranslation('contacts')
  return (
    <div className="space-y-3">
      {loading ? (
        <div className="py-4 text-center text-muted-foreground">{t('loading')}</div>
      ) : (
        templates.map((tmpl) => (
          <button
            key={tmpl.preset}
            data-testid={`preset-card-${tmpl.preset}`}
            onClick={() => onSelect(tmpl.preset)}
            className="flex w-full flex-col items-start gap-1 rounded-lg border p-4 text-left transition-colors hover:bg-muted"
          >
            <span className="font-medium">{tmpl.title}</span>
            <span className="text-xs text-muted-foreground">
              {t('playbook.wizard.taskTypes', {
                types: tmpl.taskTypes.map((type) => t(`playbook.tasks.type.${type}`)).join(', '),
              })}
            </span>
          </button>
        ))
      )}
      <Button variant="ghost" size="sm" onClick={onBack}>
        ← {t('playbook.wizard.back')}
      </Button>
    </div>
  )
}

interface Step3Props {
  selectedTags: string[]
  whyText: string
  error: string | null
  submitting: boolean
  onTagToggle: (tag: string) => void
  onTextChange: (text: string) => void
  onSubmit: () => void
  onBack: () => void
}
function Step3Why({
  selectedTags,
  whyText,
  error,
  submitting,
  onTagToggle,
  onTextChange,
  onSubmit,
  onBack,
}: Step3Props) {
  const { t } = useTranslation('contacts')
  const canSubmit = selectedTags.length > 0 || whyText.trim().length > 0
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {WHY_TAGS.map((tag) => (
          <button
            key={tag}
            data-testid={`why-tag-${tag}`}
            onClick={() => onTagToggle(tag)}
            className={`rounded-full border px-3 py-1 text-sm transition-colors ${
              selectedTags.includes(tag)
                ? 'border-primary bg-primary text-primary-foreground'
                : 'border-border hover:bg-muted'
            }`}
          >
            {t(`playbook.why.tags.${tag}`)}
          </button>
        ))}
      </div>
      <Textarea
        data-testid="why-text-input"
        placeholder={t('playbook.why.freeTextPlaceholder')}
        value={whyText}
        onChange={(e) => onTextChange(e.target.value)}
        rows={3}
      />
      {error !== null ? <p className="text-sm text-destructive">{error}</p> : null}
      <div className="flex justify-between gap-2">
        <Button variant="ghost" size="sm" onClick={onBack}>
          ← {t('playbook.wizard.back')}
        </Button>
        <Button
          data-testid="wizard-submit-button"
          onClick={onSubmit}
          disabled={!canSubmit || submitting}
        >
          {submitting ? t('playbook.wizard.submitting') : t('playbook.wizard.submit')}
        </Button>
      </div>
    </div>
  )
}

export function PlaybookWizard({ open, onOpenChange, contactId }: Props) {
  const { t } = useTranslation('contacts')
  const [step, setStep] = useState(1)
  const [selectedGoal, setSelectedGoal] = useState<string | null>(null)
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null)
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [whyText, setWhyText] = useState('')
  const [error, setError] = useState<string | null>(null)

  const { data: templates = [], isLoading: templatesLoading } = usePlaybookTemplates()
  const activate = useActivatePlaybook(contactId)

  const filteredTemplates = templates.filter((tmpl) => tmpl.goal === selectedGoal)

  const reset = () => {
    setStep(1)
    setSelectedGoal(null)
    setSelectedPreset(null)
    setSelectedTags([])
    setWhyText('')
    setError(null)
  }

  const handleGoalSelect = (goal: string) => {
    setSelectedGoal(goal)
    setSelectedPreset(null)
    setStep(2)
  }

  const handlePresetSelect = (preset: string) => {
    setSelectedPreset(preset)
    setStep(3)
  }

  const handleBack = () => {
    if (step === 2) {
      setStep(1)
      setSelectedPreset(null)
    } else {
      setStep(2)
    }
  }

  const handleTagToggle = (tag: string) => {
    setSelectedTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]))
  }

  const handleSubmit = async () => {
    if (!selectedPreset) {
      return
    }
    setError(null)
    try {
      await activate.mutateAsync({
        preset: selectedPreset,
        whyTags: selectedTags.length > 0 ? selectedTags : undefined,
        whyText: whyText.trim() || null,
      })
      onOpenChange(false)
      reset()
    } catch (err: unknown) {
      setError(parseApiError(err, t('playbook.error')))
    }
  }

  const stepTitles: Record<number, string> = {
    1: t('playbook.wizard.goalTitle'),
    2: t('playbook.wizard.presetTitle'),
    3: t('playbook.why.title'),
  }
  const stepTitle = stepTitles[step] ?? t('playbook.wizard.goalTitle')

  return (
    <Dialog
      open={open}
      onOpenChange={() => {
        onOpenChange(false)
        reset()
      }}
    >
      <DialogContent className="max-w-lg" data-testid="playbook-wizard">
        <DialogHeader>
          <DialogTitle>{stepTitle}</DialogTitle>
        </DialogHeader>

        {step === 1 && <Step1Goals onSelect={handleGoalSelect} />}
        {step === 2 && (
          <Step2Presets
            templates={filteredTemplates}
            loading={templatesLoading}
            onSelect={handlePresetSelect}
            onBack={handleBack}
          />
        )}
        {step === 3 && (
          <Step3Why
            selectedTags={selectedTags}
            whyText={whyText}
            error={error}
            submitting={activate.isPending}
            onTagToggle={handleTagToggle}
            onTextChange={setWhyText}
            onSubmit={() => void handleSubmit()}
            onBack={handleBack}
          />
        )}
      </DialogContent>
    </Dialog>
  )
}
