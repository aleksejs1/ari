import { ALL_SCOPES } from './constants'

export function getScopeDisplay(scopes: string[], t: (key: string) => string): string {
  if (scopes.includes('*')) {
    return t('integrations.fullAccess')
  }
  return scopes
    .map((s) => {
      const def = ALL_SCOPES.find((d) => d.value === s)
      return def ? t(def.label) : s
    })
    .join(', ')
}
