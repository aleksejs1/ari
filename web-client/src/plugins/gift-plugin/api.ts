import type { AxiosInstance } from 'axios'

let apiInstance: AxiosInstance | null = null

export const setApi = (api: AxiosInstance) => {
  apiInstance = api
}

export const getApi = (): AxiosInstance => {
  if (!apiInstance) {
    throw new Error('API client not initialized. Ensure plugin is registered.')
  }
  return apiInstance
}
