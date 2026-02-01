import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  AlertCircle,
  CheckCircle2,
  Download,
  Loader2,
  RefreshCw,
  Shield,
  Store,
} from 'lucide-react'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useUserPrefs } from '@/hooks/useUserPrefs.hook'
import { SettingItem } from '@/lib/settings/components/SettingItem'
import { Setting } from '@/lib/settings/Setting'
import type { SettingConfig } from '@/lib/settings/types'

import { useMarketplaceRegistry, useUpdatePlugin } from '../hooks/useMarketplace'
import type { RegistryPlugin } from '../types/marketplace'

import { MarketplaceBrowser } from './MarketplaceBrowser'

function InstalledPluginsList({
  plugins,
  loading,
}: {
  plugins: RegistryPlugin[]
  loading: boolean
}) {
  const { t } = useTranslation()
  const updatePlugin = useUpdatePlugin()

  if (loading) {
    return (
      <div className="mt-4 flex items-center justify-center py-8">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (plugins.length === 0) {
    return (
      <div className="mt-4 flex min-h-[100px] flex-col items-center justify-center rounded-md border border-dashed p-8 text-center animate-in fade-in-50">
        <p className="text-sm text-muted-foreground">{t('settings.noPluginsInstalled')}</p>
        <p className="mt-1 text-xs text-muted-foreground">{t('settings.browseMarketplaceHint')}</p>
      </div>
    )
  }

  return (
    <div className="mt-4 space-y-2">
      {plugins.map((plugin) => (
        <div key={plugin.id} className="flex items-center justify-between rounded-md border p-3">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <div>
              <p className="text-sm font-medium">{plugin.name}</p>
              <p className="text-xs text-muted-foreground">
                {plugin.installedVersion !== undefined &&
                  t('marketplace.version', { version: plugin.installedVersion })}
              </p>
            </div>
          </div>
          {plugin.updateAvailable ? (
            <Button
              size="sm"
              variant="outline"
              disabled={updatePlugin.isPending}
              onClick={() => updatePlugin.mutate(plugin.id)}
            >
              {updatePlugin.isPending ? (
                <Loader2 className="mr-1 h-3 w-3 animate-spin" />
              ) : (
                <RefreshCw className="mr-1 h-3 w-3" />
              )}
              {t('marketplace.update')}
              {plugin.latestVersion !== undefined && (
                <Badge variant="secondary" className="ml-1 text-xs">
                  {t('marketplace.version', { version: plugin.latestVersion })}
                </Badge>
              )}
            </Button>
          ) : null}
        </div>
      ))}
    </div>
  )
}

export function CommunityPlugins() {
  const { t } = useTranslation()
  const { communityPluginsEnabled, setCommunityPluginsEnabled, isLoading } = useUserPrefs()
  const [browserOpen, setBrowserOpen] = useState(false)

  const { data: registry, isLoading: registryLoading } = useMarketplaceRegistry()

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
  const installedPlugins = registry?.plugins?.filter((p) => p.installed) ?? []

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

      {/* 3. Installed Plugins List */}
      {isEnabled ? (
        <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">{t('settings.installedPlugins')}</h3>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Download className="h-4 w-4" />
              <span>
                {registryLoading ? '...' : installedPlugins.length} {t('settings.pluginsInstalled')}
              </span>
            </div>
          </div>

          <InstalledPluginsList plugins={installedPlugins} loading={registryLoading} />

          <div className="mt-4">
            <Button variant="outline" className="w-full" onClick={() => setBrowserOpen(true)}>
              <Store className="mr-2 h-4 w-4" />
              {t('marketplace.browse')}
            </Button>
          </div>
        </div>
      ) : null}

      <MarketplaceBrowser open={browserOpen} onOpenChange={setBrowserOpen} />
    </div>
  )
}
