<?php

namespace App\Tests\Functional;

use App\Entity\Group;
use App\Entity\NotificationChannel;
use App\Entity\NotificationPolicy;
use App\Entity\NotificationRule;

class NotificationPolicyTest extends AbstractApiTestCase
{
    public function testCreateNotificationPolicy(): void
    {
        $client = static::createClient();

        // 1. Create Group via API
        $groupResponse = $client->request('POST', '/api/groups', [
            'auth_bearer' => $this->token,
            'json' => ['name' => 'Test Group for Policy'],
        ]);
        self::assertResponseStatusCodeSame(201);
        $groupData = $groupResponse->toArray();
        $groupId = $groupData['id']; // Assuming id is exposed, otherwise extract from @id

        // 2. Create Channel via API
        $channelResponse = $client->request('POST', '/api/notification_channels', [
            'auth_bearer' => $this->token,
            'json' => [
                'type' => 'email',
                'config' => ['foo' => 'bar'] // Valid config for email (none required but array expected)
            ],
        ]);
        self::assertResponseStatusCodeSame(201);
        $channelData = $channelResponse->toArray();
        $channelId = $channelData['id'];

        // 3. Create Policy
        $payload = [
            'name' => 'Test Policy',
            'targets' => [
                'type' => 'group',
                'ids' => [$groupId]
            ],
            'eventTypes' => ['birthday'],
            'schedule' => [
                [
                    'offsetDays' => -7,
                    'time' => '09:00',
                    'channels' => [$channelId]
                ]
            ]
        ];

        $response = $client->request('POST', '/api/notification-policies', [
            'auth_bearer' => $this->token,
            'json' => $payload,
        ]);

        self::assertResponseStatusCodeSame(201);
        $policyData = $response->toArray();
        self::assertArrayHasKey('@id', $policyData);
        self::assertArrayHasKey('id', $policyData);
        $policyId = $policyData['id'];

        // Verify DB side-effects
        // We can use the container to check the DB, assuming the test runs in a way that allows it.
        // If not, we might need to GET the policy (if we exposed GET).
        // NotificationPolicy entity didn't have GET operations enabled in previous step's code snippet?
        // Let's check NotificationPolicy.php in Step 79.
        // It only has POST.
        // So we MUST check via EntityManager.

        $entityManager = static::getContainer()->get('doctrine');
        if (!$entityManager instanceof \Doctrine\Persistence\ManagerRegistry) {
            throw new \RuntimeException('Doctrine not found');
        }
        $em = $entityManager->getManager();

        $policy = $em->getRepository(NotificationPolicy::class)->find($policyId);
        self::assertInstanceOf(NotificationPolicy::class, $policy);

        self::assertCount(1, $policy->getNotificationRules());

        $rule = $policy->getNotificationRules()->first();
        self::assertInstanceOf(NotificationRule::class, $rule);

        $contactGroup = $rule->getContactGroup();
        self::assertInstanceOf(Group::class, $contactGroup);
        self::assertEquals($groupId, $contactGroup->getId());

        self::assertEquals('birthday', $rule->getEventType());
        self::assertEquals(-7, $rule->getOffsetDays());
        self::assertEquals('09:00', $rule->getOffsetTime());

        $channel = $rule->getChannel();
        self::assertInstanceOf(NotificationChannel::class, $channel);
        self::assertEquals($channelId, $channel->getId());
    }
}
