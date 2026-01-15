import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { useUserPrefs } from '@/hooks/useUserPrefs.hook'
import { SettingItem } from '@/lib/settings/components/SettingItem'
import { Setting } from '@/lib/settings/Setting'
import type { SettingConfig } from '@/lib/settings/types'

export function RegionalSettings() {
  const { t } = useTranslation()
  const { dateFormat, timeFormat, setDateFormat, setTimeFormat, isLoading } = useUserPrefs()

  const settings = useMemo(() => {
    const settingsContainer: SettingConfig[] = []

    // Date Format
    new Setting(settingsContainer)
      .setName(t('settings.dateFormat'))
      .setDesc(t('settings.dateFormatDescription'))
      .addRadio((radio) =>
        radio
          .addOption('mm/dd/yyyy', 'MM/DD/YYYY (12/31/2024)')
          .addOption('dd.mm.yyyy', 'DD.MM.YYYY (31.12.2024)')
          .setValue(dateFormat)
          .onChange((val) => setDateFormat(val)),
      )

    // Time Format
    new Setting(settingsContainer)
      .setName(t('settings.timeFormat'))
      .setDesc(t('settings.timeFormatDescription'))
      .addRadio((radio) =>
        radio
          .addOption('24h', '24h (21:00)')
          .addOption('12h', '12h (09:00 PM)')
          .setValue(timeFormat)
          .onChange((val) => setTimeFormat(val)),
      )

    return settingsContainer
  }, [t, dateFormat, timeFormat, setDateFormat, setTimeFormat])

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
