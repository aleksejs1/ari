import type { BasePlugin } from './Plugin'

export type PluginConstructor = new () => BasePlugin

export async function loadRemotePlugin(url: string): Promise<PluginConstructor> {
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
