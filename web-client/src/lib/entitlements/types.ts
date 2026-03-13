export type FeatureState = 'allowed' | 'denied' | 'promo'

export interface QuotaInfo {
  limit: number | null
  used: number
  remaining: number | null
  isUnlimited: boolean
}

export interface EntitlementSnapshot {
  planId: string
  isAdminOverride: boolean
  quotas: Record<string, QuotaInfo>
  features: Record<string, FeatureState>
}
