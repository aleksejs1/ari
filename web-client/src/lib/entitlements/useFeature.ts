import type { FeatureState } from './types'
import { useEntitlements } from './useEntitlements'

export function useFeature(feature: string): FeatureState | undefined {
  const { data } = useEntitlements()
  return data?.features[feature]
}
