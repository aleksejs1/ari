import type { QuotaInfo } from './types'
import { useEntitlements } from './useEntitlements'

export function useQuota(resource: string): QuotaInfo | undefined {
  const { data } = useEntitlements()
  return data?.quotas[resource]
}
