<?php

namespace App\Tests\Functional;

use ApiPlatform\Symfony\Bundle\Test\ApiTestCase;
use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;

class NotificationChannelApiTest extends ApiTestCase
{
    protected static ?bool $alwaysBootKernel = true;

    private string $token = '';
    private string $otherToken = '';
    private string $userUuid = '';
    private string $otherUserUuid = '';

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

        $em->flush();

        // Get tokens
        $this->token = $this->getToken($this->userUuid, 'pass');
        $this->otherToken = $this->getToken($this->otherUserUuid, 'pass');
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

    public function testNotificationChannelCRUD(): void
    {
        $client = static::createClient();

        // 1. Create Channel
        $response = $client->request('POST', '/api/notification_channels', [
            'auth_bearer' => $this->token,
            'json' => [
                'type' => 'email',
                'config' => ['address' => 'test@example.com'],
            ],
        ]);

        self::assertResponseStatusCodeSame(201);
        $channelIri = $response->toArray()['@id'];

        // 2. GET Item
        $client->request('GET', $channelIri, [
            'auth_bearer' => $this->token,
        ]);
        self::assertResponseIsSuccessful();
        self::assertJsonContains([
            'type' => 'email',
            'config' => ['address' => 'test@example.com'],
        ]);

        // 3. PUT (Update fully)
        $client->request('PUT', $channelIri, [
            'auth_bearer' => $this->token,
            'json' => [
                'type' => 'sms',
                'config' => ['phone' => '+123456789'],
            ],
        ]);
        self::assertResponseIsSuccessful();
        self::assertJsonContains([
            'type' => 'sms',
            'config' => ['phone' => '+123456789'],
        ]);

        // 4. PATCH (Partial update)
        $client->request('PATCH', $channelIri, [
            'auth_bearer' => $this->token,
            'headers' => ['Content-Type' => 'application/merge-patch+json'],
            'json' => [
                'config' => ['phone' => '+987654321'],
            ],
        ]);
        self::assertResponseIsSuccessful();
        self::assertJsonContains([
            'config' => ['phone' => '+987654321'],
        ]);

        // 5. GET Collection (Only own items)
        $response = $client->request('GET', '/api/notification_channels', [
            'auth_bearer' => $this->token,
        ]);
        self::assertResponseIsSuccessful();
        self::assertCount(1, $response->toArray()['member']);

        // 6. Security/Isolation: Other user cannot see this item
        /** @var \Doctrine\Persistence\ManagerRegistry $doctrine */
        $doctrine = static::getContainer()->get('doctrine');
        /** @var EntityManagerInterface $em */
        $em = $doctrine->getManager();
        $em->clear();

        $client->request('GET', $channelIri, [
            'auth_bearer' => $this->otherToken,
        ]);
        self::assertResponseStatusCodeSame(404);

        // 7. DELETE
        $client->request('DELETE', $channelIri, [
            'auth_bearer' => $this->token,
        ]);
        self::assertResponseStatusCodeSame(204);
    }
}
