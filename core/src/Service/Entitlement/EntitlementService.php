<?php

namespace Ari\Service\Entitlement;

use Ari\Entity\User;
use Ari\Repository\ApiKeyRepository;
use Ari\Repository\ContactRepository;
use Ari\Repository\UserPlanRepository;
use Symfony\Component\DependencyInjection\Attribute\Autowire;

final class EntitlementService implements EntitlementServiceInterface
{
    /** In-request cache: spl_object_id(User) → planId string */
    /** @var array<int, string> */
    private array $planIdCache = [];

    /**
     * @param array<string, mixed> $plans  Injected from %ari_plans% parameter
     */
    public function __construct(
        #[Autowire(param: 'ari_plans')]
        private readonly array $plans,
        private readonly ContactRepository $contactRepository,
        private readonly UserPlanRepository $userPlanRepository,
        private readonly ApiKeyRepository $apiKeyRepository,
    ) {}

    #[\Override]
    public function checkFeature(User $user, string $feature): EntitlementState
    {
        if ($this->isAdmin($user)) {
            return EntitlementState::Allowed;
        }

        $planId = $this->resolvePlanId($user);
        $planConfig = $this->plans[$planId] ?? $this->plans['self_hosted'];
        /** @var array<string, bool> $features */
        $features = $planConfig['features'] ?? [];
        $enabled = (bool) ($features[$feature] ?? true); // unknown features default to allowed

        if ($enabled) {
            return EntitlementState::Allowed;
        }

        $promoFeatures = $planConfig['promo_features'] ?? [];
        if (\in_array($feature, $promoFeatures, true)) {
            return EntitlementState::Promo;
        }

        return EntitlementState::Denied;
    }

    #[\Override]
    public function checkQuota(User $user, string $quota, int $count = 1): EntitlementState
    {
        if ($this->isAdmin($user)) {
            return EntitlementState::Allowed;
        }

        return $this->remainingQuota($user, $quota) >= $count
            ? EntitlementState::Allowed
            : EntitlementState::Denied;
    }

    #[\Override]
    public function remainingQuota(User $user, string $quota): int
    {
        if ($this->isAdmin($user)) {
            return PHP_INT_MAX;
        }

        if ('contacts' === $quota) {
            $limit = $this->resolveContactsLimit($user);
            if ($limit === 0) {
                return PHP_INT_MAX; // unlimited
            }
            $used = $this->contactRepository->countByTenant($user);

            return max(0, $limit - $used);
        }

        if ('api_keys' === $quota) {
            $limit = $this->resolveApiKeysLimit($user);
            if (0 === $limit) {
                return PHP_INT_MAX; // unlimited
            }
            $used = $this->apiKeyRepository->countByTenant($user);

            return max(0, $limit - $used);
        }

        return PHP_INT_MAX; // unknown quotas are treated as unlimited
    }

    #[\Override]
    public function getSnapshot(User $user): EntitlementSnapshot
    {
        $isAdmin = $this->isAdmin($user);
        $planId = $this->resolvePlanId($user);
        $planConfig = $this->plans[$planId] ?? $this->plans['self_hosted'];

        // Build quota info
        $contactsLimit = $this->resolveContactsLimit($user);
        $isUnlimited = $isAdmin || $contactsLimit === 0;
        $used = $this->contactRepository->countByTenant($user);

        $apiKeysLimit = $this->resolveApiKeysLimit($user);
        $apiKeysUsed = $this->apiKeyRepository->countByTenant($user);

        $quotas = [
            'contacts' => new QuotaInfo(
                limit: $isUnlimited ? null : $contactsLimit,
                used: $used,
                remaining: $isUnlimited ? null : max(0, $contactsLimit - $used),
                isUnlimited: $isUnlimited,
            ),
            'api_keys' => new QuotaInfo(
                limit: ($isAdmin || $apiKeysLimit === 0) ? null : $apiKeysLimit,
                used: $apiKeysUsed,
                remaining: ($isAdmin || $apiKeysLimit === 0) ? null : max(0, $apiKeysLimit - $apiKeysUsed),
                isUnlimited: $isAdmin || $apiKeysLimit === 0,
            ),
        ];

        // Build feature map
        $features = [];
        /** @var array<string, bool> $configuredFeatures */
        $configuredFeatures = $planConfig['features'] ?? [];

        foreach ($configuredFeatures as $featureKey => $enabled) {
            if ($isAdmin || (bool) $enabled) {
                $features[$featureKey] = EntitlementState::Allowed->value;
            } else {
                $promoFeatures = $planConfig['promo_features'] ?? [];
                $features[$featureKey] = \in_array($featureKey, $promoFeatures, true)
                    ? EntitlementState::Promo->value
                    : EntitlementState::Denied->value;
            }
        }

        return new EntitlementSnapshot(
            planId: $planId,
            isAdminOverride: $isAdmin,
            quotas: $quotas,
            features: $features,
        );
    }

    #[\Override]
    public function isOverQuota(User $user, string $quota): bool
    {
        if ($this->isAdmin($user)) {
            return false;
        }

        if ('contacts' === $quota) {
            $limit = $this->resolveContactsLimit($user);
            if (0 === $limit) {
                return false; // unlimited plan
            }
            $used = $this->contactRepository->countByTenant($user);

            return $used > $limit;
        }

        return false;
    }

    private function isAdmin(User $user): bool
    {
        return \in_array('ROLE_ADMIN', $user->getRoles(), true);
    }

    private function resolvePlanId(User $user): string
    {
        // Use object identity as cache key so this works both for persisted
        // (has an integer id) and non-persisted (unit test) User instances.
        $cacheKey = spl_object_id($user);

        if (isset($this->planIdCache[$cacheKey])) {
            return $this->planIdCache[$cacheKey];
        }

        $userPlan = $this->userPlanRepository->findOneBy(['user' => $user]);
        $planId = $userPlan?->getPlanId() ?? 'self_hosted';
        $this->planIdCache[$cacheKey] = $planId;

        return $planId;
    }

    private function resolveApiKeysLimit(User $user): int
    {
        $planId = $this->resolvePlanId($user);
        $planConfig = $this->plans[$planId] ?? $this->plans['self_hosted'];
        $configured = (int) ($planConfig['api_keys_limit'] ?? 0);

        $envKey = 'APP_API_KEYS_LIMIT_' . strtoupper($planId);
        $envVal = getenv($envKey);
        if (false !== $envVal && '' !== $envVal) {
            return (int) $envVal;
        }

        return $configured;
    }

    /**
     * Resolves the contacts limit for the user's plan,
     * with env var override: APP_CONTACTS_LIMIT_{PLAN_ID_UPPER}
     */
    private function resolveContactsLimit(User $user): int
    {
        $planId = $this->resolvePlanId($user);
        $planConfig = $this->plans[$planId] ?? $this->plans['self_hosted'];
        $configured = (int) ($planConfig['contacts_limit'] ?? 0);

        $envKey = 'APP_CONTACTS_LIMIT_' . strtoupper($planId);
        $envVal = getenv($envKey);
        if ($envVal !== false && $envVal !== '') {
            return (int) $envVal;
        }

        return $configured;
    }
}
