<?php

namespace Ari\Service\Entitlement;

/**
 * Full capability snapshot for a user, returned by GET /api/entitlements.
 */
final class EntitlementSnapshot
{
    /**
     * @param array<string, QuotaInfo>      $quotas
     * @param array<string, string>         $features  key → 'allowed'|'denied'|'promo'
     */
    public function __construct(
        public readonly string $planId,
        public readonly bool $isAdminOverride,
        public readonly array $quotas,
        public readonly array $features,
    ) {}
}
