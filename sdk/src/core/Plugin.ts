export class BasePlugin {
    name: string = ''
    register(context: any): void { }
    registerTranslations(translations: any, i18n: any): void {
        Object.keys(translations).forEach((lang) => {
            i18n.addResourceBundle(lang, this.name, translations[lang], true, true)
        })
    }
}
