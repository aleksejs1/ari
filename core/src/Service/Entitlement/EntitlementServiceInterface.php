<?php

namespace Ari\Service\Entitlement;

use Ari\Entity\User;

interface EntitlementServiceInterface
{
    /**
     * Check whether the user can use a feature.
     * Returns Allowed | Denied | Promo.
     * ROLE_ADMIN always returns Allowed.
     */
    public function checkFeature(User $user, string $feature): EntitlementState;

    /**
     * Check whether the user can create $count more of the given quota resource.
     * Returns Allowed | Denied.
     * ROLE_ADMIN always returns Allowed.
     */
    public function checkQuota(User $user, string $quota, int $count = 1): EntitlementState;

    /**
     * How many more of $quota the user can create.
     * Returns PHP_INT_MAX for unlimited plans and for ROLE_ADMIN.
     */
    public function remainingQuota(User $user, string $quota): int;

    /**
     * Full snapshot of the user's entitlements, ready for API serialization.
     */
    public function getSnapshot(User $user): EntitlementSnapshot;
}
