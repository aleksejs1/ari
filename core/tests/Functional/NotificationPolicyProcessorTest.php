<?php

namespace App\Tests\Functional;

use App\Entity\NotificationPolicy;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;

// Using WebTestCase for client

// Assuming this is easier

class NotificationPolicyProcessorTest extends AbstractApiTestCase
{
    private string $channelId;

    #[\Override]
    protected function setUp(): void
    {
        parent::setUp();
        self::bootKernel();

        // Setup a channel
        $client = static::createClient();
        $channelResponse = $client->request('POST', '/api/notification_channels', [
            'auth_bearer' => $this->token,
            'json' => ['type' => 'web', 'config' => []],
        ]);
        // Iterate channelId if needed, or rely on setup to be clean enough or handle uniqueness?
        // Usually safe to create one.
        if (201 === $channelResponse->getStatusCode()) {
            $this->channelId = $channelResponse->toArray()['id'];
        } else {
            // Find existing if creating failed (maybe uniqueness constraint?)
            $container = self::getContainer();
            $em = $container->get(EntityManagerInterface::class);
            assert($em instanceof EntityManagerInterface);
            $ch = $em->getRepository(\App\Entity\NotificationChannel::class)->findOneBy(['type' => 'web']);
            if (null !== $ch) {
                $this->channelId = (string) $ch->getId();
            } else {
                self::fail('Could not create or find channel');
            }
        }
    }

    public function testRulesAreAdditive(): void
    {
        $client = static::createClient();
        $token = $this->token;

        // 1. Create a dummy group to target
        $groupResponse = $client->request('POST', '/api/groups', [
            'auth_bearer' => $token,
            'json' => ['name' => 'Rule Test Group'],
        ]);
        $groupId = $groupResponse->toArray()['id'];

        // 2. Create Initial Policy with ONE rule
        // Target: Group, Event: 'event-A', Offset: 0
        $response = $client->request('POST', '/api/notification-policies', [
            'auth_bearer' => $token,
            'json' => [
                'name' => 'Additive Rules Policy',
                'active' => true,
                'targets' => ['type' => 'group', 'ids' => [$groupId]],
                'eventTypes' => ['event-A'],
                'schedule' => [
                    [
                        'offsetDays' => 0,
                        'time' => '10:00',
                        'channels' => [$this->channelId],
                    ],
                ],
            ],
        ]);
        self::assertResponseStatusCodeSame(201);
        $policyId = $response->toArray()['id'];

        // Get the rule ID
        $em = self::getContainer()->get(EntityManagerInterface::class);
        assert($em instanceof EntityManagerInterface);
        $em->clear();
        $policy = $em->getRepository(NotificationPolicy::class)->find($policyId);
        self::assertNotNull($policy);

        $rules = $policy->getNotificationRules();
        self::assertCount(1, $rules);
        $firstRule = $rules[0];
        self::assertNotNull($firstRule);
        $firstRuleId = $firstRule->getId();

        // 3. Update Policy adding a SECOND rule
        // Add Event: 'event-B'
        // This effectively means we now have ['event-A', 'event-B']
        $client->request('PUT', '/api/notification-policies/' . $policyId, [
            'auth_bearer' => $token,
            'json' => [
                'name' => 'Additive Rules Policy Updated',
                'active' => true,
                'targets' => ['type' => 'group', 'ids' => [$groupId]],
                'eventTypes' => ['event-A', 'event-B'], // Added event-B
                'schedule' => [
                    [
                        'offsetDays' => 0,
                        'time' => '10:00',
                        'channels' => [$this->channelId],
                    ],
                ],
            ],
        ]);
        self::assertResponseIsSuccessful();

        $em->clear();
        $policy = $em->getRepository(NotificationPolicy::class)->find($policyId);
        self::assertNotNull($policy);

        $rules = $policy->getNotificationRules();

        // Assertions
        self::assertCount(2, $rules, 'Should have 2 rules now');

        $ruleIds = [];
        foreach ($rules as $r) {
            $ruleIds[] = $r->getId();
        }

        self::assertContains($firstRuleId, $ruleIds, 'First rule ID should still exist (preserved)');
    }

    public function testRulesAreRemoved(): void
    {
        $client = static::createClient();
        $token = $this->token;

        $groupResponse = $client->request('POST', '/api/groups', [
            'auth_bearer' => $token,
            'json' => ['name' => 'Deletion Test Group'],
        ]);
        $groupId = $groupResponse->toArray()['id'];

        // 1. Create Policy with TWO rules
        // Events: ['A', 'B']
        $response = $client->request('POST', '/api/notification-policies', [
            'auth_bearer' => $token,
            'json' => [
                'name' => 'Deletion Rules Policy',
                'active' => true,
                'targets' => ['type' => 'group', 'ids' => [$groupId]],
                'eventTypes' => ['A', 'B'],
                'schedule' => [
                    [
                        'offsetDays' => 0,
                        'time' => '10:00',
                        'channels' => [$this->channelId],
                    ],
                ],
            ],
        ]);
        $policyId = $response->toArray()['id'];

        $em = self::getContainer()->get(EntityManagerInterface::class);
        assert($em instanceof EntityManagerInterface);
        $em->clear();
        $policy = $em->getRepository(NotificationPolicy::class)->find($policyId);
        self::assertNotNull($policy);
        $rules = $policy->getNotificationRules();
        self::assertCount(2, $rules);

        $ruleAId = null;
        foreach ($rules as $r) {
            if ('A' === $r->getEventType()) {
                $ruleAId = $r->getId();
            }
        }
        self::assertNotNull($ruleAId);


        // 2. Update Policy REMOVING event 'B'
        // Events: ['A']
        $client->request('PUT', '/api/notification-policies/' . $policyId, [
            'auth_bearer' => $token,
            'json' => [
                'name' => 'Deletion Rules Policy Updated',
                'active' => true,
                'targets' => ['type' => 'group', 'ids' => [$groupId]],
                'eventTypes' => ['A'], // Removed B
                'schedule' => [
                    [
                        'offsetDays' => 0,
                        'time' => '10:00',
                        'channels' => [$this->channelId],
                    ],
                ],
            ],
        ]);
        self::assertResponseIsSuccessful();

        $em->clear();
        $policy = $em->getRepository(NotificationPolicy::class)->find($policyId);
        self::assertNotNull($policy);

        $rules = $policy->getNotificationRules();

        // Assertions
        self::assertCount(1, $rules, 'Should have only 1 rule now (B deleted)');
        $remainingRule = $rules[0];
        self::assertNotNull($remainingRule);
        self::assertSame($ruleAId, $remainingRule->getId(), 'Rule A should be preserved');
    }
}
