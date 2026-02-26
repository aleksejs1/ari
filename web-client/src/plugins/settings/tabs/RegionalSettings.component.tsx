import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { useUserPrefs } from '@/hooks/useUserPrefs.hook'
import { SettingItem } from '@/lib/settings/components/SettingItem'
import { Setting } from '@/lib/settings/Setting'
import type { SettingConfig } from '@/lib/settings/types'

const getFormattedTimezones = (): { value: string; label: string }[] => {
  const timezones: { value: string; label: string }[] = []
  try {
    const date = new Date()
    Intl.supportedValuesOf('timeZone').forEach((tz) => {
      let label = tz
      try {
        const parts = new Intl.DateTimeFormat('en', {
          timeZone: tz,
          timeZoneName: 'shortOffset',
        }).formatToParts(date)
        const offsetPart = parts.find((p) => p.type === 'timeZoneName')?.value || ''
        let offset = offsetPart.replace('GMT', 'UTC')
        if (offset === 'UTC') {
          offset = 'UTC+0:00'
        } else if (!offset.includes(':')) {
          offset += ':00'
        }
        label = `${tz} (${offset})`
      } catch (error) {
        console.warn(`Failed to format timezone: ${tz}`, error)
      }
      timezones.push({ value: tz, label })
    })
  } catch (error) {
    console.warn('Intl.supportedValuesOf(timeZone) is not supported', error)
    timezones.push({ value: 'UTC', label: 'UTC (UTC+0:00)' })
  }
  return timezones
}

export function RegionalSettings() {
  const { t } = useTranslation()
  const { dateFormat, timeFormat, timezone, setDateFormat, setTimeFormat, setTimezone, isLoading } =
    useUserPrefs()

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

    // Time Zone
    new Setting(settingsContainer)
      .setName(t('settings.timezone'))
      .setDesc(t('settings.timezoneDescription'))
      .addDropdown((dropdown) => {
        dropdown.setValue(timezone).onChange((val) => setTimezone(val))
        getFormattedTimezones().forEach((tz) => dropdown.addOption(tz.value, tz.label))
      })

    return settingsContainer
  }, [t, dateFormat, timeFormat, timezone, setDateFormat, setTimeFormat, setTimezone])

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
