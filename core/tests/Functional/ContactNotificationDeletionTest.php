<?php

namespace App\Tests\Functional;

use ApiPlatform\Symfony\Bundle\Test\ApiTestCase;
use App\Entity\Contact;
use App\Entity\NotificationChannel;
use App\Entity\NotificationQueue;
use App\Entity\NotificationRule;
use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;

class ContactNotificationDeletionTest extends ApiTestCase
{
    protected static ?bool $alwaysBootKernel = true;

    private string $token;
    private string $userUuid;

    #[\Override]
    protected function setUp(): void
    {
        $container = self::getContainer();
        /** @var \Doctrine\Persistence\ManagerRegistry $doctrine */
        $doctrine = $container->get('doctrine');
        /** @var EntityManagerInterface $em */
        $em = $doctrine->getManager();

        /** @var \Symfony\Component\DependencyInjection\Container $testContainer */
        $testContainer = $container->get('test.service_container');
        /** @var \Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface $hasher */
        $hasher = $testContainer->get('security.user_password_hasher');

        // Create User
        $this->userUuid = 'user-' . bin2hex(random_bytes(4));
        $user = new User();
        $user->setUuid($this->userUuid);
        $user->setPassword($hasher->hashPassword($user, 'pass'));
        $em->persist($user);

        $em->flush();

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

    public function testDeleteContactWithNotificationQueue(): void
    {
        $client = static::createClient();
        $container = self::getContainer();
        /** @var \Doctrine\Persistence\ManagerRegistry $doctrine */
        $doctrine = $container->get('doctrine');
        $em = $doctrine->getManager();

        // 1. Create Contact via API
        $response = $client->request('POST', '/api/contacts', [
            'auth_bearer' => $this->token,
            'json' => [],
        ]);
        self::assertResponseStatusCodeSame(201);
        $contactIri = $response->toArray()['@id'];

        // Fetch the Contact entity to use in NotificationQueue
        $contactId = $response->toArray()['id'];
        $contact = $em->getRepository(Contact::class)->find($contactId);

        $user = $em->getRepository(User::class)->findOneBy(['uuid' => $this->userUuid]);

        // 2. Create helper entities for NotificationQueue (Policy, Rule, Channel)
        $policy = new \App\Entity\NotificationPolicy();
        $policy->setName('Test Policy');
        $policy->setIsActive(true);
        $policy->setUser($user); // Set owner/tenant
        $em->persist($policy);

        $rule = new NotificationRule();
        $rule->setPolicy($policy);
        $rule->setOffsetDays(0);
        $rule->setTenant($user);
        $em->persist($rule);

        $channel = new NotificationChannel();
        $channel->setType('email');
        $channel->setConfig(['email' => 'test@example.com']);
        $channel->setUser($user);
        $em->persist($channel);

        // 3. Create NotificationQueue entry manually
        $queueItem = new NotificationQueue();
        $queueItem->setContact($contact);
        $queueItem->setRule($rule);
        $queueItem->setChannel($channel);
        $queueItem->setStatus('pending');
        $queueItem->setScheduledAt(new \DateTimeImmutable());
        $queueItem->setAttempts(0);
        $queueItem->setTenant($user);
        $em->persist($queueItem);
        $em->flush();

        $queueId = $queueItem->getId();
        self::assertNotNull($queueId);

        // Clear Identity Map to ensure we fetch fresh data later
        $em->clear();

        // 4. Delete Contact via API
        $client->request('DELETE', $contactIri, [
            'auth_bearer' => $this->token,
        ]);
        self::assertResponseStatusCodeSame(204);

        // 5. Verify NotificationQueue entry is gone
        $deletedQueueItem = $em->getRepository(NotificationQueue::class)->find($queueId);
        self::assertNull($deletedQueueItem, 'NotificationQueue item should have been deleted via cascade.');
    }
}
