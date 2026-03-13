<?php

namespace Ari\Tests\Functional;

use Ari\Entity\Contact;
use Ari\Entity\User;
use Ari\Entity\UserPlan;

/**
 * Tests that ContactVoter::CONTACT_ADD enforces quota via EntitlementService.
 * Uses the test plan override (contacts_limit: 3).
 *
 * @psalm-suppress InternalMethod
 */
class ContactQuotaApiTest extends AbstractApiTestCase
{
    public function testPostContactSucceedsWhenQuotaAvailable(): void
    {
        // Default user has self_hosted plan → unlimited quota
        $client = static::createClient();
        $client->request('POST', '/api/contacts', [
            'auth_bearer' => $this->token,
            'json' => [],
        ]);

        self::assertResponseStatusCodeSame(201);
    }

    public function testPostContactReturnsForbiddenWhenQuotaExceeded(): void
    {
        $em = $this->getEntityManager();
        $user = $em->getRepository(User::class)->findOneBy(['uuid' => $this->userUuid]);
        self::assertNotNull($user);

        // Assign free plan (contacts_limit: 3 in test env)
        $this->setUserPlan($user, 'free');

        // Fill the quota (create 3 contacts)
        for ($i = 0; $i < 3; ++$i) {
            $contact = new Contact();
            $contact->setUser($user);
            $em->persist($contact);
        }
        $em->flush();

        // Now quota is exhausted — POST should be denied
        $client = static::createClient();
        $client->request('POST', '/api/contacts', [
            'auth_bearer' => $this->token,
            'json' => [],
        ]);

        self::assertResponseStatusCodeSame(403);
    }

    public function testAdminCanAlwaysAddContactsRegardlessOfPlan(): void
    {
        $em = $this->getEntityManager();
        $user = $em->getRepository(User::class)->findOneBy(['uuid' => $this->userUuid]);
        self::assertNotNull($user);

        // Assign free plan and fill quota
        $this->setUserPlan($user, 'free');
        for ($i = 0; $i < 3; ++$i) {
            $contact = new Contact();
            $contact->setUser($user);
            $em->persist($contact);
        }

        // Promote to admin
        $user->setRoles(['ROLE_USER', 'ROLE_ADMIN']);
        $em->flush();

        // Re-login to get a fresh token with updated roles
        $token = $this->getToken($this->userUuid, 'password');

        $client = static::createClient();
        $client->request('POST', '/api/contacts', [
            'auth_bearer' => $token,
            'json' => [],
        ]);

        self::assertResponseStatusCodeSame(201);
    }

    private function setUserPlan(User $user, string $planId): void
    {
        $em = $this->getEntityManager();
        $existing = $em->getRepository(UserPlan::class)->findOneBy(['user' => $user]);
        if (null !== $existing) {
            $existing->setPlanId($planId);
        } else {
            $plan = new UserPlan($user, $planId);
            $em->persist($plan);
        }
        $em->flush();
    }
}
