import { DataSettings } from './DataSettings.component'

import { SettingTab } from '@/lib/settings/SettingTab'

export class DataSettingsTab extends SettingTab {
  constructor() {
    super('data', 'settings.tabs.data')
  }

  get Component() {
    return DataSettings
  }
}
