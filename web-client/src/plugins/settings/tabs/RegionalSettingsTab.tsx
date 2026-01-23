import { SettingTab } from '@/lib/settings/SettingTab'

import { RegionalSettings } from './RegionalSettings.component'

export class RegionalSettingsTab extends SettingTab {
  constructor() {
    super('regional', 'settings.tabs.regional')
  }

  get Component() {
    return RegionalSettings
  }
}
