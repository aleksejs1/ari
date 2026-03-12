<?php

namespace Ari\Tests\Functional;

use Ari\Entity\Contact;
use Ari\Entity\User;
use Ari\Entity\UserPlan;
use Doctrine\ORM\EntityManagerInterface;

class EntitlementsApiTest extends AbstractApiTestCase
{
    // ── Authentication ─────────────────────────────────────────────────────

    public function testEntitlementsRequiresAuthentication(): void
    {
        $client = static::createClient();
        $client->request('GET', '/api/entitlements');
        self::assertResponseStatusCodeSame(401);
    }

    // ── Default (self_hosted, no UserPlan row) ─────────────────────────────

    public function testEntitlementsReturnsSnapshotForDefaultUser(): void
    {
        $client = static::createClient();
        $response = $client->request('GET', '/api/entitlements', [
            'auth_bearer' => $this->token,
        ]);

        self::assertResponseIsSuccessful();
        $data = $response->toArray();

        self::assertArrayHasKey('planId', $data);
        self::assertArrayHasKey('isAdminOverride', $data);
        self::assertArrayHasKey('quotas', $data);
        self::assertArrayHasKey('features', $data);
        self::assertArrayHasKey('contacts', $data['quotas']);
        self::assertTrue($data['quotas']['contacts']['isUnlimited']);
    }

    // ── Admin override ─────────────────────────────────────────────────────

    public function testAdminGetsTrueIsAdminOverride(): void
    {
        $client = static::createClient();

        // Promote test user to admin
        $em = $this->getEntityManager();
        $user = $em->getRepository(User::class)->findOneBy(['uuid' => $this->userUuid]);
        self::assertNotNull($user);
        $user->setRoles(['ROLE_ADMIN']);
        $em->flush();
        $em->clear();

        // Re-login to get fresh token with updated roles
        $adminToken = $this->getToken($this->userUuid, 'password');

        $response = $client->request('GET', '/api/entitlements', [
            'auth_bearer' => $adminToken,
        ]);

        self::assertResponseIsSuccessful();
        $data = $response->toArray();

        self::assertTrue($data['isAdminOverride']);
        self::assertTrue($data['quotas']['contacts']['isUnlimited']);
        self::assertSame('allowed', $data['features']['contact_graph'] ?? null);
    }

    // ── free plan ─────────────────────────────────────────────────────────

    public function testFreePlanUserSeesPlanLimitsAndPromoFeatures(): void
    {
        $client = static::createClient();
        $em = $this->getEntityManager();

        $user = $em->getRepository(User::class)->findOneBy(['uuid' => $this->userUuid]);
        self::assertNotNull($user);

        $this->setUserPlan($em, $user, 'free');

        $response = $client->request('GET', '/api/entitlements', [
            'auth_bearer' => $this->token,
        ]);

        self::assertResponseIsSuccessful();
        $data = $response->toArray();

        self::assertSame('free', $data['planId']);
        self::assertFalse($data['isAdminOverride']);
        self::assertFalse($data['quotas']['contacts']['isUnlimited']);
        self::assertSame(3, $data['quotas']['contacts']['limit']); // test plans.yaml: limit = 3
        self::assertSame('promo', $data['features']['contact_graph']);
        self::assertSame('denied', $data['features']['ai_suggestions']);
        self::assertSame('promo', $data['features']['community_plugins']);
    }

    // ── Quota tracks contact count ─────────────────────────────────────────

    public function testQuotaUsedCountMatchesActualContacts(): void
    {
        $client = static::createClient();
        $em = $this->getEntityManager();

        $user = $em->getRepository(User::class)->findOneBy(['uuid' => $this->userUuid]);
        self::assertNotNull($user);

        $this->setUserPlan($em, $user, 'free');

        // Re-fetch user after setUserPlan flush to avoid working with a stale reference
        $user = $em->getRepository(User::class)->findOneBy(['uuid' => $this->userUuid]);
        self::assertNotNull($user);

        // Create 2 contacts directly
        for ($i = 0; $i < 2; ++$i) {
            $contact = new Contact();
            $contact->setTenant($user);
            $contact->setUser($user);
            $em->persist($contact);
        }
        $em->flush();

        $response = $client->request('GET', '/api/entitlements', [
            'auth_bearer' => $this->token,
        ]);

        self::assertResponseIsSuccessful();
        $data = $response->toArray();

        self::assertSame(2, $data['quotas']['contacts']['used']);
        self::assertSame(1, $data['quotas']['contacts']['remaining']); // 3 - 2 = 1
    }

    // ── Tenant isolation ──────────────────────────────────────────────────

    public function testEntitlementsAreTenantIsolated(): void
    {
        $client = static::createClient();

        $userB = $this->createUser('entitlements-b-' . bin2hex(random_bytes(4)), 'pass');
        $em = $this->getEntityManager();
        $this->setUserPlan($em, $userB, 'free');
        $tokenB = $this->getToken((string) $userB->getUuid(), 'pass');

        // User A: self_hosted (default)
        $responseA = $client->request('GET', '/api/entitlements', [
            'auth_bearer' => $this->token,
        ]);
        $dataA = $responseA->toArray();
        self::assertTrue($dataA['quotas']['contacts']['isUnlimited']);

        // User B: free
        $responseB = $client->request('GET', '/api/entitlements', [
            'auth_bearer' => $tokenB,
        ]);
        $dataB = $responseB->toArray();
        self::assertSame('free', $dataB['planId']);
        self::assertFalse($dataB['quotas']['contacts']['isUnlimited']);
    }

    // ── Helpers ───────────────────────────────────────────────────────────

    private function setUserPlan(EntityManagerInterface $em, User $user, string $planId): void
    {
        $existing = $em->getRepository(UserPlan::class)->findOneBy(['user' => $user]);
        if ($existing !== null) {
            $existing->setPlanId($planId);
        } else {
            $plan = new UserPlan($user, $planId);
            $em->persist($plan);
        }
        $em->flush();
        // Note: we intentionally do NOT call $em->clear() here because it detaches all
        // managed entities (including $user), which would break callers that reuse the object.
    }
}
