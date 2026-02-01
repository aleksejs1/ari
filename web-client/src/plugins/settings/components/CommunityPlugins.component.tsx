import { useTranslation } from 'react-i18next'
import { AlertCircle, Download, Shield } from 'lucide-react'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { useUserPrefs } from '@/hooks/useUserPrefs.hook'
import { SettingItem } from '@/lib/settings/components/SettingItem'
import { Setting } from '@/lib/settings/Setting'
import type { SettingConfig } from '@/lib/settings/types'

export function CommunityPlugins() {
  const { t } = useTranslation()
  const { communityPluginsEnabled, setCommunityPluginsEnabled, isLoading } = useUserPrefs()

  const configs: SettingConfig[] = []
  new Setting(configs)
    .setName(t('settings.enableCommunityPlugins'))
    .setDesc(t('settings.enableCommunityPluginsDesc'))
    .addRadio((radio) =>
      radio
        .addOption('1', t('settings.enabled'))
        .addOption('0', t('settings.disabled'))
        .setValue(communityPluginsEnabled)
        .onChange((val) => setCommunityPluginsEnabled(val)),
    )

  if (isLoading) {
    return <div>{t('app.loading')}</div>
  }

  const isEnabled = communityPluginsEnabled === '1'

  return (
    <div className="space-y-6">
      {/* 1. Master Toggle */}
      <SettingItem setting={configs[0]} />

      {/* 2. Warning / Info */}
      {!isEnabled ? (
        <Alert variant="default" className="bg-muted/50">
          <Shield className="h-4 w-4" />
          <AlertTitle>{t('settings.restrictedMode')}</AlertTitle>
          <AlertDescription>{t('settings.restrictedModeDesc')}</AlertDescription>
        </Alert>
      ) : (
        <Alert
          variant="destructive"
          className="border-yellow-600/50 bg-yellow-50 dark:bg-yellow-900/10"
        >
          <AlertCircle className="h-4 w-4 text-yellow-600 dark:text-yellow-500" />
          <AlertTitle className="text-yellow-800 dark:text-yellow-200">
            {t('settings.communityPluginsWarningTitle')}
          </AlertTitle>
          <AlertDescription className="text-yellow-700 dark:text-yellow-300">
            {t('settings.communityPluginsWarningDesc')}
          </AlertDescription>
        </Alert>
      )}

      {/* 3. Installed Plugins List (Placeholder) */}
      {isEnabled ? (
        <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">{t('settings.installedPlugins')}</h3>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Download className="h-4 w-4" />
              <span>0 {t('settings.pluginsInstalled')}</span>
            </div>
          </div>
          <div className="mt-4 flex min-h-[100px] flex-col items-center justify-center rounded-md border border-dashed p-8 text-center animate-in fade-in-50">
            <p className="text-sm text-muted-foreground">{t('settings.noPluginsInstalled')}</p>
            <p className="mt-1 text-xs text-muted-foreground">
              {t('settings.browseMarketplaceHint')}
            </p>
          </div>
        </div>
      ) : null}
    </div>
  )
}
