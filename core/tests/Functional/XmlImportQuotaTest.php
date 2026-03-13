<?php

namespace Ari\Tests\Functional;

use Ari\Entity\User;
use Ari\Entity\UserPlan;
use Doctrine\ORM\EntityManagerInterface;

/**
 * Tests XML import quota enforcement.
 * Uses the test plan override (free.contacts_limit = 3).
 *
 * @psalm-suppress InternalMethod
 */
class XmlImportQuotaTest extends AbstractApiTestCase
{
    private EntityManagerInterface $entityManager;

    #[\Override]
    protected function setUp(): void
    {
        parent::setUp();
        $this->entityManager = $this->getEntityManager();
    }

    public function testImportAllContactsWhenQuotaNotExceeded(): void
    {
        // self_hosted plan (unlimited) → all 2 contacts imported → 204
        $xml = $this->buildXml(['Alice Smith', 'Bob Jones']);
        $client = static::createClient();
        $client->request('POST', '/api/contacts/import-xml', [
            'auth_bearer' => $this->token,
            'headers' => ['Content-Type' => 'text/xml'],
            'body' => $xml,
        ]);

        self::assertResponseStatusCodeSame(204);
    }

    public function testPartialImportWhen207(): void
    {
        // free plan, limit=3, no existing contacts → 5 new contacts → import 3, skip 2 → 207
        $user = $this->entityManager->getRepository(User::class)->findOneBy(['uuid' => $this->userUuid]);
        self::assertNotNull($user);
        $this->setUserPlan($user, 'free');

        $xml = $this->buildXml(['Alice', 'Bob', 'Carol', 'Dave', 'Eve']);
        $client = static::createClient();
        $response = $client->request('POST', '/api/contacts/import-xml', [
            'auth_bearer' => $this->token,
            'headers' => ['Content-Type' => 'text/xml'],
            'body' => $xml,
        ]);

        self::assertResponseStatusCodeSame(207);
        $data = $response->toArray(false);
        self::assertSame(3, $data['imported']);
        self::assertSame(2, $data['skipped']);
        self::assertSame('quota_exceeded', $data['reason']);
        self::assertCount(2, $data['skippedContacts']);
    }

    public function testFullQuotaExceededReturns422(): void
    {
        // free plan, limit=3, already 3 contacts → 0 remaining → 422
        $user = $this->entityManager->getRepository(User::class)->findOneBy(['uuid' => $this->userUuid]);
        self::assertNotNull($user);
        $this->setUserPlan($user, 'free');

        // Fill quota
        for ($i = 0; $i < 3; ++$i) {
            $contact = new \Ari\Entity\Contact();
            $contact->setUser($user);
            $this->entityManager->persist($contact);
        }
        $this->entityManager->flush();

        $xml = $this->buildXml(['NewContact']);
        $client = static::createClient();
        $response = $client->request('POST', '/api/contacts/import-xml', [
            'auth_bearer' => $this->token,
            'headers' => ['Content-Type' => 'text/xml'],
            'body' => $xml,
        ]);

        self::assertResponseStatusCodeSame(422);
        $data = $response->toArray(false);
        self::assertSame('quota_exceeded', $data['error']);
    }

    public function testImportUpdatesExistingContactsEvenWhenQuotaExhausted(): void
    {
        // Existing contacts (same UUID in XML) are updates — they don't consume quota.
        // If quota=0 but all contacts in XML are updates → 204 (no new contacts).
        $user = $this->entityManager->getRepository(User::class)->findOneBy(['uuid' => $this->userUuid]);
        self::assertNotNull($user);
        $this->setUserPlan($user, 'free');

        // Create a contact with a known UUID
        $uuid = '11111111-1111-1111-1111-111111111111';
        $contact = new \Ari\Entity\Contact();
        $contact->setUser($user);
        $contact->setUuid(\Symfony\Component\Uid\Uuid::fromString($uuid));
        $this->entityManager->persist($contact);

        // Fill remaining quota
        for ($i = 0; $i < 2; ++$i) {
            $c = new \Ari\Entity\Contact();
            $c->setUser($user);
            $this->entityManager->persist($c);
        }
        $this->entityManager->flush();

        // XML only contains the existing contact → update only, no quota consumed
        $xml = $this->buildXml(['Alice Smith'], [$uuid]);
        $client = static::createClient();
        $client->request('POST', '/api/contacts/import-xml', [
            'auth_bearer' => $this->token,
            'headers' => ['Content-Type' => 'text/xml'],
            'body' => $xml,
        ]);

        self::assertResponseStatusCodeSame(204);
    }

    /**
     * Builds a minimal export XML with the given contact names.
     * If $uuids is provided, contacts will have those UUIDs (for testing updates).
     *
     * @param string[] $names
     * @param string[] $uuids
     */
    private function buildXml(array $names, array $uuids = []): string
    {
        $contactsXml = '';
        foreach ($names as $i => $name) {
            $parts = explode(' ', $name, 2);
            $given = $parts[0];
            $family = $parts[1] ?? '';
            $uuidXml = isset($uuids[$i]) ? '<uuid>' . $uuids[$i] . '</uuid>' : '';
            $contactsXml .= <<<XML
            <contact>
                {$uuidXml}
                <contactNames>
                    <contactName>
                        <given>{$given}</given>
                        <family>{$family}</family>
                    </contactName>
                </contactNames>
                <contactDates/>
                <contactEmailAdresses/>
                <phoneNumbers/>
                <contactAddresses/>
                <contactOrganizations/>
                <contactBiographies/>
                <contactGroups/>
                <contactRelations/>
            </contact>
            XML;
        }

        return <<<XML
        <?xml version="1.0" encoding="UTF-8"?>
        <export>
            <groups/>
            <contacts>
                {$contactsXml}
            </contacts>
        </export>
        XML;
    }

    private function setUserPlan(User $user, string $planId): void
    {
        $existing = $this->entityManager->getRepository(UserPlan::class)->findOneBy(['user' => $user]);
        if (null !== $existing) {
            $existing->setPlanId($planId);
        } else {
            $plan = new UserPlan($user, $planId);
            $this->entityManager->persist($plan);
        }
        $this->entityManager->flush();
    }
}
