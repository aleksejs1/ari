import { SettingTab } from '@/lib/settings/SettingTab'

import { GeneralSettings } from './GeneralSettings.component'

export class GeneralSettingsTab extends SettingTab {
  constructor() {
    super('general', 'settings.tabs.general')
  }

  get Component() {
    return GeneralSettings
  }
}
