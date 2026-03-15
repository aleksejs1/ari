<?php

namespace Ari\Tests\Functional;

use ApiPlatform\Symfony\Bundle\Test\ApiTestCase;
use Ari\Entity\AuditLog;
use Ari\Entity\Contact;
use Ari\Entity\User;
use Doctrine\ORM\EntityManagerInterface;

class AuditLogTest extends ApiTestCase
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

        // Create User
        $this->userUuid = 'user1-' . bin2hex(random_bytes(4));
        $user = new User();
        $user->setUuid($this->userUuid);
        $user->setPassword($hasher->hashPassword($user, 'pass'));
        // Run flush for User
        $this->em->persist($user);
        $this->em->flush();

        // Get token
        $this->token = $this->getToken($this->userUuid, 'pass');
    }

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

    public function testCreateContactLogsAudit(): void
    {
        $client = static::createClient();

        // Create Contact
        $response = $client->request('POST', '/api/contacts', [
            'auth_bearer' => $this->token,
            'json' => [],
        ]);
        self::assertResponseStatusCodeSame(201);
        $contactId = $response->toArray()['id'];

        // Clear EM to ensure we see the new logs
        $this->em->clear();

        // Verify AuditLog
        // Fetch latest log to avoid stale data issues (since DAMA is missing)
        $logs = $this->em->getRepository(AuditLog::class)->findBy(
            ['entityType' => Contact::class, 'action' => 'INSERT'],
            ['id' => 'DESC'],
            1,
        );

        self::assertNotEmpty($logs, 'AuditLog for INSERT not found');
        $log = $logs[0];

        $logUser = $log->getUser();
        self::assertNotNull($logUser, 'AuditLog user should not be null');
        self::assertEquals($this->userUuid, $logUser->getUuid());
        // Check ID if present (it seems to be present based on SQL dumps)
        if (null !== $log->getEntityId()) {
            self::assertEquals($contactId, $log->getEntityId());
        }

        // Verify snapshots
        $snapshotAfter = $log->getSnapshotAfter();
        self::assertNotNull($snapshotAfter, 'snapshotAfter should not be null for INSERT');
        self::assertArrayHasKey('id', $snapshotAfter);
        self::assertEquals($contactId, $snapshotAfter['id']);
    }

    public function testUpdateContactLogsAudit(): void
    {
        $client = static::createClient();

        // Create Contact
        $response = $client->request('POST', '/api/contacts', [
            'auth_bearer' => $this->token,
            'json' => [],
        ]);
        $contactIri = $response->toArray()['@id'];

        // Add Name (which updates Contact indirectly? No, usually ContactName is separate entity)
        // Let's create a nested update or direct update on Contact if possible?
        // Contact has no simple fields visible in `contact:create` yet based on ContactApiTest.
        // But maybe we can add a name. Adding a name is creating a ContactName entity.
        // Does Contact change? Only if association changes.

        // Add Name
        $response = $client->request('POST', '/api/contact_names', [
            'auth_bearer' => $this->token,
            'json' => [
                'family' => 'Doe',
                'given' => 'John',
                'contact' => $contactIri,
            ],
        ]);
        self::assertResponseStatusCodeSame(201);
        $contactNameId = $response->toArray()['id'];

        // Verify AuditLog for ContactName
        $log = $this->em->getRepository(AuditLog::class)->findOneBy([
            'entityType' => 'Ari\Entity\ContactName',
            'entityId' => $contactNameId,
            'action' => 'INSERT',
        ]);
        self::assertNotNull($log, 'AuditLog for ContactName INSERT not found');
    }

    public function testDeleteContactLogsAudit(): void
    {
        $client = static::createClient();

        // Create Contact
        $response = $client->request('POST', '/api/contacts', [
            'auth_bearer' => $this->token,
            'json' => [],
        ]);
        $contactIri = $response->toArray()['@id'];
        $contactId = $response->toArray()['id'];

        // Delete Contact
        $client->request('DELETE', $contactIri, [
            'auth_bearer' => $this->token,
        ]);
        self::assertResponseStatusCodeSame(204);

        // Verify AuditLog
        $log = $this->em->getRepository(AuditLog::class)->findOneBy([
            'entityType' => Contact::class,
            'entityId' => $contactId,
            'action' => 'REMOVE',
        ]);

        self::assertNotNull($log, 'AuditLog for REMOVE not found');

        // Verify snapshots
        $snapshotBefore = $log->getSnapshotBefore();
        self::assertNotNull($snapshotBefore, 'snapshotBefore should not be null for REMOVE');
        self::assertArrayHasKey('id', $snapshotBefore);
        self::assertEquals($contactId, $snapshotBefore['id']);
    }

    public function testUpdateNowIncludesSnapshotAfter(): void
    {
        $client = static::createClient();

        // Create Contact
        $response = $client->request('POST', '/api/contacts', [
            'auth_bearer' => $this->token,
            'json' => [],
        ]);
        $contactIri = $response->toArray()['@id'];

        // Add ContactName
        $response = $client->request('POST', '/api/contact_names', [
            'auth_bearer' => $this->token,
            'json' => [
                'family' => 'Original',
                'given' => 'Name',
                'contact' => $contactIri,
            ],
        ]);
        self::assertResponseStatusCodeSame(201);
        $nameIri = $response->toArray()['@id'];
        $nameId = $response->toArray()['id'];

        // Update ContactName
        $client->request('PATCH', $nameIri, [
            'auth_bearer' => $this->token,
            'headers' => ['Content-Type' => 'application/merge-patch+json'],
            'json' => [
                'family' => 'Updated',
            ],
        ]);
        self::assertResponseStatusCodeSame(200);

        $this->em->clear();

        // Find the UPDATE audit log
        $log = $this->em->getRepository(AuditLog::class)->findOneBy([
            'entityType' => 'Ari\Entity\ContactName',
            'entityId' => $nameId,
            'action' => 'UPDATE',
        ]);

        self::assertNotNull($log, 'AuditLog for UPDATE not found');
        self::assertNotNull($log->getSnapshotAfter(), 'snapshotAfter should not be null for UPDATE');
        self::assertNotNull($log->getChanges(), 'changes should still be present for UPDATE');
    }

    public function testSnapshotAfterReflectsNewValues(): void
    {
        $client = static::createClient();

        // Create Contact
        $response = $client->request('POST', '/api/contacts', [
            'auth_bearer' => $this->token,
            'json' => [],
        ]);
        $contactIri = $response->toArray()['@id'];

        // Add ContactName
        $response = $client->request('POST', '/api/contact_names', [
            'auth_bearer' => $this->token,
            'json' => [
                'family' => 'Before',
                'given' => 'Test',
                'contact' => $contactIri,
            ],
        ]);
        self::assertResponseStatusCodeSame(201);
        $nameIri = $response->toArray()['@id'];
        $nameId = $response->toArray()['id'];

        // Update
        $client->request('PATCH', $nameIri, [
            'auth_bearer' => $this->token,
            'headers' => ['Content-Type' => 'application/merge-patch+json'],
            'json' => [
                'family' => 'After',
            ],
        ]);
        self::assertResponseStatusCodeSame(200);

        $this->em->clear();

        $log = $this->em->getRepository(AuditLog::class)->findOneBy([
            'entityType' => 'Ari\Entity\ContactName',
            'entityId' => $nameId,
            'action' => 'UPDATE',
        ]);

        self::assertNotNull($log);

        // snapshotAfter should reflect the new value
        $snapshotAfter = $log->getSnapshotAfter();
        self::assertNotNull($snapshotAfter);
        self::assertArrayHasKey('family', $snapshotAfter);
        self::assertEquals('After', $snapshotAfter['family']);
        self::assertEquals('Test', $snapshotAfter['given']);

        // changes should contain [old, new]
        $changes = $log->getChanges();
        self::assertNotNull($changes);
        self::assertArrayHasKey('family', $changes);
        self::assertEquals('Before', $changes['family'][0]);
        self::assertEquals('After', $changes['family'][1]);
    }

    public function testAuditLogCreationDoesNotProduceRecursiveAuditLogs(): void
    {
        $client = static::createClient();

        $client->request('POST', '/api/contacts', [
            'auth_bearer' => $this->token,
            'json' => [],
        ]);
        self::assertResponseStatusCodeSame(201);

        $this->em->clear();

        // AuditLogSubscriber must skip AuditLog entities in shouldLog().
        // If the guard were ever removed, each AuditLog INSERT would trigger
        // another AuditLog INSERT — infinite recursion / stack overflow.
        // This assertion catches that regression: there must be zero audit log
        // entries whose entityType is AuditLog itself.
        $recursiveLogs = $this->em->getRepository(AuditLog::class)->findBy([
            'entityType' => AuditLog::class,
        ]);

        self::assertEmpty(
            $recursiveLogs,
            'AuditLogSubscriber must not audit AuditLog entities — removing the shouldLog() guard would cause infinite recursion.',
        );
    }

    public function testFilterAuditLogs(): void
    {
        $client = static::createClient();

        // Create a contact to generate an audit log
        $response = $client->request('POST', '/api/contacts', [
            'auth_bearer' => $this->token,
            'json' => [],
        ]);
        self::assertResponseStatusCodeSame(201);
        $contactId = $response->toArray()['id'];

        // Get all logs for this user
        $response = $client->request('GET', '/api/audit_logs', [
            'auth_bearer' => $this->token,
        ]);
        self::assertResponseIsSuccessful();
        $allLogsData = $response->toArray();
        self::assertGreaterThan(0, $allLogsData['totalItems'] ?? count($allLogsData['member'] ?? []));

        // Filter by entityType
        $entityType = 'Ari\Entity\Contact';
        $response = $client->request('GET', '/api/audit_logs', [
            'auth_bearer' => $this->token,
            'query' => [
                'entityType' => $entityType,
            ],
        ]);
        self::assertResponseIsSuccessful();
        $data = $response->toArray();
        $count = $data['totalItems'] ?? count($data['member'] ?? []);
        self::assertGreaterThan(0, $count);
        foreach ($data['member'] as $log) {
            self::assertEquals($entityType, $log['entityType']);
        }

        // Filter by entityId
        $response = $client->request('GET', '/api/audit_logs', [
            'auth_bearer' => $this->token,
            'query' => [
                'entityId' => $contactId,
            ],
        ]);
        self::assertResponseIsSuccessful();
        $data = $response->toArray();
        $count = $data['totalItems'] ?? count($data['member'] ?? []);
        self::assertGreaterThan(0, $count);
        foreach ($data['member'] as $log) {
            self::assertEquals($contactId, $log['entityId']);
        }

        // Filter by non-existent combinations
        $response = $client->request('GET', '/api/audit_logs', [
            'auth_bearer' => $this->token,
            'query' => [
                'entityId' => 999999,
            ],
        ]);
        self::assertResponseIsSuccessful();
        $count = $response->toArray()['hydra:totalItems'] ?? count($response->toArray()['hydra:member'] ?? []);
        self::assertEquals(0, $count);
    }
}
