<?php

namespace Ari\Tests\Functional;

use ApiPlatform\Symfony\Bundle\Test\ApiTestCase;
use Ari\Entity\AuditLog;
use Ari\Entity\Contact;
use Ari\Entity\User;
use Doctrine\ORM\EntityManagerInterface;

class ContactSnapshotTest extends ApiTestCase
{
    private string $token;
    private string $userUuid;
    private EntityManagerInterface $em;

    protected static ?bool $alwaysBootKernel = true;

    #[\Override]
    protected function setUp(): void
    {
        static::createClient();
        $container = static::getContainer();
        /** @var \Doctrine\Bundle\DoctrineBundle\Registry $doctrine */
        $doctrine = $container->get('doctrine');
        /** @var EntityManagerInterface $em */
        $em = $doctrine->getManager();
        $this->em = $em;

        /** @var \Symfony\Component\DependencyInjection\Container $testContainer */
        $testContainer = $container->get('test.service_container');
        /** @var \Symfony\Component\PasswordHasher\Hasher\UserPasswordHasher $hasher */
        $hasher = $testContainer->get('security.user_password_hasher');

        $this->userUuid = 'snap-' . bin2hex(random_bytes(4));
        $user = new User();
        $user->setUuid($this->userUuid);
        $user->setPassword($hasher->hashPassword($user, 'pass'));
        $this->em->persist($user);
        $this->em->flush();

        $this->token = $this->getToken($this->userUuid, 'pass');
    }

    // ─── Standard Scenarios ──────────────────────────────────────────

    public function testSnapshotAfterCreate(): void
    {
        $client = static::createClient();
        $contactId = $this->createContact($client);
        $logId = $this->findLogId(Contact::class, (string) $contactId, 'INSERT');

        $response = $client->request('GET', "/api/contacts/{$contactId}/snapshot/{$logId}", [
            'auth_bearer' => $this->token,
        ]);

        self::assertResponseIsSuccessful();
        $data = $response->toArray();

        self::assertArrayHasKey('snapshot', $data);
        self::assertNotNull($data['snapshot']['contact']);
        self::assertSame([], $data['snapshot']['contactNames']);
        self::assertSame([], $data['snapshot']['contactPhoneNumbers']);
    }

    public function testSnapshotAfterAddName(): void
    {
        $client = static::createClient();
        $contactId = $this->createContact($client);
        $contactIri = "/api/contacts/{$contactId}";

        $response = $client->request('POST', '/api/contact_names', [
            'auth_bearer' => $this->token,
            'json' => ['given' => 'John', 'family' => 'Doe', 'contact' => $contactIri],
        ]);
        self::assertResponseStatusCodeSame(201);
        $nameId = $response->toArray()['id'];

        $logId = $this->findLogId('Ari\Entity\ContactName', (string) $nameId, 'INSERT');

        $response = $client->request('GET', "/api/contacts/{$contactId}/snapshot/{$logId}", [
            'auth_bearer' => $this->token,
        ]);

        self::assertResponseIsSuccessful();
        $snapshot = $response->toArray()['snapshot'];

        self::assertNotNull($snapshot['contact']);
        self::assertCount(1, $snapshot['contactNames']);
        self::assertSame('John', $snapshot['contactNames'][0]['given']);
    }

    public function testSnapshotAfterAddMultipleChildren(): void
    {
        $client = static::createClient();
        $contactId = $this->createContact($client);
        $contactIri = "/api/contacts/{$contactId}";

        $client->request('POST', '/api/contact_names', [
            'auth_bearer' => $this->token,
            'json' => ['given' => 'Jane', 'contact' => $contactIri],
        ]);
        self::assertResponseStatusCodeSame(201);

        $client->request('POST', '/api/contact_phone_numbers', [
            'auth_bearer' => $this->token,
            'json' => ['value' => '123456', 'contact' => $contactIri],
        ]);
        self::assertResponseStatusCodeSame(201);

        $response = $client->request('POST', '/api/contact_email_adresses', [
            'auth_bearer' => $this->token,
            'json' => ['value' => 'jane@example.com', 'contact' => $contactIri],
        ]);
        self::assertResponseStatusCodeSame(201);
        $emailId = $response->toArray()['id'];

        $logId = $this->findLogId('Ari\Entity\ContactEmailAdress', (string) $emailId, 'INSERT');

        $response = $client->request('GET', "/api/contacts/{$contactId}/snapshot/{$logId}", [
            'auth_bearer' => $this->token,
        ]);

        self::assertResponseIsSuccessful();
        $snapshot = $response->toArray()['snapshot'];

        self::assertCount(1, $snapshot['contactNames']);
        self::assertCount(1, $snapshot['contactPhoneNumbers']);
        self::assertCount(1, $snapshot['contactEmailAddresses']);
    }

    public function testSnapshotAfterUpdateName(): void
    {
        $client = static::createClient();
        $contactId = $this->createContact($client);
        $contactIri = "/api/contacts/{$contactId}";

        $response = $client->request('POST', '/api/contact_names', [
            'auth_bearer' => $this->token,
            'json' => ['given' => 'Original', 'contact' => $contactIri],
        ]);
        self::assertResponseStatusCodeSame(201);
        $nameIri = $response->toArray()['@id'];
        $nameId = $response->toArray()['id'];

        $logIdBefore = $this->findLogId('Ari\Entity\ContactName', (string) $nameId, 'INSERT');

        $client->request('PATCH', $nameIri, [
            'auth_bearer' => $this->token,
            'headers' => ['Content-Type' => 'application/merge-patch+json'],
            'json' => ['given' => 'Updated'],
        ]);
        self::assertResponseStatusCodeSame(200);

        $logIdAfter = $this->findLogId('Ari\Entity\ContactName', (string) $nameId, 'UPDATE');

        // Snapshot before update
        $response = $client->request('GET', "/api/contacts/{$contactId}/snapshot/{$logIdBefore}", [
            'auth_bearer' => $this->token,
        ]);
        self::assertResponseIsSuccessful();
        self::assertSame('Original', $response->toArray()['snapshot']['contactNames'][0]['given']);

        // Snapshot after update
        $response = $client->request('GET', "/api/contacts/{$contactId}/snapshot/{$logIdAfter}", [
            'auth_bearer' => $this->token,
        ]);
        self::assertResponseIsSuccessful();
        self::assertSame('Updated', $response->toArray()['snapshot']['contactNames'][0]['given']);
    }

    public function testSnapshotAfterRemoveChild(): void
    {
        $client = static::createClient();
        $contactId = $this->createContact($client);
        $contactIri = "/api/contacts/{$contactId}";

        $response = $client->request('POST', '/api/contact_phone_numbers', [
            'auth_bearer' => $this->token,
            'json' => ['value' => '555-0001', 'contact' => $contactIri],
        ]);
        self::assertResponseStatusCodeSame(201);
        $phoneIri = $response->toArray()['@id'];
        $phoneId = $response->toArray()['id'];

        $logIdInsert = $this->findLogId('Ari\Entity\ContactPhoneNumber', (string) $phoneId, 'INSERT');

        $client->request('DELETE', $phoneIri, ['auth_bearer' => $this->token]);
        self::assertResponseStatusCodeSame(204);

        $logIdRemove = $this->findLogId('Ari\Entity\ContactPhoneNumber', (string) $phoneId, 'REMOVE');

        // Before removal
        $response = $client->request('GET', "/api/contacts/{$contactId}/snapshot/{$logIdInsert}", [
            'auth_bearer' => $this->token,
        ]);
        self::assertResponseIsSuccessful();
        self::assertCount(1, $response->toArray()['snapshot']['contactPhoneNumbers']);

        // After removal
        $response = $client->request('GET', "/api/contacts/{$contactId}/snapshot/{$logIdRemove}", [
            'auth_bearer' => $this->token,
        ]);
        self::assertResponseIsSuccessful();
        self::assertSame([], $response->toArray()['snapshot']['contactPhoneNumbers']);
    }

    public function testSnapshotWithAllEntityTypes(): void
    {
        $client = static::createClient();
        $contactId = $this->createContact($client);
        $contactIri = "/api/contacts/{$contactId}";

        $client->request('POST', '/api/contact_names', [
            'auth_bearer' => $this->token,
            'json' => ['given' => 'Full', 'contact' => $contactIri],
        ]);
        self::assertResponseStatusCodeSame(201);

        $client->request('POST', '/api/contact_phone_numbers', [
            'auth_bearer' => $this->token,
            'json' => ['value' => '123', 'contact' => $contactIri],
        ]);
        self::assertResponseStatusCodeSame(201);

        $client->request('POST', '/api/contact_email_adresses', [
            'auth_bearer' => $this->token,
            'json' => ['value' => 'a@b.c', 'contact' => $contactIri],
        ]);
        self::assertResponseStatusCodeSame(201);

        $client->request('POST', '/api/contact_dates', [
            'auth_bearer' => $this->token,
            'json' => ['date' => '2000-01-01', 'text' => 'Birthday', 'contact' => $contactIri],
        ]);
        self::assertResponseStatusCodeSame(201);

        $client->request('POST', '/api/contact_addresses', [
            'auth_bearer' => $this->token,
            'json' => ['street' => '123 Main St', 'contact' => $contactIri],
        ]);
        self::assertResponseStatusCodeSame(201);

        $client->request('POST', '/api/contact_organizations', [
            'auth_bearer' => $this->token,
            'json' => ['name' => 'Acme', 'contact' => $contactIri],
        ]);
        self::assertResponseStatusCodeSame(201);

        $response = $client->request('POST', '/api/contact_biographies', [
            'auth_bearer' => $this->token,
            'json' => ['value' => 'A bio', 'contact' => $contactIri],
        ]);
        self::assertResponseStatusCodeSame(201);
        $bioId = $response->toArray()['id'];

        $logId = $this->findLogId('Ari\Entity\ContactBiography', (string) $bioId, 'INSERT');

        $response = $client->request('GET', "/api/contacts/{$contactId}/snapshot/{$logId}", [
            'auth_bearer' => $this->token,
        ]);
        self::assertResponseIsSuccessful();
        $snapshot = $response->toArray()['snapshot'];

        self::assertCount(1, $snapshot['contactNames']);
        self::assertCount(1, $snapshot['contactPhoneNumbers']);
        self::assertCount(1, $snapshot['contactEmailAddresses']);
        self::assertCount(1, $snapshot['contactDates']);
        self::assertCount(1, $snapshot['contactAddresses']);
        self::assertCount(1, $snapshot['contactOrganizations']);
        self::assertCount(1, $snapshot['contactBiographies']);
    }

    public function testSnapshotPreservesOrder(): void
    {
        $client = static::createClient();
        $contactId = $this->createContact($client);
        $contactIri = "/api/contacts/{$contactId}";

        $client->request('POST', '/api/contact_names', [
            'auth_bearer' => $this->token,
            'json' => ['given' => 'First', 'contact' => $contactIri],
        ]);
        self::assertResponseStatusCodeSame(201);

        $response = $client->request('POST', '/api/contact_names', [
            'auth_bearer' => $this->token,
            'json' => ['given' => 'Second', 'contact' => $contactIri],
        ]);
        self::assertResponseStatusCodeSame(201);
        $secondNameId = $response->toArray()['id'];

        $logId = $this->findLogId('Ari\Entity\ContactName', (string) $secondNameId, 'INSERT');

        $response = $client->request('GET', "/api/contacts/{$contactId}/snapshot/{$logId}", [
            'auth_bearer' => $this->token,
        ]);
        self::assertResponseIsSuccessful();
        /** @var list<array<string, mixed>> $names */
        $names = $response->toArray()['snapshot']['contactNames'];

        self::assertCount(2, $names);
        self::assertSame('First', $names[0]['given']);
        self::assertSame('Second', $names[1]['given']);
    }

    public function testSnapshotAtMiddleOfTimeline(): void
    {
        $client = static::createClient();
        $contactId = $this->createContact($client);
        $contactIri = "/api/contacts/{$contactId}";

        $response = $client->request('POST', '/api/contact_names', [
            'auth_bearer' => $this->token,
            'json' => ['given' => 'Name', 'contact' => $contactIri],
        ]);
        self::assertResponseStatusCodeSame(201);
        $nameId = $response->toArray()['id'];

        $logIdName = $this->findLogId('Ari\Entity\ContactName', (string) $nameId, 'INSERT');

        // These come AFTER — should NOT appear in snapshot at logIdName
        $client->request('POST', '/api/contact_phone_numbers', [
            'auth_bearer' => $this->token,
            'json' => ['value' => '999', 'contact' => $contactIri],
        ]);
        self::assertResponseStatusCodeSame(201);

        $client->request('POST', '/api/contact_dates', [
            'auth_bearer' => $this->token,
            'json' => ['date' => '2025-06-15', 'text' => 'Event', 'contact' => $contactIri],
        ]);
        self::assertResponseStatusCodeSame(201);

        $response = $client->request('GET', "/api/contacts/{$contactId}/snapshot/{$logIdName}", [
            'auth_bearer' => $this->token,
        ]);
        self::assertResponseIsSuccessful();
        $snapshot = $response->toArray()['snapshot'];

        self::assertCount(1, $snapshot['contactNames']);
        self::assertSame([], $snapshot['contactPhoneNumbers']);
        self::assertSame([], $snapshot['contactDates']);
    }

    // ─── Edge Cases ──────────────────────────────────────────────────

    public function testSnapshotInvalidLogId(): void
    {
        $client = static::createClient();

        $client->request('GET', '/api/contacts/1/snapshot/999999', [
            'auth_bearer' => $this->token,
        ]);

        self::assertResponseStatusCodeSame(404);
    }

    public function testSnapshotLogBelongsToDifferentContact(): void
    {
        $client = static::createClient();
        $contactIdA = $this->createContact($client);
        $contactIdB = $this->createContact($client);

        $logIdA = $this->findLogId(Contact::class, (string) $contactIdA, 'INSERT');

        // Try to get snapshot of contact B using log from contact A
        $client->request('GET', "/api/contacts/{$contactIdB}/snapshot/{$logIdA}", [
            'auth_bearer' => $this->token,
        ]);

        self::assertResponseStatusCodeSame(404);
    }

    public function testSnapshotTenantIsolation(): void
    {
        $client = static::createClient();
        $contactId = $this->createContact($client);
        $logId = $this->findLogId(Contact::class, (string) $contactId, 'INSERT');

        // Create second user
        $container = static::getContainer();
        /** @var \Symfony\Component\DependencyInjection\Container $testContainer */
        $testContainer = $container->get('test.service_container');
        /** @var \Symfony\Component\PasswordHasher\Hasher\UserPasswordHasher $hasher */
        $hasher = $testContainer->get('security.user_password_hasher');

        $userBUuid = 'snap-b-' . bin2hex(random_bytes(4));
        $userB = new User();
        $userB->setUuid($userBUuid);
        $userB->setPassword($hasher->hashPassword($userB, 'pass'));
        $this->em->persist($userB);
        $this->em->flush();

        $tokenB = $this->getToken($userBUuid, 'pass');

        // Re-create client after getToken() which internally calls static::createClient()
        $client = static::createClient();

        // User B tries to access User A's contact snapshot
        $client->request('GET', "/api/contacts/{$contactId}/snapshot/{$logId}", [
            'auth_bearer' => $tokenB,
        ]);

        self::assertResponseStatusCodeSame(404);
    }

    public function testSnapshotUnauthenticated(): void
    {
        $client = static::createClient();

        $client->request('GET', '/api/contacts/1/snapshot/1');

        self::assertResponseStatusCodeSame(401);
    }

    public function testSnapshotWithOldUpdateLogs(): void
    {
        // Simulate old-format UPDATE logs by inserting directly into DB
        $client = static::createClient();
        $contactId = $this->createContact($client);
        $contactIri = "/api/contacts/{$contactId}";

        $response = $client->request('POST', '/api/contact_names', [
            'auth_bearer' => $this->token,
            'json' => ['given' => 'OldFormat', 'family' => 'Test', 'contact' => $contactIri],
        ]);
        self::assertResponseStatusCodeSame(201);
        $nameId = $response->toArray()['id'];

        // Get fresh EM from current container (client creation reboots kernel)
        /** @var \Doctrine\Bundle\DoctrineBundle\Registry $doctrine */
        $doctrine = static::getContainer()->get('doctrine');
        /** @var EntityManagerInterface $em */
        $em = $doctrine->getManager();

        $user = $em->getRepository(User::class)->findOneBy(['uuid' => $this->userUuid]);
        self::assertNotNull($user);

        $oldLog = new AuditLog();
        $oldLog->setEntityType('Ari\Entity\ContactName');
        $oldLog->setEntityId((string) $nameId);
        $oldLog->setOwnerEntityType(Contact::class);
        $oldLog->setOwnerEntityId((string) $contactId);
        $oldLog->setAction('UPDATE');
        $oldLog->setChanges(['given' => ['OldFormat', 'NewValue']]);
        $oldLog->setSnapshotAfter(null); // Old format: no snapshot
        $oldLog->setUser($user);
        $oldLog->setTenant($user);

        $em->persist($oldLog);
        $em->flush();

        $oldLogId = $oldLog->getId();
        self::assertNotNull($oldLogId);

        // Re-create client after EM operations
        $client = static::createClient();

        $response = $client->request('GET', "/api/contacts/{$contactId}/snapshot/{$oldLogId}", [
            'auth_bearer' => $this->token,
        ]);
        self::assertResponseIsSuccessful();
        $snapshot = $response->toArray()['snapshot'];

        self::assertCount(1, $snapshot['contactNames']);
        self::assertSame('NewValue', $snapshot['contactNames'][0]['given']);
        self::assertSame('Test', $snapshot['contactNames'][0]['family']);
    }

    public function testSnapshotWithSequentialUpdates(): void
    {
        $client = static::createClient();
        $contactId = $this->createContact($client);
        $contactIri = "/api/contacts/{$contactId}";

        $response = $client->request('POST', '/api/contact_names', [
            'auth_bearer' => $this->token,
            'json' => ['given' => 'V1', 'contact' => $contactIri],
        ]);
        self::assertResponseStatusCodeSame(201);
        $nameIri = $response->toArray()['@id'];
        $nameId = $response->toArray()['id'];

        $client->request('PATCH', $nameIri, [
            'auth_bearer' => $this->token,
            'headers' => ['Content-Type' => 'application/merge-patch+json'],
            'json' => ['given' => 'V2'],
        ]);
        self::assertResponseStatusCodeSame(200);

        $client->request('PATCH', $nameIri, [
            'auth_bearer' => $this->token,
            'headers' => ['Content-Type' => 'application/merge-patch+json'],
            'json' => ['given' => 'V3'],
        ]);
        self::assertResponseStatusCodeSame(200);

        $this->em->clear();

        // Find all UPDATE logs for this name and check intermediate snapshots
        $logs = $this->em->getRepository(AuditLog::class)->findBy(
            ['entityType' => 'Ari\Entity\ContactName', 'entityId' => (string) $nameId, 'action' => 'UPDATE'],
            ['id' => 'ASC'],
        );
        self::assertCount(2, $logs);

        // First UPDATE → V2
        $response = $client->request('GET', "/api/contacts/{$contactId}/snapshot/{$logs[0]->getId()}", [
            'auth_bearer' => $this->token,
        ]);
        self::assertResponseIsSuccessful();
        self::assertSame('V2', $response->toArray()['snapshot']['contactNames'][0]['given']);

        // Second UPDATE → V3
        $response = $client->request('GET', "/api/contacts/{$contactId}/snapshot/{$logs[1]->getId()}", [
            'auth_bearer' => $this->token,
        ]);
        self::assertResponseIsSuccessful();
        self::assertSame('V3', $response->toArray()['snapshot']['contactNames'][0]['given']);
    }

    public function testSnapshotAfterChildRemoveAndReAdd(): void
    {
        $client = static::createClient();
        $contactId = $this->createContact($client);
        $contactIri = "/api/contacts/{$contactId}";

        // Add phone
        $response = $client->request('POST', '/api/contact_phone_numbers', [
            'auth_bearer' => $this->token,
            'json' => ['value' => '111', 'contact' => $contactIri],
        ]);
        self::assertResponseStatusCodeSame(201);
        $phone1Iri = $response->toArray()['@id'];
        $phone1Id = $response->toArray()['id'];

        // Remove phone
        $client->request('DELETE', $phone1Iri, ['auth_bearer' => $this->token]);
        self::assertResponseStatusCodeSame(204);

        $logRemove = $this->findLogId('Ari\Entity\ContactPhoneNumber', (string) $phone1Id, 'REMOVE');

        // Add new phone
        $response = $client->request('POST', '/api/contact_phone_numbers', [
            'auth_bearer' => $this->token,
            'json' => ['value' => '222', 'contact' => $contactIri],
        ]);
        self::assertResponseStatusCodeSame(201);
        $phone2Id = $response->toArray()['id'];

        $logReAdd = $this->findLogId('Ari\Entity\ContactPhoneNumber', (string) $phone2Id, 'INSERT');

        // After removal: no phones
        $response = $client->request('GET', "/api/contacts/{$contactId}/snapshot/{$logRemove}", [
            'auth_bearer' => $this->token,
        ]);
        self::assertResponseIsSuccessful();
        self::assertSame([], $response->toArray()['snapshot']['contactPhoneNumbers']);

        // After re-add: new phone
        $response = $client->request('GET', "/api/contacts/{$contactId}/snapshot/{$logReAdd}", [
            'auth_bearer' => $this->token,
        ]);
        self::assertResponseIsSuccessful();
        /** @var list<array<string, mixed>> $phones */
        $phones = $response->toArray()['snapshot']['contactPhoneNumbers'];
        self::assertCount(1, $phones);
        self::assertSame('222', $phones[0]['value']);
    }

    public function testSnapshotWithMultipleChildrenSameType(): void
    {
        $client = static::createClient();
        $contactId = $this->createContact($client);
        $contactIri = "/api/contacts/{$contactId}";

        $client->request('POST', '/api/contact_names', [
            'auth_bearer' => $this->token,
            'json' => ['given' => 'Name1', 'contact' => $contactIri],
        ]);
        self::assertResponseStatusCodeSame(201);

        $response = $client->request('POST', '/api/contact_names', [
            'auth_bearer' => $this->token,
            'json' => ['given' => 'Name2', 'contact' => $contactIri],
        ]);
        self::assertResponseStatusCodeSame(201);
        $name2Iri = $response->toArray()['@id'];

        $client->request('POST', '/api/contact_names', [
            'auth_bearer' => $this->token,
            'json' => ['given' => 'Name3', 'contact' => $contactIri],
        ]);
        self::assertResponseStatusCodeSame(201);

        // Delete the second name
        $client->request('DELETE', $name2Iri, ['auth_bearer' => $this->token]);
        self::assertResponseStatusCodeSame(204);

        // Find the last log (name2 REMOVE)
        $this->em->clear();
        $lastLog = $this->em->getRepository(AuditLog::class)->findOneBy(
            ['ownerEntityId' => (string) $contactId, 'action' => 'REMOVE'],
            ['id' => 'DESC'],
        );
        self::assertNotNull($lastLog);
        $lastLogId = $lastLog->getId();
        self::assertNotNull($lastLogId);

        $response = $client->request('GET', "/api/contacts/{$contactId}/snapshot/{$lastLogId}", [
            'auth_bearer' => $this->token,
        ]);
        self::assertResponseIsSuccessful();
        /** @var list<array<string, mixed>> $names */
        $names = $response->toArray()['snapshot']['contactNames'];

        self::assertCount(2, $names);
        $givenNames = array_column($names, 'given');
        self::assertContains('Name1', $givenNames);
        self::assertContains('Name3', $givenNames);
        self::assertNotContains('Name2', $givenNames);
    }

    public function testSnapshotResponseShape(): void
    {
        $client = static::createClient();
        $contactId = $this->createContact($client);
        $logId = $this->findLogId(Contact::class, (string) $contactId, 'INSERT');

        $response = $client->request('GET', "/api/contacts/{$contactId}/snapshot/{$logId}", [
            'auth_bearer' => $this->token,
        ]);
        self::assertResponseIsSuccessful();
        $snapshot = $response->toArray()['snapshot'];

        // All collection keys must be present
        $expectedKeys = [
            'contact',
            'contactNames',
            'contactPhoneNumbers',
            'contactDates',
            'contactEmailAddresses',
            'contactAddresses',
            'contactOrganizations',
            'contactBiographies',
            'contactInteractions',
            'contactRelations',
        ];

        foreach ($expectedKeys as $key) {
            self::assertArrayHasKey($key, $snapshot, "Missing key: {$key}");
        }

        // Empty arrays for all collections when only contact exists
        foreach (array_slice($expectedKeys, 1) as $key) {
            self::assertIsArray($snapshot[$key], "{$key} should be an array");
        }
    }

    // ─── Helpers ─────────────────────────────────────────────────────

    private function getToken(string $username, string $password): string
    {
        $response = static::createClient()->request('POST', '/api/login_check', [
            'json' => [
                'username' => $username,
                'password' => $password,
            ],
        ]);

        return $response->toArray()['token'];
    }

    private function createContact(\ApiPlatform\Symfony\Bundle\Test\Client $client): int
    {
        $response = $client->request('POST', '/api/contacts', [
            'auth_bearer' => $this->token,
            'json' => [],
        ]);
        self::assertResponseStatusCodeSame(201);

        return $response->toArray()['id'];
    }

    private function findLogId(string $entityType, string $entityId, string $action): int
    {
        $this->em->clear();
        $log = $this->em->getRepository(AuditLog::class)->findOneBy(
            ['entityType' => $entityType, 'entityId' => $entityId, 'action' => $action],
            ['id' => 'DESC'],
        );
        self::assertNotNull($log, "AuditLog not found: {$entityType} #{$entityId} {$action}");
        $id = $log->getId();
        self::assertNotNull($id);

        return $id;
    }
}
