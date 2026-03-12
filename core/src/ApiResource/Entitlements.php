<?php

namespace Ari\ApiResource;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Get;
use Ari\Service\Entitlement\QuotaInfo;
use Ari\State\EntitlementsProvider;
use Symfony\Component\Serializer\Attribute\Groups;

#[ApiResource(
    shortName: 'Entitlements',
    normalizationContext: ['groups' => ['entitlements:read']],
    operations: [
        new Get(
            uriTemplate: '/entitlements',
            provider: EntitlementsProvider::class,
            security: "is_granted('ROLE_USER')",
            name: 'get_entitlements',
        ),
    ],
)]
class Entitlements
{
    /** The plan ID assigned to the user in the database. */
    #[Groups(['entitlements:read'])]
    public string $planId = 'self_hosted';

    /**
     * True when ROLE_ADMIN overrides the plan's restrictions.
     * The UI shows an "Admin Override" badge alongside the planId in Settings → Plan.
     */
    #[Groups(['entitlements:read'])]
    public bool $isAdminOverride = false;

    /**
     * Quota usage per resource type.
     *
     * @var array<string, QuotaInfo>
     */
    #[Groups(['entitlements:read'])]
    public array $quotas = [];

    /**
     * Feature availability per feature key.
     * Values: 'allowed' | 'denied' | 'promo'
     *
     * @var array<string, string>
     */
    #[Groups(['entitlements:read'])]
    public array $features = [];
}
