<?php

namespace App\Tests\Functional;

use ApiPlatform\Symfony\Bundle\Test\ApiTestCase;
use App\Entity\NotificationChannel;
use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;

class TelegramWebhookTest extends ApiTestCase
{
    protected static ?bool $alwaysBootKernel = true;

    public function testHandleWebhook(): void
    {
        $client = static::createClient();
        $container = self::getContainer();
        /** @var EntityManagerInterface $em */
        $em = $container->get('doctrine')->getManager();
        if ($em->getFilters()->isEnabled('tenant')) {
            $em->getFilters()->disable('tenant');
        }

        // 1. Create a User
        $user = new User();
        $user->setUuid('test-user-' . bin2hex(random_bytes(4)));
        $user->setPassword('pass'); // In tests we might not need hashing depending on setup
        $em->persist($user);
        $em->flush();

        // 2. Create a Telegram NotificationChannel
        $channel = new NotificationChannel();
        $channel->setUser($user);
        $channel->setType('telegram');
        $channel->setConfig(['botToken' => 'some_token']);
        $em->persist($channel);
        $em->flush();

        $userId = $user->getId();
        $channelId = $channel->getId();

        // 3. Send Webhook Request
        $payload = [
            'message' => [
                'text' => sprintf('/start %d_%d', (int) $userId, (int) $channelId),
                'chat' => [
                    'id' => '123456789',
                ],
            ],
        ];

        $client->request('POST', '/api/webhook/telegram', [
            'json' => $payload,
        ]);

        self::assertResponseIsSuccessful();

        // 4. Verify Database
        $em->clear();
        if ($em->getFilters()->isEnabled('tenant')) {
            $em->getFilters()->disable('tenant');
        }
        $updatedChannel = $em->find(NotificationChannel::class, $channelId);
        self::assertInstanceOf(NotificationChannel::class, $updatedChannel);
        $config = $updatedChannel->getConfig();
        self::assertEquals('123456789', $config['chatId'] ?? null);
        self::assertEquals('some_token', $config['botToken'] ?? null);
    }

    public function testHandleWebhookUserMismatch(): void
    {
        $client = static::createClient();
        $container = self::getContainer();
        /** @var EntityManagerInterface $em */
        $em = $container->get('doctrine')->getManager();
        if ($em->getFilters()->isEnabled('tenant')) {
            $em->getFilters()->disable('tenant');
        }

        // Create User 1
        $user1 = new User();
        $user1->setUuid('u1-' . bin2hex(random_bytes(4)));
        $user1->setPassword('p');
        $em->persist($user1);

        // Create User 2
        $user2 = new User();
        $user2->setUuid('u2-' . bin2hex(random_bytes(4)));
        $user2->setPassword('p');
        $em->persist($user2);

        // Create Channel for User 1
        $channel = new NotificationChannel();
        $channel->setUser($user1);
        $channel->setType('telegram');
        $channel->setConfig(['botToken' => 'token']);
        $em->persist($channel);
        $em->flush();

        $wrongUserId = $user2->getId();
        $channelId = $channel->getId();

        // Send Webhook with correct channel but wrong user ID
        $payload = [
            'message' => [
                'text' => sprintf('/start %d_%d', (int) $wrongUserId, (int) $channelId),
                'chat' => [
                    'id' => '999',
                ],
            ],
        ];

        $client->request('POST', '/api/webhook/telegram', [
            'json' => $payload,
        ]);

        self::assertResponseIsSuccessful(); // Controller always returns OK

        // Verify config NOT updated
        $em->clear();
        if ($em->getFilters()->isEnabled('tenant')) {
            $em->getFilters()->disable('tenant');
        }
        $updatedChannel = $em->find(NotificationChannel::class, $channelId);
        self::assertInstanceOf(NotificationChannel::class, $updatedChannel);
        $config = $updatedChannel->getConfig() ?? [];
        self::assertArrayNotHasKey('chatId', $config);
    }

    public function testHandleWebhookInvalidFormat(): void
    {
        $client = static::createClient();

        $payload = [
            'message' => [
                'text' => '/start invalid_format',
                'chat' => ['id' => '123'],
            ],
        ];

        $client->request('POST', '/api/webhook/telegram', [
            'json' => $payload,
        ]);

        self::assertResponseIsSuccessful();
    }
}
