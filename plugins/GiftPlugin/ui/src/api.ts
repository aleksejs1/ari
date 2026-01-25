import { http } from '@ari/plugin-sdk'

let apiInstance: typeof http | null = null

export const setApi = (apiClient: typeof http) => {
  apiInstance = apiClient
}

export const getApi = (): typeof http => {
  if (!apiInstance) {
    throw new Error('API client not initialized. Ensure plugin is registered.')
  }
  return apiInstance
}
