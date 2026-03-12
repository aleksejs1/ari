<?php

namespace Ari\Service\Entitlement;

use Symfony\Component\Serializer\Attribute\Groups;

/**
 * Usage summary for a single quota dimension (e.g. contacts).
 * Used as a value object in EntitlementSnapshot and serialized in GET /api/entitlements.
 */
final class QuotaInfo
{
    public function __construct(
        #[Groups(['entitlements:read'])]
        public readonly ?int $limit,
        #[Groups(['entitlements:read'])]
        public readonly int $used,
        #[Groups(['entitlements:read'])]
        public readonly ?int $remaining,
        #[Groups(['entitlements:read'])]
        public readonly bool $isUnlimited,
    ) {}
}
