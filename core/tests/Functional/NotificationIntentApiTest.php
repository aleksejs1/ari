<?php

namespace App\Tests\Functional;

use ApiPlatform\Symfony\Bundle\Test\ApiTestCase;
use App\Entity\NotificationChannel;
use App\Entity\NotificationIntent;
use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;

class NotificationIntentApiTest extends ApiTestCase
{
    protected static ?bool $alwaysBootKernel = true;

    private string $token = '';
    private string $otherToken = '';
    private string $userUuid = '';
    private string $otherUserUuid = '';
    private string $intentIri = '';

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

        // Create Channel and Intent for User 1
        $channel = new NotificationChannel();
        $channel->setType('email');
        $channel->setUser($user1);
        $em->persist($channel);

        $intent = new NotificationIntent();
        $intent->setChannel($channel);
        $intent->setPayload(['msg' => 'hello']);
        $intent->setTenant($user1);
        $em->persist($intent);

        $em->flush();

        // Get tokens
        $this->token = $this->getToken($this->userUuid, 'pass');
        $this->otherToken = $this->getToken($this->otherUserUuid, 'pass');

        $this->intentIri = '/api/notification_intents/' . (string) $intent->getId();
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

    public function testNotificationIntentReadOnly(): void
    {
        $client = static::createClient();

        // 1. GET Item (User 1)
        $client->request('GET', $this->intentIri, [
            'auth_bearer' => $this->token,
        ]);
        self::assertResponseIsSuccessful();
        self::assertJsonContains([
            'payload' => ['msg' => 'hello'],
        ]);

        // 2. Security/Isolation: Other user cannot see this item
        /** @var \Doctrine\Persistence\ManagerRegistry $doctrine */
        $doctrine = static::getContainer()->get('doctrine');
        /** @var EntityManagerInterface $em */
        $em = $doctrine->getManager();
        $em->clear();
        $client->request('GET', $this->intentIri, [
            'auth_bearer' => $this->otherToken,
        ]);
        self::assertResponseStatusCodeSame(404);

        // 3. POST (Not Allowed)
        $client->request('POST', '/api/notification_intents', [
            'auth_bearer' => $this->token,
            'json' => ['payload' => ['x' => 'y']],
        ]);
        self::assertResponseStatusCodeSame(405);

        // 4. PUT (Not Allowed)
        $client->request('PUT', $this->intentIri, [
            'auth_bearer' => $this->token,
            'json' => ['payload' => ['x' => 'y']],
        ]);
        self::assertResponseStatusCodeSame(405);

        // 5. DELETE (Not Allowed)
        $client->request('DELETE', $this->intentIri, [
            'auth_bearer' => $this->token,
        ]);
        self::assertResponseStatusCodeSame(405);
    }
}
