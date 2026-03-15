import type { BasePlugin } from './Plugin'

export type PluginConstructor = new () => BasePlugin

/**
 * Trusted origins from which remote plugins may be loaded.
 * Same-origin URLs (matching window.location.origin) are always allowed — they are
 * served by the same server as the application itself and pose no additional risk.
 * Cross-origin plugin URLs additionally require the origin to be listed in the
 * VITE_TRUSTED_PLUGIN_ORIGINS env var (comma-separated, e.g.
 * "https://plugins.example.com,https://cdn.myorg.io").
 */
const EXTRA_TRUSTED_ORIGINS: string[] = (
  (import.meta.env['VITE_TRUSTED_PLUGIN_ORIGINS'] as string | undefined) ?? ''
)
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean)

function isAllowedUrl(url: string): boolean {
  try {
    const { origin, hostname } = new URL(url)
    // Localhost (any port) is always safe — only reachable on the developer's own machine.
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return true
    }
    // Same-origin is always safe — plugin served by the same host as the app.
    if (origin === window.location.origin) {
      return true
    }
    return EXTRA_TRUSTED_ORIGINS.includes(origin)
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
