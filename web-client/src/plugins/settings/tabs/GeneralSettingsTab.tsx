import { GeneralSettings } from './GeneralSettings.component'

import { SettingTab } from '@/lib/settings/SettingTab'

export class GeneralSettingsTab extends SettingTab {
  constructor() {
    super('general', 'settings.tabs.general')
  }

  get Component() {
    return GeneralSettings
  }
}
