<?php

namespace Ari\Tests\Functional;

use Ari\Entity\AiSuggestion;
use Ari\Entity\Contact;
use Ari\Entity\ContactName;

/**
 * Functional tests for the AI Suggestion API endpoints:
 *   GET    /api/ai_suggestions   (filtered collection)
 *   PATCH  /api/ai_suggestions/{id}
 *   POST   /api/ai_suggestions/batch
 *   GET    /api/ai_suggestions/stats
 */
class AiSuggestionApiTest extends AbstractApiTestCase
{
    protected static ?bool $alwaysBootKernel = true;
    protected bool $autoLogin = false;

    private string $otherToken = '';
    private ContactName $contactName;
    private Contact $contact;

    #[\Override]
    protected function setUp(): void
    {
        parent::setUp();

        $em = $this->getEntityManager();

        $userUuid = 'ai-test-' . bin2hex(random_bytes(4));
        $user = $this->createUser($userUuid, 'pass');

        $otherUuid = 'ai-other-' . bin2hex(random_bytes(4));
        $this->createUser($otherUuid, 'pass');

        $contact = new Contact();
        $contact->setUser($user);
        $em->persist($contact);

        $contactName = new ContactName($contact);
        $contactName->setGiven('Janis');
        $contactName->setFamily('Berzins');
        $em->persist($contactName);

        $em->flush();

        $this->contact = $contact;
        $this->contactName = $contactName;

        $this->token = $this->getToken($userUuid, 'pass');
        $this->otherToken = $this->getToken($otherUuid, 'pass');
    }

    // ── Helpers ──────────────────────────────────────────────────────────────

    private function createPendingSuggestion(ContactName $contactName): AiSuggestion
    {
        $em = $this->getEntityManager();
        $id = $contactName->getId();
        \assert(null !== $id);
        // Re-fetch via the current EM so the entity and its tenant are managed
        $managed = $em->find(ContactName::class, $id);
        \assert(null !== $managed);
        $tenant = $managed->getTenant();
        \assert(null !== $tenant);

        $suggestion = new AiSuggestion('contact_name', $id, 'locale_alternative', md5('janis|berzins'));
        $suggestion->setTenant($tenant);
        $suggestion->setStatus('pending');
        $suggestion->setPayload([
            'detectedLocale' => 'ru',
            'suggestedLocale' => 'lv',
            'given' => 'Jānis',
            'family' => 'Bērziņš',
        ]);
        $em->persist($suggestion);
        $em->flush();

        return $suggestion;
    }

    // ── Tests ─────────────────────────────────────────────────────────────────

    public function testGetWithNoSuggestionsReturnsEmptyArray(): void
    {
        $client = static::createClient();
        $id = $this->contactName->getId();

        $response = $client->request('GET', '/api/ai_suggestions', [
            'auth_bearer' => $this->token,
            'headers' => ['Accept' => 'application/ld+json'],
            'query' => ['entityType' => 'contact_name', 'entityId' => $id],
        ]);

        self::assertResponseIsSuccessful();
        self::assertCount(0, $response->toArray()['member']);
    }

    public function testGetWithPendingSuggestionReturnsCorrectStructure(): void
    {
        $this->createPendingSuggestion($this->contactName);
        $client = static::createClient();
        $id = $this->contactName->getId();

        $response = $client->request('GET', '/api/ai_suggestions', [
            'auth_bearer' => $this->token,
            'headers' => ['Accept' => 'application/ld+json'],
            'query' => ['entityType' => 'contact_name', 'entityId' => $id],
        ]);

        self::assertResponseIsSuccessful();
        /** @var array<int, array<string, mixed>> $members */
        $members = $response->toArray()['member'];
        self::assertCount(1, $members);

        $item = $members[0];
        self::assertSame('contact_name', $item['entityType']);
        self::assertSame($id, $item['entityId']);
        self::assertSame('pending', $item['status']);
        self::assertArrayHasKey('payload', $item);
        /** @var array<string, string> $payload */
        $payload = $item['payload'];
        self::assertSame('ru', $payload['detectedLocale']);
        self::assertSame('lv', $payload['suggestedLocale']);
        self::assertArrayHasKey('@id', $item);

        // Dismissed suggestions should not appear
        $em = $this->getEntityManager();
        $managedName = $em->find(ContactName::class, (int) $id);
        \assert(null !== $managedName);
        $dismissed = new AiSuggestion('contact_name', (int) $id, 'locale_alternative', md5('dismissed'));
        $dismissed->setTenant($managedName->getTenant());
        $dismissed->setStatus('dismissed');
        $dismissed->setPayload([]);
        $em->persist($dismissed);
        $em->flush();

        $response2 = $client->request('GET', '/api/ai_suggestions', [
            'auth_bearer' => $this->token,
            'headers' => ['Accept' => 'application/ld+json'],
            'query' => ['entityType' => 'contact_name', 'entityId' => $id],
        ]);
        // Still only 1 pending
        self::assertCount(1, $response2->toArray()['member']);
    }

    public function testPatchAcceptedCreatesNewContactNameAndSetsLocale(): void
    {
        $suggestion = $this->createPendingSuggestion($this->contactName);
        $client = static::createClient();
        $suggestionId = $suggestion->getId();
        \assert(null !== $suggestionId);

        $patchResponse = $client->request('PATCH', '/api/ai_suggestions/' . $suggestionId, [
            'auth_bearer' => $this->token,
            'json' => ['status' => 'accepted'],
            'headers' => ['Content-Type' => 'application/merge-patch+json'],
        ]);

        self::assertResponseIsSuccessful();
        $data = $patchResponse->toArray();
        self::assertSame('accepted', $data['status']);
        self::assertNotNull($data['resolvedAt']);

        // Verify original ContactName now has detectedLocale
        $em = $this->getEntityManager();
        $em->clear();
        /** @var ContactName $originalName */
        $originalName = $em->find(ContactName::class, $this->contactName->getId());
        self::assertNotNull($originalName);
        self::assertSame('ru', $originalName->getLocale());

        // Verify new ContactName was created with suggestedLocale
        $allNames = $em->getRepository(ContactName::class)->findBy(['contact' => $this->contact]);
        self::assertCount(2, $allNames);

        $newName = null;
        foreach ($allNames as $name) {
            if ($name->getId() !== $this->contactName->getId()) {
                $newName = $name;
                break;
            }
        }
        self::assertNotNull($newName);
        self::assertSame('lv', $newName->getLocale());
        self::assertSame('Jānis', $newName->getGiven());
        self::assertSame('Bērziņš', $newName->getFamily());
    }

    public function testPatchDismissedMarksSuggestionAsDismissed(): void
    {
        $suggestion = $this->createPendingSuggestion($this->contactName);
        $client = static::createClient();
        $suggestionId = $suggestion->getId();
        \assert(null !== $suggestionId);

        $patchResponse = $client->request('PATCH', '/api/ai_suggestions/' . $suggestionId, [
            'auth_bearer' => $this->token,
            'json' => ['status' => 'dismissed'],
            'headers' => ['Content-Type' => 'application/merge-patch+json'],
        ]);

        self::assertResponseIsSuccessful();
        $data = $patchResponse->toArray();
        self::assertSame('dismissed', $data['status']);
        self::assertNotNull($data['resolvedAt']);

        // Verify no new ContactName was created
        $em = $this->getEntityManager();
        $em->clear();
        $names = $em->getRepository(ContactName::class)->findBy(['contact' => $this->contact]);
        self::assertCount(1, $names);
    }

    public function testPatchInvalidStatusReturnsUnprocessable(): void
    {
        $suggestion = $this->createPendingSuggestion($this->contactName);
        $client = static::createClient();
        $suggestionId = $suggestion->getId();
        \assert(null !== $suggestionId);

        $client->request('PATCH', '/api/ai_suggestions/' . $suggestionId, [
            'auth_bearer' => $this->token,
            'json' => ['status' => 'invalid'],
            'headers' => ['Content-Type' => 'application/merge-patch+json'],
        ]);

        self::assertResponseStatusCodeSame(422);
    }

    public function testPostBatchReturns202(): void
    {
        $client = static::createClient();

        $client->request('POST', '/api/ai_suggestions/batch', [
            'auth_bearer' => $this->token,
        ]);

        self::assertResponseStatusCodeSame(202);
    }

    public function testUnauthenticatedRequestReturns401(): void
    {
        $client = static::createClient();
        $id = $this->contactName->getId();

        $client->request('GET', '/api/ai_suggestions', [
            'query' => ['entityType' => 'contact_name', 'entityId' => $id],
        ]);
        self::assertResponseStatusCodeSame(401);

        $client->request('POST', '/api/ai_suggestions/batch');
        self::assertResponseStatusCodeSame(401);
    }

    public function testTenantIsolationGetReturnsEmptyForOtherUser(): void
    {
        $this->createPendingSuggestion($this->contactName);
        $client = static::createClient();
        $id = $this->contactName->getId();

        // User B cannot see User A's suggestions
        $response = $client->request('GET', '/api/ai_suggestions', [
            'auth_bearer' => $this->otherToken,
            'headers' => ['Accept' => 'application/ld+json'],
            'query' => ['entityType' => 'contact_name', 'entityId' => $id],
        ]);

        self::assertResponseIsSuccessful();
        self::assertCount(0, $response->toArray()['member']);
    }

    public function testTenantIsolationPatchReturns404ForOtherUser(): void
    {
        $suggestion = $this->createPendingSuggestion($this->contactName);
        $client = static::createClient();
        $suggestionId = $suggestion->getId();
        \assert(null !== $suggestionId);

        $client->request('PATCH', '/api/ai_suggestions/' . $suggestionId, [
            'auth_bearer' => $this->otherToken,
            'json' => ['status' => 'dismissed'],
            'headers' => ['Content-Type' => 'application/merge-patch+json'],
        ]);

        self::assertResponseStatusCodeSame(404);
    }

    public function testStatsEndpointReturnsCorrectCounts(): void
    {
        $em = $this->getEntityManager();
        $id = (int) $this->contactName->getId();
        $managed = $em->find(ContactName::class, $id);
        \assert(null !== $managed);
        $tenant = $managed->getTenant();
        \assert(null !== $tenant);

        // Create one suggestion of each status
        foreach (['pending', 'accepted', 'dismissed'] as $status) {
            $s = new AiSuggestion('contact_name', $id, 'locale_alternative', md5($status));
            $s->setTenant($tenant);
            $s->setStatus($status);
            $s->setPayload([]);
            $s->setTokensPrompt(10);
            $s->setTokensCompletion(20);
            if ('pending' !== $status) {
                $s->setResolvedAt(new \DateTimeImmutable());
            }
            $em->persist($s);
        }
        $em->flush();

        $client = static::createClient();
        $response = $client->request('GET', '/api/ai_suggestions/stats', [
            'auth_bearer' => $this->token,
        ]);

        self::assertResponseIsSuccessful();
        $data = $response->toArray();
        self::assertSame(1, $data['pending']);
        self::assertSame(1, $data['accepted']);
        self::assertSame(1, $data['dismissed']);
        self::assertSame(30, $data['tokensPrompt']);
        self::assertSame(60, $data['tokensCompletion']);
    }

    public function testOrphanAiSuggestionsDeletedWhenContactNameDeleted(): void
    {
        $suggestion = $this->createPendingSuggestion($this->contactName);
        $suggestionId = $suggestion->getId();
        \assert(null !== $suggestionId);
        $contactNameId = $this->contactName->getId();
        \assert(null !== $contactNameId);
        $contactNameIri = '/api/contact_names/' . $contactNameId;

        $client = static::createClient();
        $client->request('DELETE', $contactNameIri, [
            'auth_bearer' => $this->token,
        ]);
        self::assertResponseStatusCodeSame(204);

        // Verify orphaned AiSuggestion was cleaned up
        $em = $this->getEntityManager();
        $em->clear();
        $found = $em->find(AiSuggestion::class, $suggestionId);
        self::assertNull($found, 'AiSuggestion should be deleted when ContactName is removed');
    }

    public function testGetWithoutEntityFiltersReturnsEmptyArray(): void
    {
        $this->createPendingSuggestion($this->contactName);
        $client = static::createClient();

        // No entityType or entityId → provider returns []
        $response = $client->request('GET', '/api/ai_suggestions', [
            'auth_bearer' => $this->token,
            'headers' => ['Accept' => 'application/ld+json'],
        ]);

        self::assertResponseIsSuccessful();
        self::assertCount(0, $response->toArray()['member']);
    }
}
