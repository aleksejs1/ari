<?php

namespace App\Tests\Functional;

use ApiPlatform\Symfony\Bundle\Test\ApiTestCase;
use App\Entity\NotificationChannel;
use App\Entity\NotificationSubscription;
use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;

class NotificationSubscriptionFilterTest extends ApiTestCase
{
    protected static ?bool $alwaysBootKernel = true;

    private string $token = '';
    private string $userUuid = '';

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
        $this->userUuid = 'filter-user-' . bin2hex(random_bytes(4));
        $user = new User();
        $user->setUuid($this->userUuid);
        $user->setPassword($hasher->hashPassword($user, 'pass'));
        $em->persist($user);

        // Create Channel
        $channel = new NotificationChannel();
        $channel->setType('email');
        $channel->setUser($user);
        $em->persist($channel);

        // Create Subscriptions
        $sub1 = new NotificationSubscription();
        $sub1->setUser($user);
        $sub1->setChannel($channel);
        $sub1->setEntityType('Contact');
        $sub1->setEntityId(1);
        $em->persist($sub1);

        $sub2 = new NotificationSubscription();
        $sub2->setUser($user);
        $sub2->setChannel($channel);
        $sub2->setEntityType('Contact');
        $sub2->setEntityId(2);
        $em->persist($sub2);

        $sub3 = new NotificationSubscription();
        $sub3->setUser($user);
        $sub3->setChannel($channel);
        $sub3->setEntityType('Other');
        $sub3->setEntityId(1);
        $em->persist($sub3);

        $em->flush();

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

    public function testFilterByEntityType(): void
    {
        $client = static::createClient();

        $response = $client->request('GET', '/api/notification_subscriptions?entityType=Contact', [
            'auth_bearer' => $this->token,
        ]);

        self::assertResponseIsSuccessful();
        $data = $response->toArray();
        self::assertCount(2, $data['member']);
        foreach ($data['member'] as $item) {
            self::assertSame('Contact', $item['entityType']);
        }
    }

    public function testFilterByEntityId(): void
    {
        $client = static::createClient();

        $response = $client->request('GET', '/api/notification_subscriptions?entityId=1', [
            'auth_bearer' => $this->token,
        ]);

        self::assertResponseIsSuccessful();
        $data = $response->toArray();
        self::assertCount(2, $data['member']); // Contact 1 and Other 1
        foreach ($data['member'] as $item) {
            self::assertSame(1, $item['entityId']);
        }
    }

    public function testFilterByEntityTypeAndEntityId(): void
    {
        $client = static::createClient();

        $response = $client->request('GET', '/api/notification_subscriptions?entityType=Contact&entityId=1', [
            'auth_bearer' => $this->token,
        ]);

        self::assertResponseIsSuccessful();
        $data = $response->toArray();
        self::assertCount(1, $data['member']);
        self::assertSame('Contact', $data['member'][0]['entityType']);
        self::assertSame(1, $data['member'][0]['entityId']);
    }

    public function testFilterNoResults(): void
    {
        $client = static::createClient();

        $response = $client->request('GET', '/api/notification_subscriptions?entityType=NonExistent', [
            'auth_bearer' => $this->token,
        ]);

        self::assertResponseIsSuccessful();
        $data = $response->toArray();
        self::assertCount(0, $data['member']);
    }
}
