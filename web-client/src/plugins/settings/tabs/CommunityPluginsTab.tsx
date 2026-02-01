import { SettingTab } from '@/lib/settings/SettingTab'

import { CommunityPlugins } from '../components/CommunityPlugins.component'

export class CommunityPluginsTab extends SettingTab {
  constructor() {
    super('community-plugins', 'settings.communityPlugins')
  }

  get Component() {
    return CommunityPlugins
  }
}
