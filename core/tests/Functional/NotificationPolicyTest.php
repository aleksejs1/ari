<?php

namespace Ari\Tests\Functional;

use Ari\Entity\Group;
use Ari\Entity\NotificationChannel;
use Ari\Entity\NotificationPolicy;
use Ari\Entity\NotificationRule;

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
                'config' => ['foo' => 'bar'], // Valid config for email (none required but array expected)
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
                'ids' => [$groupId],
            ],
            'eventTypes' => ['birthday'],
            'schedule' => [
                [
                    'offsetDays' => -7,
                    'time' => '09:00',
                    'channels' => [$channelId],
                ],
            ],
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
        if (!$entityManager instanceof \Doctrine\Bundle\DoctrineBundle\Registry) {
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

    public function testCRUDOperations(): void
    {
        $client = static::createClient();

        // 1. Setup Dependencies (Group & Channel)
        $groupResponse = $client->request('POST', '/api/groups', [
            'auth_bearer' => $this->token,
            'json' => ['name' => 'CRUD Group'],
        ]);
        self::assertResponseStatusCodeSame(201);
        $groupId = $groupResponse->toArray()['id'];

        $channelResponse = $client->request('POST', '/api/notification_channels', [
            'auth_bearer' => $this->token,
            'json' => ['type' => 'email', 'config' => []],
        ]);
        self::assertResponseStatusCodeSame(201);
        $channelId = $channelResponse->toArray()['id'];

        // 2. Create (POST)
        $payload = [
            'name' => 'Original Policy',
            'targets' => ['type' => 'group', 'ids' => [$groupId]],
            'eventTypes' => ['birthday'],
            'schedule' => [['offsetDays' => 0, 'time' => '12:00', 'channels' => [$channelId]]],
        ];

        $resp = $client->request('POST', '/api/notification-policies', [
            'auth_bearer' => $this->token,
            'json' => $payload,
        ]);
        self::assertResponseStatusCodeSame(201);
        $policyId = $resp->toArray()['id'];
        $policyIri = $resp->toArray()['@id'];

        // 3. Read (GET)
        $client->request('GET', $policyIri, ['auth_bearer' => $this->token]);
        self::assertResponseStatusCodeSame(200);
        self::assertJsonContains([
            'name' => 'Original Policy',
            'targets' => ['type' => 'group'], // Check root level key
            'schedule' => [['time' => '12:00']],
        ]);

        // 4. Update (PUT)
        $updatePayload = $payload;
        $updatePayload['name'] = 'Updated Policy';
        $updatePayload['schedule'][0]['time'] = '13:00';

        $client->request('PUT', $policyIri, [
            'auth_bearer' => $this->token,
            'json' => $updatePayload,
        ]);
        self::assertResponseStatusCodeSame(200);
        self::assertJsonContains(['name' => 'Updated Policy']);

        // Verify update persisted (GET again)
        $client->request('GET', $policyIri, ['auth_bearer' => $this->token]);
        self::assertJsonContains(['name' => 'Updated Policy']);

        // Verify Rules updated (via DB or implicit logic - DB check better)
        $doctrine = static::getContainer()->get('doctrine');
        if (!$doctrine instanceof \Doctrine\Bundle\DoctrineBundle\Registry) {
            throw new \RuntimeException('Doctrine not found');
        }
        $entityManager = $doctrine->getManager();
        $policy = $entityManager->getRepository(NotificationPolicy::class)->find($policyId);
        self::assertInstanceOf(NotificationPolicy::class, $policy);
        $entityManager->refresh($policy);
        self::assertEquals('Updated Policy', $policy->getName());
        $rule = $policy->getNotificationRules()->first();
        self::assertInstanceOf(NotificationRule::class, $rule);
        self::assertEquals('13:00', $rule->getOffsetTime());

        // 5. Delete (DELETE)
        $client->request('DELETE', $policyIri, ['auth_bearer' => $this->token]);
        self::assertResponseStatusCodeSame(204);

        // 6. Verify Delete (GET -> 404)
        $client->request('GET', $policyIri, ['auth_bearer' => $this->token]);
        self::assertResponseStatusCodeSame(404);
    }

    public function testCreateAllNotificationPolicy(): void
    {
        $client = static::createClient();

        // 1. Create Channel
        $channelResponse = $client->request('POST', '/api/notification_channels', [
            'auth_bearer' => $this->token,
            'json' => ['type' => 'email', 'config' => []],
        ]);
        self::assertResponseStatusCodeSame(201);
        $channelId = $channelResponse->toArray()['id'];

        // 2. Create Policy with 'all'
        $payload = [
            'name' => 'All Policy',
            'targets' => [
                'type' => 'all',
                // ids implied absent
            ],
            'eventTypes' => ['birthday'],
            'schedule' => [
                [
                    'offsetDays' => 0,
                    'time' => '10:00',
                    'channels' => [$channelId],
                ],
            ],
        ];

        $response = $client->request('POST', '/api/notification-policies', [
            'auth_bearer' => $this->token,
            'json' => $payload,
        ]);

        self::assertResponseStatusCodeSame(201);
        $policyId = $response->toArray()['id'];

        $doctrine = static::getContainer()->get('doctrine');
        if (!$doctrine instanceof \Doctrine\Bundle\DoctrineBundle\Registry) {
            throw new \RuntimeException('Doctrine not found');
        }
        $em = $doctrine->getManager();
        $policy = $em->getRepository(NotificationPolicy::class)->find($policyId);
        self::assertInstanceOf(NotificationPolicy::class, $policy);
        self::assertCount(1, $policy->getNotificationRules());

        $rule = $policy->getNotificationRules()->first();
        self::assertInstanceOf(NotificationRule::class, $rule);
        self::assertEquals('all', $rule->getTargetType());
        self::assertNull($rule->getContactGroup());
        self::assertNull($rule->getContact());
    }

    public function testCreatePolicyWithEmptyEventTypes(): void
    {
        $client = static::createClient();

        $channelResponse = $client->request('POST', '/api/notification_channels', [
            'auth_bearer' => $this->token,
            'json' => ['type' => 'email', 'config' => []],
        ]);
        self::assertResponseStatusCodeSame(201);
        $channelId = $channelResponse->toArray()['id'];

        $payload = [
            'name' => 'Empty EventTypes Policy',
            'targets' => ['type' => 'all'],
            'eventTypes' => [], // Empty array provided
            'schedule' => [
                [
                    'offsetDays' => 0,
                    'time' => '10:00',
                    'channels' => [$channelId],
                ],
            ],
        ];

        $response = $client->request('POST', '/api/notification-policies', [
            'auth_bearer' => $this->token,
            'json' => $payload,
        ]);
        self::assertResponseStatusCodeSame(201);
        $policyId = $response->toArray()['id'];

        $doctrine = static::getContainer()->get('doctrine');
        if (!$doctrine instanceof \Doctrine\Bundle\DoctrineBundle\Registry) {
            throw new \RuntimeException('Doctrine not found');
        }
        $em = $doctrine->getManager();
        $policy = $em->getRepository(NotificationPolicy::class)->find($policyId);
        self::assertInstanceOf(NotificationPolicy::class, $policy);

        self::assertCount(1, $policy->getNotificationRules());
        $rule = $policy->getNotificationRules()->first();
        self::assertInstanceOf(NotificationRule::class, $rule);
        self::assertNull($rule->getEventType());
    }

    public function testDtoHasCorrectId(): void
    {
        $client = static::createClient();

        $payload = [
            'name' => 'ID Check Policy',
            'targets' => ['type' => 'all'],
            'eventTypes' => [],
            'schedule' => [],
        ];

        $response = $client->request('POST', '/api/notification-policies', [
            'auth_bearer' => $this->token,
            'json' => $payload,
        ]);
        self::assertResponseStatusCodeSame(201);
        $policyId = $response->toArray()['id'];
        $policyIri = $response->toArray()['@id'];

        // Verify POST returned correct IRI (generated from Entity or DTO?)
        // POST uses Processor, returns Entity which is output as DTO.
        // If DTO output is enabled, serialization uses DTO.
        // If Provider is only for GET, POST might still use Entity-to-DTO output?
        // Actually, if output class is DTO, ApiPlatform converts Entity -> DTO.
        // If no DataTransformer for Output, it might use property mapping.
        // But I implemented Provider for GET. For POST, I haven't implemented Output Transformer.
        // Wait, for POST, 'processor' is defined. It returns Entity.
        // If 'output' is DTO, ApiPlatform tries to transform Entity to DTO.
        // Since no transformer, it might rely on serializer/normalizer?
        // Or if I set output=DTO on resource level (I did not, only on GET operations).
        // Check NotificationPolicy.php:
        // POST does NOT have output=DTO. It uses input=DTO, processor=Processor.
        // So POST returns Entity. Entity defaults to @id based on Entity ID.
        // So POST response should have correct ID.

        // GET Request uses Provider -> DTO.
        // DTO has identifier=true on $id.
        // If $id is null, @id is genid.

        $client->request('GET', $policyIri, ['auth_bearer' => $this->token]);
        self::assertResponseStatusCodeSame(200);

        // Assert @id matches /api/notification-policies/{id}
        self::assertJsonContains([
            '@id' => $policyIri,
            'id' => $policyId,
        ]);
    }
}
