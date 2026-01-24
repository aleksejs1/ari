export class BasePlugin {
    name: string = ''
    register(context: any): void { }
    registerTranslations(translations: any, i18n: any): void { }
}
