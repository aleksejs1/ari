import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { useUserPrefs } from '@/hooks/useUserPrefs.hook'
import { SettingItem } from '@/lib/settings/components/SettingItem'
import { Setting } from '@/lib/settings/Setting'
import type { SettingConfig } from '@/lib/settings/types'

import { useNotificationPolicies } from '@/plugins/notifications/hooks/useNotificationPolicies'

export function GeneralSettings() {
  const { t } = useTranslation()
  const {
    language,
    favouriteGroupName,
    googleSyncOnUpdate,
    setLanguage,
    setFavouriteGroupName,
    setGoogleSyncOnUpdate,

    dashboardNotificationPolicy,
    setDashboardNotificationPolicy,
    showLogo,
    setShowLogo,
    theme,
    setTheme,
    isLoading,
  } = useUserPrefs()
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
      <div className="grid gap-6">
        {settings.map((setting, idx) => (
          <SettingItem key={idx} setting={setting} />
        ))}
      </div>
    </div>
  )
}
