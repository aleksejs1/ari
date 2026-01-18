<?php

namespace App\Tests\Functional;

use App\Entity\AuditLog;
use App\Entity\Contact;
use App\Entity\NotificationChannel;
use App\Entity\NotificationQueue;
use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;

class StatsApiTest extends AbstractApiTestCase
{
    public function testGetStats(): void
    {
        $client = static::createClient();
        $container = self::getContainer();
        /** @var EntityManagerInterface $em */
        $em = $container->get('doctrine')->getManager();

        // 1. Initial counts should be 0 (except maybe audit log for user creation)
        $response = $client->request('GET', '/api/stats', [
            'auth_bearer' => $this->token,
        ]);
        self::assertResponseIsSuccessful();
        $data = $response->toArray();

        $initialAuditLogs = $data['totalAuditLogs'];
        self::assertEquals(0, $data['totalContacts']);
        self::assertEquals(0, $data['totalSentNotifications']);

        // 2. Create some data
        $user = $em->getRepository(User::class)->findOneBy(['uuid' => $this->userUuid]);

        // Create 2 contacts
        for ($i = 0; $i < 2; ++$i) {
            $contact = new Contact();
            $contact->setUser($user);
            $em->persist($contact);
        }

        // Create 1 audit log (manually, though usually it's automatic)
        $auditLog = new AuditLog();
        $auditLog->setUser($user);
        $auditLog->setTenant($user);
        $auditLog->setEntityType(Contact::class);
        $auditLog->setEntityId('1');
        $auditLog->setAction('create');
        $em->persist($auditLog);

        // Create notification queue items
        $channel = new NotificationChannel();
        $channel->setType('web');
        $channel->setUser($user);
        $em->persist($channel);

        $sentNotification = new NotificationQueue();
        $c1 = new Contact();
        $c1->setUser($user);
        $em->persist($c1);
        $sentNotification->setContact($c1);
        $sentNotification->setChannel($channel);
        $sentNotification->setStatus('sent');
        $sentNotification->setScheduledAt(new \DateTimeImmutable());
        $sentNotification->setPayload([]);
        $sentNotification->setAttempts(1);
        $sentNotification->setTenant($user);
        $em->persist($sentNotification);

        $pendingNotification = new NotificationQueue();
        $c2 = new Contact();
        $c2->setUser($user);
        $em->persist($c2);
        $pendingNotification->setContact($c2);
        $pendingNotification->setChannel($channel);
        $pendingNotification->setStatus('pending');
        $pendingNotification->setScheduledAt(new \DateTimeImmutable());
        $pendingNotification->setPayload([]);
        $pendingNotification->setAttempts(0);
        $pendingNotification->setTenant($user);
        $em->persist($pendingNotification);

        $em->flush();

        // 3. Verify counts
        $response = $client->request('GET', '/api/stats', [
            'auth_bearer' => $this->token,
        ]);
        self::assertResponseIsSuccessful();
        $data = $response->toArray();

        self::assertEquals(4, $data['totalContacts']); // 2 + 2 created for notifications
        // 4 contacts, 1 channel, 2 queue items are automatically logged. 1 manual log.
        self::assertEquals($initialAuditLogs + 4 + 1 + 2 + 1, $data['totalAuditLogs']);
        self::assertEquals(1, $data['totalSentNotifications']);
    }

    public function testStatsIsolation(): void
    {
        $client = static::createClient();
        $container = self::getContainer();
        /** @var EntityManagerInterface $em */
        $em = $container->get('doctrine')->getManager();

        $user = $em->getRepository(User::class)->findOneBy(['uuid' => $this->userUuid]);

        // Create data for User A
        $contact = new Contact();
        $contact->setUser($user);
        $em->persist($contact);
        $em->flush();

        // Create User B
        $userBUuid = 'user-b-' . bin2hex(random_bytes(4));
        $userB = new User();
        $userB->setUuid($userBUuid);
        $userB->setPassword('pass'); // AbstractApiTestCase hashPassword logic... actually I can just use a plain password if I don't use the hasher

        // Better use the same logic as AbstractApiTestCase for User B
        /** @var \Symfony\Component\DependencyInjection\Container $testContainer */
        $testContainer = $container->get('test.service_container');
        /** @var \Symfony\Component\PasswordHasher\Hasher\UserPasswordHasher $hasher */
        $hasher = $testContainer->get('security.user_password_hasher');
        $userB->setPassword($hasher->hashPassword($userB, 'pass'));
        $em->persist($userB);
        $em->flush();

        $tokenB = $this->getToken($userBUuid, 'pass');

        // User B should see 0 contacts
        $response = $client->request('GET', '/api/stats', [
            'auth_bearer' => $tokenB,
        ]);
        self::assertResponseIsSuccessful();
        $data = $response->toArray();
        self::assertEquals(0, $data['totalContacts']);

        // User A should see 1 contact
        $response = $client->request('GET', '/api/stats', [
            'auth_bearer' => $this->token,
        ]);
        self::assertResponseIsSuccessful();
        $data = $response->toArray();
        self::assertEquals(1, $data['totalContacts']);
    }
}
