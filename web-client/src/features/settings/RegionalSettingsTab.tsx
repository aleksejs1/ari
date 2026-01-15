import { RegionalSettings } from './RegionalSettings.component'

import { SettingTab } from '@/lib/settings/SettingTab'

export class RegionalSettingsTab extends SettingTab {
  constructor() {
    super('regional', 'settings.tabs.regional')
  }

  get Component() {
    return RegionalSettings
  }
}
