import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { Badge } from '@/components/ui/badge'
import { useFeaturePrefs } from '@/contexts/FeaturePrefsContext'
import { useRegionalPrefs } from '@/contexts/RegionalPrefsContext'
import { useUIPrefs } from '@/contexts/UIPrefsContext'
import { useEntitlements } from '@/lib/entitlements'
import { SettingItem } from '@/lib/settings/components/SettingItem'
import { Setting } from '@/lib/settings/Setting'
import type { SettingConfig } from '@/lib/settings/types'

import { useNotificationPolicies } from '@/plugins/notifications/hooks/useNotificationPolicies'

export function GeneralSettings() {
  const { t } = useTranslation()
  const { data: entitlements } = useEntitlements()
  const { language, setLanguage } = useRegionalPrefs()
  const {
    favouriteGroupName,
    googleSyncOnUpdate,
    dashboardNotificationPolicy,
    setFavouriteGroupName,
    setGoogleSyncOnUpdate,
    setDashboardNotificationPolicy,
  } = useFeaturePrefs()
  const { showLogo, theme, isLoading, setShowLogo, setTheme } = useUIPrefs()
  const { data: notificationPolicies } = useNotificationPolicies()

  const settings = useMemo(() => {
    const settingsContainer: SettingConfig[] = []

    // Language
    new Setting(settingsContainer)
      .setName(t('settings.language'))
      .setDesc(t('settings.languageDescription'))
      .addRadio((radio) =>
        radio
          .addOption('en', 'English')
          .addOption('ru', 'Русский')
          .setValue(language)
          .onChange((val) => setLanguage(val)),
      )

    // Favourite Group Name
    new Setting(settingsContainer)
      .setName(t('settings.favouriteGroupName'))
      .setDesc(t('settings.favouriteGroupNameDescription'))
      .addText((text) =>
        text
          .setLabel(t('settings.groupName'))
          .setValue(favouriteGroupName)
          .onChange((val) => setFavouriteGroupName(val)),
      )

    // Google Sync
    new Setting(settingsContainer)
      .setName(t('settings.googleSyncOnUpdate'))
      .setDesc(t('settings.googleSyncOnUpdateDescription'))
      .addRadio((radio) =>
        radio
          .addOption('1', t('settings.enabled'))
          .addOption('0', t('settings.disabled'))
          .setValue(googleSyncOnUpdate)
          .onChange((val) => setGoogleSyncOnUpdate(val)),
      )

    // Dashboard Notification Policy
    const notificationPolicyBuilder = new Setting(settingsContainer)
      .setName(t('settings.dashboardNotificationPolicy'))
      .setDesc(t('settings.dashboardNotificationPolicyDescription'))

    notificationPolicyBuilder.addDropdown((dropdown) => {
      dropdown
        .addOption('', t('common.none'))
        .setValue(dashboardNotificationPolicy)
        .onChange((val) => setDashboardNotificationPolicy(val))

      if (notificationPolicies) {
        notificationPolicies.forEach((p) => {
          dropdown.addOption(String(p.id), p.name || '')
        })
      }
    })

    // Show Logo
    new Setting(settingsContainer)
      .setName(t('settings.showLogo'))
      .setDesc(t('settings.showLogoDescription'))
      .addRadio((radio) =>
        radio
          .addOption('1', t('settings.enabled'))
          .addOption('0', t('settings.disabled'))
          .setValue(showLogo)
          .onChange((val) => setShowLogo(val)),
      )

    // Theme Selection
    new Setting(settingsContainer)
      .setName(t('settings.theme'))
      .setDesc(t('settings.themeDescription'))
      .addRadio((radio) =>
        radio
          .addOption('light', t('settings.themeLight'))
          .addOption('dark', t('settings.themeDark'))
          .addOption('system', t('settings.themeSystem'))
          .setValue(theme)
          .onChange((val) => setTheme(val as 'light' | 'dark' | 'system')),
      )

    return settingsContainer
  }, [
    t,
    language,
    favouriteGroupName,
    googleSyncOnUpdate,
    dashboardNotificationPolicy,
    showLogo,
    theme,
    notificationPolicies,
    setLanguage,
    setFavouriteGroupName,
    setGoogleSyncOnUpdate,
    setDashboardNotificationPolicy,
    setShowLogo,
    setTheme,
  ])

  if (isLoading) {
    return <div>{t('app.loading')}</div>
  }

  return (
    <div className="space-y-6">
      {entitlements ? (
        <div className="flex items-center gap-2 rounded-lg border bg-muted/40 px-4 py-3 text-sm">
          <span className="text-muted-foreground">{t('settings.plan.title')}:</span>
          <span className="font-medium capitalize">{entitlements.planId.replace('_', ' ')}</span>
          {entitlements.isAdminOverride ? (
            <Badge variant="secondary" className="text-xs">
              {t('settings.plan.adminOverride')}
            </Badge>
          ) : null}
        </div>
      ) : null}
      <div className="grid gap-6">
        {settings.map((setting, idx) => (
          <SettingItem key={idx} setting={setting} />
        ))}
      </div>
    </div>
  )
}
