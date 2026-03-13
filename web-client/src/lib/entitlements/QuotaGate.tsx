import type { ReactNode } from 'react'

import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'

import { useUpgradeModal } from './UpgradeModalContext'
import { useQuota } from './useQuota'

interface QuotaGateProps {
  resource: string
  /** The action element (e.g. a button) to guard. */
  children: ReactNode
  /** Tooltip text shown when quota is exhausted. */
  tooltipText?: string
}

/**
 * Wraps an action element and disables it when the resource quota is exhausted.
 * Clicking the disabled element opens the UpgradeModal.
 * While loading (data undefined), renders children optimistically.
 */
export function QuotaGate({ resource, children, tooltipText }: QuotaGateProps): JSX.Element {
  const quota = useQuota(resource)
  const { openUpgradeModal } = useUpgradeModal()

  const isExhausted =
    quota !== undefined && !quota.isUnlimited && quota.remaining !== null && quota.remaining <= 0

  if (!isExhausted) {
    return <>{children}</>
  }

  const tip = tooltipText ?? `You have reached your ${resource} limit.`

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span
          className="cursor-not-allowed"
          onClick={() => openUpgradeModal(resource)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              openUpgradeModal(resource)
            }
          }}
        >
          <span className="pointer-events-none opacity-50">{children}</span>
        </span>
      </TooltipTrigger>
      <TooltipContent>{tip}</TooltipContent>
    </Tooltip>
  )
}
