import type { i18n } from 'i18next'

import type { PluginContext } from './PluginContext'

export abstract class BasePlugin {
  abstract name: string
  abstract register(context: PluginContext): void

  protected registerTranslations(
    resources: Record<string, Record<string, unknown>>,
    i18nInstance: i18n,
  ) {
    Object.keys(resources).forEach((lang) => {
      i18nInstance.addResourceBundle(lang, this.name, resources[lang], true, true)
    })
  }
}
