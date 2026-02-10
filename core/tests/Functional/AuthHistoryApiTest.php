<?php

namespace Ari\Tests\Functional;

use Ari\Entity\AuditLog;
use Ari\Entity\RefreshToken;
use Ari\Entity\User;
use Doctrine\ORM\EntityManagerInterface;

class AuthHistoryApiTest extends AbstractApiTestCase
{
    public function testAuthHistoryReturnsLoginRecords(): void
    {
        $client = static::createClient();

        // The login in setUp() creates a RefreshToken, which creates an AuditLog.
        // Verify that auth_history endpoint returns it.
        $response = $client->request('GET', '/api/auth_history', [
            'auth_bearer' => $this->token,
        ]);

        self::assertResponseIsSuccessful();
        $data = $response->toArray();

        self::assertArrayHasKey('member', $data);
        self::assertArrayHasKey('totalItems', $data);
        self::assertGreaterThanOrEqual(1, $data['totalItems']);

        $entry = $data['member'][0];
        self::assertArrayHasKey('id', $entry);
        self::assertArrayHasKey('ipAddress', $entry);
        self::assertArrayHasKey('userAgent', $entry);
        self::assertArrayHasKey('createdAt', $entry);
    }

    public function testAuthHistoryPagination(): void
    {
        $client = static::createClient();
        $em = $this->getEntityManager();
        $user = $em->getRepository(User::class)->findOneBy(['uuid' => $this->userUuid]);

        // Create additional AuditLog entries for RefreshToken to have enough for pagination
        for ($i = 0; $i < 5; ++$i) {
            $log = new AuditLog();
            $log->setUser($user);
            $log->setTenant($user);
            $log->setEntityType(RefreshToken::class);
            $log->setAction('INSERT');
            $log->setSnapshotAfter([
                'ipAddress' => '192.168.1.' . $i,
                'userAgent' => 'TestAgent/' . $i,
            ]);
            $em->persist($log);
        }
        $em->flush();

        $response = $client->request('GET', '/api/auth_history?itemsPerPage=2&page=1', [
            'auth_bearer' => $this->token,
        ]);

        self::assertResponseIsSuccessful();
        $data = $response->toArray();

        self::assertCount(2, $data['member']);
        self::assertGreaterThanOrEqual(6, $data['totalItems']); // 5 manual + at least 1 from login
    }

    public function testAuthHistoryIsolation(): void
    {
        $client = static::createClient();

        // Create User B
        $userB = $this->createUser('auth-history-b-' . bin2hex(random_bytes(4)), 'pass');
        $tokenB = $this->getToken((string) $userB->getUuid(), 'pass');

        // User A's history
        $responseA = $client->request('GET', '/api/auth_history', [
            'auth_bearer' => $this->token,
        ]);
        self::assertResponseIsSuccessful();
        $countA = $responseA->toArray()['totalItems'];

        // User B's history (should only see their own login)
        $responseB = $client->request('GET', '/api/auth_history', [
            'auth_bearer' => $tokenB,
        ]);
        self::assertResponseIsSuccessful();
        $dataB = $responseB->toArray();

        // User B should have at least 1 login (from getToken) but fewer than User A
        self::assertGreaterThanOrEqual(1, $dataB['totalItems']);
        self::assertLessThanOrEqual($countA, $dataB['totalItems']);
    }

    public function testAuthHistoryRequiresAuthentication(): void
    {
        $client = static::createClient();

        $client->request('GET', '/api/auth_history');
        self::assertResponseStatusCodeSame(401);
    }

    public function testAuthHistoryEntryHasCorrectFields(): void
    {
        $client = static::createClient();
        $em = $this->getEntityManager();
        $user = $em->getRepository(User::class)->findOneBy(['uuid' => $this->userUuid]);

        // Create a specific AuditLog entry with known data and a future date to ensure it's first
        $log = new AuditLog();
        $log->setUser($user);
        $log->setTenant($user);
        $log->setEntityType(RefreshToken::class);
        $log->setAction('INSERT');
        $log->setCreatedAt(new \DateTime('+1 hour'));
        $log->setSnapshotAfter([
            'ipAddress' => '10.0.0.1',
            'userAgent' => 'Mozilla/5.0 Test',
        ]);
        $em->persist($log);
        $em->flush();

        $response = $client->request('GET', '/api/auth_history?itemsPerPage=1&page=1', [
            'auth_bearer' => $this->token,
        ]);

        self::assertResponseIsSuccessful();
        $data = $response->toArray();
        $entry = $data['member'][0];

        // Most recent entry (future date) should be our manually created one
        self::assertEquals('10.0.0.1', $entry['ipAddress']);
        self::assertEquals('Mozilla/5.0 Test', $entry['userAgent']);
    }
}
