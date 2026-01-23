import { SettingTab } from '@/lib/settings/SettingTab'

import { DataSettings } from './DataSettings.component'

export class DataSettingsTab extends SettingTab {
  constructor() {
    super('data', 'settings.tabs.data')
  }

  get Component() {
    return DataSettings
  }
}
