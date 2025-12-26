<?php

namespace App\Tests\Functional;

use ApiPlatform\Symfony\Bundle\Test\ApiTestCase;
use App\Entity\NotificationChannel;
use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;

class NotificationSubscriptionApiTest extends ApiTestCase
{
    protected static ?bool $alwaysBootKernel = true;

    private string $token = '';
    private string $otherToken = '';
    private string $userUuid = '';
    private string $otherUserUuid = '';
    private string $channelIri = '';

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

        // Create User 1
        $this->userUuid = 'user1-' . bin2hex(random_bytes(4));
        $user1 = new User();
        $user1->setUuid($this->userUuid);
        $user1->setPassword($hasher->hashPassword($user1, 'pass'));
        $em->persist($user1);

        // Create User 2
        $this->otherUserUuid = 'user2-' . bin2hex(random_bytes(4));
        $user2 = new User();
        $user2->setUuid($this->otherUserUuid);
        $user2->setPassword($hasher->hashPassword($user2, 'pass'));
        $em->persist($user2);

        // Create Channel for User 1
        $channel = new NotificationChannel();
        $channel->setType('email');
        $channel->setUser($user1);
        $em->persist($channel);

        $em->flush();

        // Get tokens
        $this->token = $this->getToken($this->userUuid, 'pass');
        $this->otherToken = $this->getToken($this->otherUserUuid, 'pass');

        $this->channelIri = '/api/notification_channels/' . (string) $channel->getId();
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

    public function testNotificationSubscriptionCRUD(): void
    {
        $client = static::createClient();

        // 1. Create Subscription
        $response = $client->request('POST', '/api/notification_subscriptions', [
            'auth_bearer' => $this->token,
            'json' => [
                'channel' => $this->channelIri,
                'entityType' => 'Contact',
                'entityId' => 123,
                'enabled' => 1,
            ],
        ]);

        self::assertResponseStatusCodeSame(201);
        $subIri = $response->toArray()['@id'];

        // 2. GET Item
        $client->request('GET', $subIri, [
            'auth_bearer' => $this->token,
        ]);
        self::assertResponseIsSuccessful();
        self::assertJsonContains([
            'entityType' => 'Contact',
            'entityId' => 123,
            'enabled' => 1,
        ]);

        // 3. PUT (Update fully)
        $client->request('PUT', $subIri, [
            'auth_bearer' => $this->token,
            'json' => [
                'channel' => $this->channelIri,
                'entityType' => 'Contact',
                'entityId' => 456,
                'enabled' => 0,
            ],
        ]);
        self::assertResponseIsSuccessful();
        self::assertJsonContains([
            'entityId' => 456,
            'enabled' => 0,
        ]);

        // 4. Security/Isolation: Other user cannot see this item
        /** @var \Doctrine\Persistence\ManagerRegistry $doctrine */
        $doctrine = static::getContainer()->get('doctrine');
        /** @var EntityManagerInterface $em */
        $em = $doctrine->getManager();
        $em->clear();
        $client->request('GET', $subIri, [
            'auth_bearer' => $this->otherToken,
        ]);
        self::assertResponseStatusCodeSame(404);

        // 5. DELETE
        $client->request('DELETE', $subIri, [
            'auth_bearer' => $this->token,
        ]);
        self::assertResponseStatusCodeSame(204);
    }
}
