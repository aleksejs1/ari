import type { BasePlugin } from './Plugin'

export type PluginConstructor = new () => BasePlugin

/**
 * Trusted origins from which remote plugins may be loaded.
 * Populated at build time via VITE_TRUSTED_PLUGIN_ORIGINS (comma-separated list of origins,
 * e.g. "https://plugins.example.com,https://cdn.myorg.io").
 * An empty list blocks all remote plugin loading.
 */
const TRUSTED_ORIGINS: string[] = (
  (import.meta.env['VITE_TRUSTED_PLUGIN_ORIGINS'] as string | undefined) ?? ''
)
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean)

function isAllowedUrl(url: string): boolean {
  try {
    const { origin } = new URL(url)
    return TRUSTED_ORIGINS.includes(origin)
  } catch {
    return false
  }
}

export async function loadRemotePlugin(url: string): Promise<PluginConstructor> {
  if (!isAllowedUrl(url)) {
    throw new Error(
      `Remote plugin URL "${url}" is not in the trusted-origins allowlist. ` +
        `Add its origin to VITE_TRUSTED_PLUGIN_ORIGINS to enable loading.`,
    )
  }

  try {
    const module = await import(/* @vite-ignore */ url)

    if (!module.default) {
      throw new Error(`Remote plugin at ${url} does not have a default export.`)
    }

    return module.default as PluginConstructor
  } catch (error) {
    console.error(`Failed to load remote plugin from ${url}`, error)
    throw error
  }
}
