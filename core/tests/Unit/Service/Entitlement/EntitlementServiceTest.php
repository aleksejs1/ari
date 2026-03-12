<?php

namespace Ari\Tests\Unit\Service\Entitlement;

use Ari\Entity\User;
use Ari\Entity\UserPlan;
use Ari\Repository\ContactRepository;
use Ari\Repository\UserPlanRepository;
use Ari\Service\Entitlement\EntitlementService;
use Ari\Service\Entitlement\EntitlementState;
use PHPUnit\Framework\TestCase;

class EntitlementServiceTest extends TestCase
{
    /** @var array<string, mixed> */
    private array $plans = [
        'self_hosted' => [
            'contacts_limit' => 0,
            'features' => [
                'contact_graph' => true,
                'ai_suggestions' => true,
                'community_plugins' => true,
            ],
        ],
        'free' => [
            'contacts_limit' => 3,
            'features' => [
                'contact_graph' => false,
                'ai_suggestions' => false,
                'community_plugins' => false,
            ],
            'promo_features' => ['contact_graph', 'community_plugins'],
        ],
    ];

    private function makeUser(bool $isAdmin = false): User
    {
        $user = new User();
        $user->setUuid('user-' . bin2hex(random_bytes(4)));
        if ($isAdmin) {
            $user->setRoles(['ROLE_ADMIN']);
        }

        return $user;
    }

    private function makeService(
        int $contactCount = 0,
        ?UserPlan $userPlan = null,
    ): EntitlementService {
        $contactRepo = static::createStub(ContactRepository::class);
        $contactRepo->method('countByTenant')->willReturn($contactCount);

        $planRepo = static::createStub(UserPlanRepository::class);
        $planRepo->method('findOneBy')->willReturn($userPlan);

        return new EntitlementService($this->plans, $contactRepo, $planRepo);
    }

    // ── ROLE_ADMIN short-circuit ───────────────────────────────────────────

    public function testAdminAlwaysGetsAllowedForFeature(): void
    {
        $service = $this->makeService();
        $admin = $this->makeUser(isAdmin: true);

        self::assertSame(EntitlementState::Allowed, $service->checkFeature($admin, 'contact_graph'));
        self::assertSame(EntitlementState::Allowed, $service->checkFeature($admin, 'community_plugins'));
        self::assertSame(EntitlementState::Allowed, $service->checkFeature($admin, 'ai_suggestions'));
    }

    public function testAdminAlwaysGetsAllowedForQuota(): void
    {
        $service = $this->makeService(contactCount: 9999);
        $admin = $this->makeUser(isAdmin: true);

        self::assertSame(EntitlementState::Allowed, $service->checkQuota($admin, 'contacts'));
    }

    public function testAdminRemainingQuotaIsMaxInt(): void
    {
        $service = $this->makeService(contactCount: 9999);
        $admin = $this->makeUser(isAdmin: true);

        self::assertSame(PHP_INT_MAX, $service->remainingQuota($admin, 'contacts'));
    }

    // ── self_hosted plan (unlimited) ──────────────────────────────────────

    public function testSelfHostedPlanHasAllFeaturesAllowed(): void
    {
        $user = $this->makeUser();
        $plan = new UserPlan($user, 'self_hosted');
        $service = $this->makeService(userPlan: $plan);

        self::assertSame(EntitlementState::Allowed, $service->checkFeature($user, 'contact_graph'));
        self::assertSame(EntitlementState::Allowed, $service->checkFeature($user, 'ai_suggestions'));
        self::assertSame(EntitlementState::Allowed, $service->checkFeature($user, 'community_plugins'));
    }

    public function testSelfHostedPlanHasUnlimitedContacts(): void
    {
        $user = $this->makeUser();
        $plan = new UserPlan($user, 'self_hosted');
        $service = $this->makeService(contactCount: 99999, userPlan: $plan);

        self::assertSame(EntitlementState::Allowed, $service->checkQuota($user, 'contacts'));
        self::assertSame(PHP_INT_MAX, $service->remainingQuota($user, 'contacts'));
    }

    // ── free plan (limited) ───────────────────────────────────────────────

    public function testFreePlanBlockedFeaturesReturnPromoOrDenied(): void
    {
        $user = $this->makeUser();
        $plan = new UserPlan($user, 'free');
        $service = $this->makeService(userPlan: $plan);

        // contact_graph and community_plugins are in promo_features
        self::assertSame(EntitlementState::Promo, $service->checkFeature($user, 'contact_graph'));
        self::assertSame(EntitlementState::Promo, $service->checkFeature($user, 'community_plugins'));

        // ai_suggestions is blocked but NOT in promo_features
        self::assertSame(EntitlementState::Denied, $service->checkFeature($user, 'ai_suggestions'));
    }

    public function testFreePlanAllowsContactsBelowLimit(): void
    {
        $user = $this->makeUser();
        $plan = new UserPlan($user, 'free');
        $service = $this->makeService(contactCount: 2, userPlan: $plan);

        self::assertSame(EntitlementState::Allowed, $service->checkQuota($user, 'contacts'));
        self::assertSame(1, $service->remainingQuota($user, 'contacts'));
    }

    public function testFreePlanDeniesContactsAtLimit(): void
    {
        $user = $this->makeUser();
        $plan = new UserPlan($user, 'free');
        $service = $this->makeService(contactCount: 3, userPlan: $plan);

        self::assertSame(EntitlementState::Denied, $service->checkQuota($user, 'contacts'));
        self::assertSame(0, $service->remainingQuota($user, 'contacts'));
    }

    public function testFreePlanDeniesContactsAboveLimit(): void
    {
        $user = $this->makeUser();
        $plan = new UserPlan($user, 'free');
        $service = $this->makeService(contactCount: 5, userPlan: $plan); // over limit

        self::assertSame(EntitlementState::Denied, $service->checkQuota($user, 'contacts'));
        self::assertSame(0, $service->remainingQuota($user, 'contacts'));
    }

    public function testFreePlanBulkQuotaCheck(): void
    {
        $user = $this->makeUser();
        $plan = new UserPlan($user, 'free');
        $service = $this->makeService(contactCount: 2, userPlan: $plan); // 1 remaining

        self::assertSame(EntitlementState::Allowed, $service->checkQuota($user, 'contacts', 1));
        self::assertSame(EntitlementState::Denied, $service->checkQuota($user, 'contacts', 2)); // need 2, only 1 left
    }

    // ── null UserPlan fallback (self_hosted) ──────────────────────────────

    public function testNullUserPlanFallsBackToSelfHosted(): void
    {
        $user = $this->makeUser();
        $service = $this->makeService(userPlan: null); // no row in DB

        self::assertSame(EntitlementState::Allowed, $service->checkFeature($user, 'contact_graph'));
        self::assertSame(PHP_INT_MAX, $service->remainingQuota($user, 'contacts'));
    }

    // ── getSnapshot ───────────────────────────────────────────────────────

    public function testSnapshotForAdminHasIsAdminOverrideTrue(): void
    {
        $admin = $this->makeUser(isAdmin: true);
        $service = $this->makeService(contactCount: 5);
        $snapshot = $service->getSnapshot($admin);

        self::assertTrue($snapshot->isAdminOverride);
        self::assertSame('allowed', $snapshot->features['contact_graph']);
        self::assertTrue($snapshot->quotas['contacts']->isUnlimited);
        self::assertNull($snapshot->quotas['contacts']->limit);
    }

    public function testSnapshotForFreePlanUser(): void
    {
        $user = $this->makeUser();
        $plan = new UserPlan($user, 'free');
        $service = $this->makeService(contactCount: 2, userPlan: $plan);
        $snapshot = $service->getSnapshot($user);

        self::assertFalse($snapshot->isAdminOverride);
        self::assertSame('free', $snapshot->planId);
        self::assertSame('promo', $snapshot->features['contact_graph']);
        self::assertSame('denied', $snapshot->features['ai_suggestions']);
        self::assertFalse($snapshot->quotas['contacts']->isUnlimited);
        self::assertSame(3, $snapshot->quotas['contacts']->limit);
        self::assertSame(2, $snapshot->quotas['contacts']->used);
        self::assertSame(1, $snapshot->quotas['contacts']->remaining);
    }

    // ── unknown feature ───────────────────────────────────────────────────

    public function testUnknownFeatureDefaultsToAllowed(): void
    {
        $user = $this->makeUser();
        $plan = new UserPlan($user, 'free');
        $service = $this->makeService(userPlan: $plan);

        self::assertSame(EntitlementState::Allowed, $service->checkFeature($user, 'non_existent_feature'));
    }
}
