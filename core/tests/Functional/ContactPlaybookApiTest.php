<?php

declare(strict_types=1);

namespace Ari\Tests\Functional;

use Ari\Entity\Contact;
use Ari\Entity\ContactPlaybook;
use Ari\Entity\User;

/**
 * Functional tests for the ContactPlaybook API endpoints.
 *
 * Covers:
 *   - POST   /api/contacts/{id}/playbook  — activate a playbook
 *   - GET    /api/contacts/{id}/playbook  — retrieve active/paused playbook
 *   - PATCH  /api/contacts/{id}/playbook  — status transitions and why-fields
 *   - DELETE /api/contacts/{id}/playbook  — archive the playbook
 *
 * Each test validates authentication, success paths, error paths, and
 * tenant isolation so that regressions in the state machine or IDOR guards
 * are caught before they reach production.
 */
final class ContactPlaybookApiTest extends AbstractApiTestCase
{
    // ── Helpers ──────────────────────────────────────────────────────────────

    private function getUser(): User
    {
        $user = $this->getEntityManager()->getRepository(User::class)->findOneBy(['uuid' => $this->userUuid]);
        \assert($user instanceof User);

        return $user;
    }

    private function createContact(User $user): Contact
    {
        $contact = new Contact();
        $contact->setTenant($user);
        $contact->setUser($user);

        $em = $this->getEntityManager();
        $em->persist($contact);
        $em->flush();

        return $contact;
    }

    private function contactUrl(Contact $contact): string
    {
        return '/api/contacts/' . (int) $contact->getId() . '/playbook';
    }

    // ── POST — activate ───────────────────────────────────────────────────────

    public function testPostRequiresAuthentication(): void
    {
        $client = static::createClient();
        $user = $this->getUser();
        $contact = $this->createContact($user);

        $client->request('POST', $this->contactUrl($contact), [
            'json' => ['preset' => 'maintain_friend'],
        ]);

        self::assertResponseStatusCodeSame(401);
    }

    public function testPostActivatesPlaybook(): void
    {
        $client = static::createClient();
        $user = $this->getUser();
        $contact = $this->createContact($user);

        $response = $client->request('POST', $this->contactUrl($contact), [
            'auth_bearer' => $this->token,
            'json' => [
                'preset' => 'maintain_friend',
                'whyTags' => ['reconnect'],
                'whyText' => 'Need to stay in touch',
            ],
        ]);

        self::assertResponseStatusCodeSame(201);
        $data = $response->toArray();
        self::assertSame('maintain_friend', $data['preset']);
        self::assertSame('active', $data['status']);
        self::assertSame($contact->getId(), $data['contactId']);
        self::assertArrayHasKey('id', $data);
        self::assertArrayHasKey('createdAt', $data);
    }

    public function testPostWithInvalidPresetReturns422(): void
    {
        $client = static::createClient();
        $user = $this->getUser();
        $contact = $this->createContact($user);

        $client->request('POST', $this->contactUrl($contact), [
            'auth_bearer' => $this->token,
            'json' => ['preset' => 'totally_invalid_preset'],
        ]);

        self::assertResponseStatusCodeSame(422);
    }

    public function testPostWithBlankPresetReturns422(): void
    {
        $client = static::createClient();
        $user = $this->getUser();
        $contact = $this->createContact($user);

        $client->request('POST', $this->contactUrl($contact), [
            'auth_bearer' => $this->token,
            'json' => ['preset' => ''],
        ]);

        self::assertResponseStatusCodeSame(422);
    }

    public function testPostForNonExistentContactReturns404(): void
    {
        $client = static::createClient();

        $client->request('POST', '/api/contacts/999999/playbook', [
            'auth_bearer' => $this->token,
            'json' => ['preset' => 'maintain_friend'],
        ]);

        self::assertResponseStatusCodeSame(404);
    }

    public function testPostTenantIsolationReturns404(): void
    {
        $userA = $this->getUser();
        $contactA = $this->createContact($userA);

        $userB = $this->createUser('pb-post-iso-' . bin2hex(random_bytes(4)) . '@test.com', 'pass');
        $tokenB = $this->getToken((string) $userB->getUuid(), 'pass');

        // getToken() calls createClient() internally; re-create so assertResponse* checks the right client.
        $client = static::createClient();

        // User B cannot activate a playbook on User A's contact.
        $client->request('POST', $this->contactUrl($contactA), [
            'auth_bearer' => $tokenB,
            'json' => ['preset' => 'maintain_friend'],
        ]);

        self::assertResponseStatusCodeSame(404);
    }

    // ── GET ───────────────────────────────────────────────────────────────────

    public function testGetRequiresAuthentication(): void
    {
        $client = static::createClient();
        $user = $this->getUser();
        $contact = $this->createContact($user);

        $client->request('GET', $this->contactUrl($contact));

        self::assertResponseStatusCodeSame(401);
    }

    public function testGetReturns404WhenNoPlaybook(): void
    {
        $client = static::createClient();
        $user = $this->getUser();
        $contact = $this->createContact($user);

        $client->request('GET', $this->contactUrl($contact), [
            'auth_bearer' => $this->token,
        ]);

        self::assertResponseStatusCodeSame(404);
    }

    public function testGetReturnsPlaybookAfterActivation(): void
    {
        $client = static::createClient();
        $user = $this->getUser();
        $contact = $this->createContact($user);

        // Activate
        $client->request('POST', $this->contactUrl($contact), [
            'auth_bearer' => $this->token,
            'json' => ['preset' => 'maintain_friend'],
        ]);
        self::assertResponseIsSuccessful();

        // Fetch
        $response = $client->request('GET', $this->contactUrl($contact), [
            'auth_bearer' => $this->token,
        ]);

        self::assertResponseIsSuccessful();
        $data = $response->toArray();
        self::assertSame('maintain_friend', $data['preset']);
        self::assertSame('active', $data['status']);
    }

    public function testGetTenantIsolationReturns404(): void
    {
        $userA = $this->getUser();
        $contactA = $this->createContact($userA);

        // Activate as User A
        $client = static::createClient();
        $client->request('POST', $this->contactUrl($contactA), [
            'auth_bearer' => $this->token,
            'json' => ['preset' => 'maintain_friend'],
        ]);
        self::assertResponseIsSuccessful();

        // User B cannot see User A's contact's playbook.
        $userB = $this->createUser('pb-get-iso-' . bin2hex(random_bytes(4)) . '@test.com', 'pass');
        $tokenB = $this->getToken((string) $userB->getUuid(), 'pass');

        // getToken() calls createClient() internally; re-create so assertResponse* checks the right client.
        $client = static::createClient();

        $client->request('GET', $this->contactUrl($contactA), [
            'auth_bearer' => $tokenB,
        ]);

        self::assertResponseStatusCodeSame(404);
    }

    // ── PATCH — status transitions ────────────────────────────────────────────

    public function testPatchRequiresAuthentication(): void
    {
        $client = static::createClient();
        $user = $this->getUser();
        $contact = $this->createContact($user);

        // Activate first
        $client->request('POST', $this->contactUrl($contact), [
            'auth_bearer' => $this->token,
            'json' => ['preset' => 'maintain_friend'],
        ]);

        $client->request('PATCH', $this->contactUrl($contact), [
            'json' => ['status' => 'paused'],
            'headers' => ['Content-Type' => 'application/merge-patch+json'],
        ]);

        self::assertResponseStatusCodeSame(401);
    }

    public function testPatchPausesActivePlaybook(): void
    {
        $client = static::createClient();
        $user = $this->getUser();
        $contact = $this->createContact($user);

        $client->request('POST', $this->contactUrl($contact), [
            'auth_bearer' => $this->token,
            'json' => ['preset' => 'maintain_friend'],
        ]);
        self::assertResponseIsSuccessful();

        $response = $client->request('PATCH', $this->contactUrl($contact), [
            'auth_bearer' => $this->token,
            'json' => ['status' => ContactPlaybook::STATUS_PAUSED],
            'headers' => ['Content-Type' => 'application/merge-patch+json'],
        ]);

        self::assertResponseIsSuccessful();
        self::assertSame(ContactPlaybook::STATUS_PAUSED, $response->toArray()['status']);
    }

    public function testPatchResumePausedPlaybook(): void
    {
        $client = static::createClient();
        $user = $this->getUser();
        $contact = $this->createContact($user);

        // Activate → pause → resume.
        $client->request('POST', $this->contactUrl($contact), [
            'auth_bearer' => $this->token,
            'json' => ['preset' => 'maintain_friend'],
        ]);
        $client->request('PATCH', $this->contactUrl($contact), [
            'auth_bearer' => $this->token,
            'json' => ['status' => ContactPlaybook::STATUS_PAUSED],
            'headers' => ['Content-Type' => 'application/merge-patch+json'],
        ]);

        $response = $client->request('PATCH', $this->contactUrl($contact), [
            'auth_bearer' => $this->token,
            'json' => ['status' => ContactPlaybook::STATUS_ACTIVE],
            'headers' => ['Content-Type' => 'application/merge-patch+json'],
        ]);

        self::assertResponseIsSuccessful();
        self::assertSame(ContactPlaybook::STATUS_ACTIVE, $response->toArray()['status']);
    }

    public function testPatchInvalidTransitionActiveToArchivedReturns422(): void
    {
        $client = static::createClient();
        $user = $this->getUser();
        $contact = $this->createContact($user);

        $client->request('POST', $this->contactUrl($contact), [
            'auth_bearer' => $this->token,
            'json' => ['preset' => 'maintain_friend'],
        ]);
        self::assertResponseIsSuccessful();

        // active → archived is not in ALLOWED_TRANSITIONS; must return 422.
        $client->request('PATCH', $this->contactUrl($contact), [
            'auth_bearer' => $this->token,
            'json' => ['status' => ContactPlaybook::STATUS_ARCHIVED],
            'headers' => ['Content-Type' => 'application/merge-patch+json'],
        ]);

        self::assertResponseStatusCodeSame(422);
    }

    public function testPatchCelebrationPendingCannotBeSetToTrueByClient(): void
    {
        $client = static::createClient();
        $user = $this->getUser();
        $contact = $this->createContact($user);

        $client->request('POST', $this->contactUrl($contact), [
            'auth_bearer' => $this->token,
            'json' => ['preset' => 'maintain_friend'],
        ]);
        self::assertResponseIsSuccessful();

        // Clients must not be able to set celebrationPending=true directly.
        $client->request('PATCH', $this->contactUrl($contact), [
            'auth_bearer' => $this->token,
            'json' => ['celebrationPending' => true],
            'headers' => ['Content-Type' => 'application/merge-patch+json'],
        ]);

        self::assertResponseStatusCodeSame(422);
    }

    public function testPatchWhyFieldsUpdate(): void
    {
        $client = static::createClient();
        $user = $this->getUser();
        $contact = $this->createContact($user);

        $client->request('POST', $this->contactUrl($contact), [
            'auth_bearer' => $this->token,
            'json' => ['preset' => 'maintain_friend'],
        ]);
        self::assertResponseIsSuccessful();

        $response = $client->request('PATCH', $this->contactUrl($contact), [
            'auth_bearer' => $this->token,
            'json' => [
                'whyTags' => ['reconnect', 'check_in'],
                'whyText' => 'Updated reason',
            ],
            'headers' => ['Content-Type' => 'application/merge-patch+json'],
        ]);

        self::assertResponseIsSuccessful();
        $data = $response->toArray();
        self::assertSame(['reconnect', 'check_in'], $data['whyTags']);
        self::assertSame('Updated reason', $data['whyText']);
    }

    public function testPatchTenantIsolationReturns404(): void
    {
        $userA = $this->getUser();
        $contactA = $this->createContact($userA);

        $client = static::createClient();
        $client->request('POST', $this->contactUrl($contactA), [
            'auth_bearer' => $this->token,
            'json' => ['preset' => 'maintain_friend'],
        ]);
        self::assertResponseIsSuccessful();

        $userB = $this->createUser('pb-patch-iso-' . bin2hex(random_bytes(4)) . '@test.com', 'pass');
        $tokenB = $this->getToken((string) $userB->getUuid(), 'pass');

        // getToken() calls createClient() internally; re-create so assertResponse* checks the right client.
        $client = static::createClient();

        // User B cannot PATCH User A's contact's playbook — contact lookup returns 404.
        $client->request('PATCH', $this->contactUrl($contactA), [
            'auth_bearer' => $tokenB,
            'json' => ['status' => 'paused'],
            'headers' => ['Content-Type' => 'application/merge-patch+json'],
        ]);

        self::assertResponseStatusCodeSame(404);
    }

    // ── DELETE — archive ──────────────────────────────────────────────────────

    public function testDeleteRequiresAuthentication(): void
    {
        $client = static::createClient();
        $user = $this->getUser();
        $contact = $this->createContact($user);

        $client->request('POST', $this->contactUrl($contact), [
            'auth_bearer' => $this->token,
            'json' => ['preset' => 'maintain_friend'],
        ]);

        $client->request('DELETE', $this->contactUrl($contact));

        self::assertResponseStatusCodeSame(401);
    }

    public function testDeleteArchivesPlaybook(): void
    {
        $client = static::createClient();
        $user = $this->getUser();
        $contact = $this->createContact($user);

        $client->request('POST', $this->contactUrl($contact), [
            'auth_bearer' => $this->token,
            'json' => ['preset' => 'maintain_friend'],
        ]);
        self::assertResponseIsSuccessful();

        $client->request('DELETE', $this->contactUrl($contact), [
            'auth_bearer' => $this->token,
        ]);

        // API Platform DELETE returns 204 No Content on success.
        self::assertResponseStatusCodeSame(204);

        // GET after delete returns 404 (archived playbooks are excluded).
        $client->request('GET', $this->contactUrl($contact), [
            'auth_bearer' => $this->token,
        ]);
        self::assertResponseStatusCodeSame(404);
    }

    public function testDeleteReturns404WhenNoActivePlaybook(): void
    {
        $client = static::createClient();
        $user = $this->getUser();
        $contact = $this->createContact($user);

        $client->request('DELETE', $this->contactUrl($contact), [
            'auth_bearer' => $this->token,
        ]);

        self::assertResponseStatusCodeSame(404);
    }

    public function testDeleteTenantIsolationReturns404(): void
    {
        $userA = $this->getUser();
        $contactA = $this->createContact($userA);

        $client = static::createClient();
        $client->request('POST', $this->contactUrl($contactA), [
            'auth_bearer' => $this->token,
            'json' => ['preset' => 'maintain_friend'],
        ]);
        self::assertResponseIsSuccessful();

        $userB = $this->createUser('pb-del-iso-' . bin2hex(random_bytes(4)) . '@test.com', 'pass');
        $tokenB = $this->getToken((string) $userB->getUuid(), 'pass');

        // getToken() calls createClient() internally; re-create so assertResponse* checks the right client.
        $client = static::createClient();

        $client->request('DELETE', $this->contactUrl($contactA), [
            'auth_bearer' => $tokenB,
        ]);

        self::assertResponseStatusCodeSame(404);
    }

    // ── Full lifecycle ─────────────────────────────────────────────────────────

    public function testPostReplacesSwitchesPlaybook(): void
    {
        $client = static::createClient();
        $user = $this->getUser();
        $contact = $this->createContact($user);

        // Activate first playbook.
        $client->request('POST', $this->contactUrl($contact), [
            'auth_bearer' => $this->token,
            'json' => ['preset' => 'maintain_friend'],
        ]);
        self::assertResponseIsSuccessful();

        // Activate a different playbook — must archive the first and create a new one.
        $response = $client->request('POST', $this->contactUrl($contact), [
            'auth_bearer' => $this->token,
            'json' => ['preset' => 'maintain_parents'],
        ]);

        self::assertResponseStatusCodeSame(201);
        self::assertSame('maintain_parents', $response->toArray()['preset']);
        self::assertSame('active', $response->toArray()['status']);
    }
}
