<?php

namespace Ari\Tests\Functional;

use Ari\Entity\User;

class UserNotificationSetupTest extends AbstractApiTestCase
{
    public function testApiUserHasNotificationSetup(): void
    {
        $client = static::createClient();
        $uuid = 'test-notif-user-' . uniqid();
        $password = 'secret123';

        // 1. Create User via API
        $client->request('POST', '/api/users', [
            'json' => [
                'uuid' => $uuid,
                'plainPassword' => $password,
            ],
            'headers' => [
                'Content-Type' => 'application/ld+json',
            ],
        ]);

        self::assertResponseStatusCodeSame(201);

        // 2. Login as the new user to get token manually (reuse client)
        $client->request('POST', '/api/login_check', [
            'json' => [
                'username' => $uuid,
                'password' => $password,
            ],
        ]);
        self::assertResponseIsSuccessful();
        // $token is not needed since we check DB directly now.

        // Verify direct DB state (bypass API for a moment)
        $container = self::getContainer();
        $em = $container->get('doctrine')->getManager();
        $user = $em->getRepository(User::class)->findOneBy(['uuid' => $uuid]);
        self::assertNotNull($user);

        // Check Channels
        $channels = $em->getRepository(\Ari\Entity\NotificationChannel::class)->findBy(['user' => $user]);
        self::assertCount(1, $channels, 'Direct DB check: Should have 1 channel');

        // Check Policies
        /** @var \Ari\Entity\NotificationPolicy[] $policies */
        $policies = $em->getRepository(\Ari\Entity\NotificationPolicy::class)->findBy(['user' => $user]);
        self::assertCount(1, $policies, 'Direct DB check: Should have 1 policy');

        $policy = $policies[0];
        $uiSnapshot = $policy->getUiSnapshot();
        self::assertIsArray($uiSnapshot);
        self::assertEquals('Default', $uiSnapshot['name']);
        self::assertStringContainsString('/api/notification_channels/', $uiSnapshot['schedule'][0]['channels'][0]);
    }
}
