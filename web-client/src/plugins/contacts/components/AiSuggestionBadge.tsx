import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Loader2, Sparkles } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

import { useAiSuggestions, useResolveAiSuggestion } from '../hooks/useAiSuggestions'

interface AiSuggestionBadgeProps {
  nameId: number
}

export function AiSuggestionBadge({ nameId }: AiSuggestionBadgeProps) {
  const { t } = useTranslation('contacts')
  const [open, setOpen] = useState(false)
  const { data: suggestions = [] } = useAiSuggestions('contact_name', nameId)
  const resolveMutation = useResolveAiSuggestion()

  const pending = suggestions.filter((s) => s.status === 'pending')

  if (pending.length === 0) {
    return null
  }

  const suggestion = pending[0]
  const payload = suggestion.payload
  const iri = suggestion['@id']

  const handleAccept = async () => {
    if (!iri) {
      return
    }
    await resolveMutation.mutateAsync({ id: iri, status: 'accepted' })
    setOpen(false)
  }

  const handleDismiss = async () => {
    if (!iri) {
      return
    }
    await resolveMutation.mutateAsync({ id: iri, status: 'dismissed' })
    setOpen(false)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="ml-1 inline-flex shrink-0 items-center rounded text-amber-500 hover:text-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-500"
          title={t('aiSuggestion.title')}
          onClick={(e) => e.stopPropagation()}
        >
          <Sparkles className="h-4 w-4" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-4" align="start" onClick={(e) => e.stopPropagation()}>
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-amber-500" />
            <h4 className="text-sm font-semibold">{t('aiSuggestion.title')}</h4>
          </div>
          <p className="text-sm text-muted-foreground">
            {t('aiSuggestion.description', {
              detected: payload.detectedLocale ?? '?',
              suggested: payload.suggestedLocale ?? '?',
            })}
          </p>
          {(payload.given ?? payload.family) ? (
            <div className="rounded-md bg-muted p-2 text-sm">
              <span className="font-medium">
                {payload.given} {payload.family}
              </span>
              {payload.suggestedLocale ? (
                <span className="ml-1 text-muted-foreground">({payload.suggestedLocale})</span>
              ) : null}
            </div>
          ) : null}
          <div className="flex gap-2">
            <Button
              size="sm"
              onClick={() => void handleAccept()}
              disabled={resolveMutation.isPending}
              className="flex-1"
            >
              {resolveMutation.isPending ? <Loader2 className="mr-1 h-3 w-3 animate-spin" /> : null}
              {t('aiSuggestion.apply')}
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => void handleDismiss()}
              disabled={resolveMutation.isPending}
              className="flex-1"
            >
              {t('aiSuggestion.dismiss')}
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
