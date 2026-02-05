export interface RegistryPlugin {
  id: string
  name: string
  description: string
  author: string
  repo: string
  icon?: string
  tags: string[]
  minCoreVersion: string
  installed: boolean
  installedVersion?: string
  latestVersion?: string
  updateAvailable: boolean
  compatible: boolean
}

export interface MarketplaceRegistry {
  enabled: boolean
  plugins: RegistryPlugin[]
}

export interface MarketplaceActionResponse {
  success: boolean
  version?: string
  error?: string
}

export interface PluginReadmeResponse {
  content: string
  latestVersion?: string | null
}
