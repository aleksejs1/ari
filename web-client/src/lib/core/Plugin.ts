import i18n from '@/lib/i18n'

export abstract class BasePlugin {
  abstract name: string
  abstract register(): void

  protected registerTranslations(resources: Record<string, any>) {
    Object.keys(resources).forEach((lang) => {
      i18n.addResourceBundle(lang, this.name, resources[lang], true, true)
    })
  }
}
