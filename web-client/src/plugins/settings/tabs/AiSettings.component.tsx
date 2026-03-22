import { useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Loader2, Sparkles, TriangleAlert } from 'lucide-react'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { FeatureGate } from '@/lib/entitlements'
import { SettingItem } from '@/lib/settings/components/SettingItem'
import { Setting } from '@/lib/settings/Setting'
import type { SettingConfig } from '@/lib/settings/types'

import {
  useAiSuggestionStats,
  useTriggerBatchAiAnalysis,
} from '@/plugins/contacts/hooks/useAiSuggestions'

export function AiSettings() {
  const { t } = useTranslation()
  const { data: stats, isLoading } = useAiSuggestionStats()
  const batchMutation = useTriggerBatchAiAnalysis()

  const handleBatch = useCallback(() => {
    batchMutation.mutate()
  }, [batchMutation])

  const settings = useMemo(() => {
    const settingsContainer: SettingConfig[] = []

    new Setting(settingsContainer)
      .setName(t('settings.ai.analyzeContacts'))
      .setDesc(t('settings.ai.analyzeContactsDescription'))
      .addButton((btn) =>
        btn
          .setButtonText(
            batchMutation.isPending ? t('common.loading') : t('settings.ai.analyzeContactsButton'),
          )
          .setDisabled(batchMutation.isPending)
          .onClick(handleBatch),
      )

    return settingsContainer
  }, [t, batchMutation.isPending, handleBatch])

  return (
    <FeatureGate
      feature="ai_suggestions"
      denied={
        <Alert>
          <TriangleAlert className="h-4 w-4" />
          <AlertTitle>{t('entitlements.aiSuggestionsUnavailable')}</AlertTitle>
          <AlertDescription>{t('entitlements.aiSuggestionsUnavailableDesc')}</AlertDescription>
        </Alert>
      }
    >
      <div className="space-y-6">
        <Alert>
          <TriangleAlert className="h-4 w-4" />
          <AlertTitle>{t('settings.ai.gdprTitle')}</AlertTitle>
          <AlertDescription>{t('settings.ai.gdprDescription')}</AlertDescription>
        </Alert>

        {isLoading ? (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" data-testid="loading-spinner" />
            {t('common.loading')}
          </div>
        ) : null}

        {!isLoading && stats ? (
          <div className="rounded-lg border p-4">
            <div className="mb-3 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-amber-500" />
              <h3 className="text-sm font-semibold">{t('settings.ai.statistics')}</h3>
            </div>
            <dl className="grid grid-cols-2 gap-3 text-sm sm:grid-cols-3">
              <div>
                <dt className="text-muted-foreground">{t('settings.ai.statsPending')}</dt>
                <dd className="font-medium">{stats.pending}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">{t('settings.ai.statsAccepted')}</dt>
                <dd className="font-medium">{stats.accepted}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">{t('settings.ai.statsDismissed')}</dt>
                <dd className="font-medium">{stats.dismissed}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">{t('settings.ai.statsError')}</dt>
                <dd className="font-medium">{stats.error}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">{t('settings.ai.statsTokensPrompt')}</dt>
                <dd className="font-medium">{stats.tokensPrompt.toLocaleString()}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">{t('settings.ai.statsTokensCompletion')}</dt>
                <dd className="font-medium">{stats.tokensCompletion.toLocaleString()}</dd>
              </div>
            </dl>
          </div>
        ) : null}

        {batchMutation.isSuccess ? (
          <Alert>
            <AlertDescription>{t('settings.ai.analyzeStarted')}</AlertDescription>
          </Alert>
        ) : null}

        <div className="grid gap-6">
          {settings.map((setting, idx) => (
            <SettingItem key={idx} setting={setting} />
          ))}
        </div>
      </div>
    </FeatureGate>
  )
}
