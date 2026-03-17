<?php

namespace Ari\Tests\Functional;

use ApiPlatform\Symfony\Bundle\Test\ApiTestCase;
use Ari\Entity\User;
use Doctrine\ORM\EntityManagerInterface;

/**
 * Tests for GET /api/contacts/needs-attention (NeedsAttentionProvider, Phase 2).
 *
 * Verifies: overdueDays computation, ordering, cadence filtering, tenant isolation, pagination.
 */
class NeedsAttentionApiTest extends ApiTestCase
{
    protected static ?bool $alwaysBootKernel = true;

    private string $token;
    private string $otherToken;

    #[\Override]
    protected function setUp(): void
    {
        static::createClient();
        $container = static::getContainer();

        /** @var \Doctrine\Bundle\DoctrineBundle\Registry $doctrine */
        $doctrine = $container->get('doctrine');
        /** @var EntityManagerInterface $em */
        $em = $doctrine->getManager();

        /** @var \Symfony\Component\DependencyInjection\Container $testContainer */
        $testContainer = $container->get('test.service_container');
        /** @var \Symfony\Component\PasswordHasher\Hasher\UserPasswordHasher $hasher */
        $hasher = $testContainer->get('security.user_password_hasher');

        $userAUuid = 'na-a-' . bin2hex(random_bytes(4));
        $userA = new User();
        $userA->setUuid($userAUuid);
        $userA->setPassword($hasher->hashPassword($userA, 'pass'));
        $em->persist($userA);

        $userBUuid = 'na-b-' . bin2hex(random_bytes(4));
        $userB = new User();
        $userB->setUuid($userBUuid);
        $userB->setPassword($hasher->hashPassword($userB, 'pass'));
        $em->persist($userB);

        $em->flush();

        $this->token = $this->getToken($userAUuid, 'pass');
        $this->otherToken = $this->getToken($userBUuid, 'pass');
    }

    private function getToken(string $username, string $password): string
    {
        $response = static::createClient()->request('POST', '/api/login_check', [
            'json' => ['username' => $username, 'password' => $password],
        ]);

        return $response->toArray()['token'];
    }

    /** Creates a contact with the given cadenceDays and returns its IRI. */
    private function createContact(?int $cadenceDays, ?string $token = null): string
    {
        $token = $token ?? $this->token;
        $payload = $cadenceDays !== null ? ['cadenceDays' => $cadenceDays] : [];

        $response = static::createClient()->request('POST', '/api/contacts', [
            'auth_bearer' => $token,
            'json' => $payload,
        ]);
        self::assertResponseStatusCodeSame(201);

        return $response->toArray()['@id'];
    }

    /** Adds a contact_interaction with the given timestamp. */
    private function addInteraction(string $contactIri, \DateTimeImmutable $timestamp): void
    {
        static::createClient()->request('POST', '/api/contact_interactions', [
            'auth_bearer' => $this->token,
            'json' => [
                'contact' => $contactIri,
                'type' => 'call',
                'description' => '',
                'timestamp' => $timestamp->format(\DateTimeInterface::ATOM),
            ],
        ]);
        self::assertResponseStatusCodeSame(201);
    }

    /**
     * Returns the decoded needs-attention collection for User A.
     *
     * @param array<string, mixed> $query
     * @return array<string, mixed>
     */
    private function fetchNeedsAttention(array $query = []): array
    {
        $response = static::createClient()->request('GET', '/api/contacts/needs-attention', [
            'auth_bearer' => $this->token,
            'query' => $query,
        ]);
        self::assertResponseIsSuccessful();

        return $response->toArray();
    }

    // ── Happy path ──────────────────────────────────────────────────────────

    public function testOverdueContactAppearsWithCorrectOverdueDays(): void
    {
        $contactIri = $this->createContact(30);
        // Use midnight to avoid fractional-day rounding in diff()
        $this->addInteraction($contactIri, new \DateTimeImmutable('midnight -45 days'));

        $data = $this->fetchNeedsAttention();

        self::assertSame(1, $data['totalItems']);
        self::assertCount(1, $data['member']);

        $item = $data['member'][0];
        self::assertSame(15, $item['overdueDays']);
        self::assertNotNull($item['lastInteractionAt']);
        self::assertSame(30, $item['cadenceDays']);
    }

    public function testContactWithRecentInteractionDoesNotAppear(): void
    {
        $contactIri = $this->createContact(30);
        $this->addInteraction($contactIri, new \DateTimeImmutable('midnight -10 days'));

        $data = $this->fetchNeedsAttention();

        self::assertSame(0, $data['totalItems']);
        self::assertCount(0, $data['member']);
    }

    public function testNeverInteractedContactAppearsWithOverdueDaysEqualToCadence(): void
    {
        $this->createContact(30);

        $data = $this->fetchNeedsAttention();

        self::assertSame(1, $data['totalItems']);
        $item = $data['member'][0];
        self::assertSame(30, $item['overdueDays']);
        self::assertNull($item['lastInteractionAt']);
    }

    public function testContactWithoutCadenceNeverAppears(): void
    {
        // Contact with no cadenceDays — no cadence configured
        $contactIri = $this->createContact(null);
        $this->addInteraction($contactIri, new \DateTimeImmutable('midnight -100 days'));

        $data = $this->fetchNeedsAttention();

        self::assertSame(0, $data['totalItems']);
    }

    // ── Ordering ─────────────────────────────────────────────────────────────

    public function testNeverInteractedContactAppearsBeforeOverdueContact(): void
    {
        // Contact A: overdue by 15 days
        $contactA = $this->createContact(30);
        $this->addInteraction($contactA, new \DateTimeImmutable('midnight -45 days'));

        // Contact B: never interacted — should appear first
        $this->createContact(30);

        $data = $this->fetchNeedsAttention();

        self::assertSame(2, $data['totalItems']);
        // First result must be the never-interacted one
        self::assertNull($data['member'][0]['lastInteractionAt']);
    }

    // ── Authentication & isolation ───────────────────────────────────────────

    public function testUnauthenticatedReturns401(): void
    {
        static::createClient()->request('GET', '/api/contacts/needs-attention');

        self::assertResponseStatusCodeSame(401);
    }

    public function testTenantIsolation(): void
    {
        // User A has one overdue contact
        $contactIri = $this->createContact(30);
        $this->addInteraction($contactIri, new \DateTimeImmutable('midnight -45 days'));

        // User B sees no contacts
        $response = static::createClient()->request('GET', '/api/contacts/needs-attention', [
            'auth_bearer' => $this->otherToken,
        ]);
        self::assertResponseIsSuccessful();
        $data = $response->toArray();

        self::assertSame(0, $data['totalItems']);
        self::assertCount(0, $data['member']);
    }

    // ── Ordering (secondary) ─────────────────────────────────────────────────

    public function testMostOverdueContactWithInteractionsAppearsFirst(): void
    {
        // Contact A: overdue by 5 days (cadence=30, last 35 days ago)
        $contactA = $this->createContact(30);
        $this->addInteraction($contactA, new \DateTimeImmutable('midnight -35 days'));

        // Contact B: overdue by 20 days (cadence=30, last 50 days ago) — should appear first
        $contactB = $this->createContact(30);
        $this->addInteraction($contactB, new \DateTimeImmutable('midnight -50 days'));

        $data = $this->fetchNeedsAttention();

        self::assertSame(2, $data['totalItems']);
        // More overdue contact (B, dueDate further in the past) must come first
        self::assertSame(20, $data['member'][0]['overdueDays']);
        self::assertSame(5, $data['member'][1]['overdueDays']);
    }

    // ── Pagination ───────────────────────────────────────────────────────────

    public function testPagination(): void
    {
        // Create 5 overdue contacts (cadence=7, last interaction 14 days ago)
        for ($i = 0; $i < 5; ++$i) {
            $contactIri = $this->createContact(7);
            $this->addInteraction($contactIri, new \DateTimeImmutable('midnight -14 days'));
        }

        $page1 = $this->fetchNeedsAttention(['itemsPerPage' => 2, 'page' => 1]);
        self::assertSame(5, $page1['totalItems']);
        self::assertCount(2, $page1['member']);

        $page3 = $this->fetchNeedsAttention(['itemsPerPage' => 2, 'page' => 3]);
        self::assertSame(5, $page3['totalItems']);
        self::assertCount(1, $page3['member']);
    }
}
