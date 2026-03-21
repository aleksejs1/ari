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

    /**
     * Returns the contacts limit for the user's plan.
     * Returns 0 for unlimited plans (contacts_limit = 0).
     * Returns 0 for ROLE_ADMIN (treated as unlimited).
     */
    public function getContactsLimit(User $user): int;

    /**
     * Returns true if the user's current usage EXCEEDS (strictly greater than) the plan
     * limit for $quota. Unlike checkQuota(), which checks whether a new item can be added,
     * this method is used after an INSERT to detect a concurrency overshoot:
     *
     *   - checkQuota() before INSERT: "can we add one more?" (passes if remaining >= 1)
     *   - isOverQuota() after INSERT:  "did we exceed the cap?"  (true only if used > limit)
     *
     * Returns false for unlimited plans (limit = 0) and for ROLE_ADMIN.
     */
    public function isOverQuota(User $user, string $quota): bool;
}
