import { type JSX, type ReactNode } from 'react'

import { useFeature } from './useFeature'

interface FeatureGateProps {
  feature: string
  /** Rendered when the feature is allowed (or loading — optimistic). */
  children: ReactNode
  /** Rendered when the feature state is 'denied'. Defaults to null. */
  denied?: ReactNode
  /** Rendered when the feature state is 'promo'. Defaults to children. */
  promo?: ReactNode
}

/**
 * Conditionally renders children based on the feature entitlement state.
 * While loading (data undefined), renders children optimistically.
 */
export function FeatureGate({ feature, children, denied, promo }: FeatureGateProps): JSX.Element {
  const state = useFeature(feature)

  if (state === 'denied') {
    return <>{denied ?? null}</>
  }

  if (state === 'promo') {
    return <>{promo ?? children}</>
  }

  return <>{children}</>
}
