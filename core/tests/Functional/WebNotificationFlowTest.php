<?php

namespace App\Tests\Functional;

use App\Entity\Contact;
use Symfony\Bundle\FrameworkBundle\Console\Application;
use Symfony\Component\Console\Tester\CommandTester;

class WebNotificationFlowTest extends AbstractApiTestCase
{
    protected bool $autoLogin = true;
    private ?string $channelId = null;

    #[\Override]
    protected function setUp(): void
    {
        parent::setUp();

        // Clear database - REMOVED as per request
        // $container = self::getContainer();
        // ... cleanup logic removed ...

        self::bootKernel();

        // Create Channel 'web' once for tests
        $client = static::createClient();
        $channelResponse = $client->request('POST', '/api/notification_channels', [
            'auth_bearer' => $this->token,
            'json' => ['type' => 'web', 'config' => []],
        ]);
        self::assertResponseStatusCodeSame(201);
        $this->channelId = $channelResponse->toArray()['id'];
    }

    public function testGroupTargeting(): void
    {
        $client = static::createClient();
        $token = $this->token;

        // 1. Create Group
        $groupResponse = $client->request('POST', '/api/groups', [
            'auth_bearer' => $token,
            'json' => ['name' => 'Target Group'],
        ]);
        $groupId = $groupResponse->toArray()['id'];

        // 2. Create Contact in Group
        $today = new \DateTime();
        $client->request('POST', '/api/contacts', [
            'auth_bearer' => $token,
            'json' => [
                'contactNames' => [['given' => 'Group', 'family' => 'Member']],
                'contactDates' => [['date' => $today->format('Y-m-d'), 'text' => 'event']],
                'contactGroups' => [['groupResource' => '/api/groups/' . $groupId]],
            ],
        ]);
        self::assertResponseStatusCodeSame(201);

        // 3. Create Policy Targeting Group
        $this->createPolicy($client, $token, ['type' => 'group', 'ids' => [$groupId]], ['event'], 0);

        // 4. Run & Verify
        $this->runGenerateAndProcess($today);
        $this->assertActivityFeedMessage($client, $token, 'Contact Group Member has event after 0 days');
    }

    public function testSpecificContactTargeting(): void
    {
        $client = static::createClient();
        $token = $this->token;

        // 1. Create Contact
        $today = new \DateTime();
        $contactResponse = $client->request('POST', '/api/contacts', [
            'auth_bearer' => $token,
            'json' => [
                'contactNames' => [['given' => 'Specific', 'family' => 'Contact']],
                'contactDates' => [['date' => $today->format('Y-m-d'), 'text' => 'event']],
            ],
        ]);
        $contactId = $contactResponse->toArray()['id'];

        // 2. Create Policy Targeting Contact
        $this->createPolicy($client, $token, ['type' => 'contact', 'ids' => [$contactId]], ['event'], 0);

        // 3. Run & Verify
        $this->runGenerateAndProcess($today);
        $this->assertActivityFeedMessage($client, $token, 'Contact Specific Contact has event after 0 days');
    }

    public function testSpecificEventType(): void
    {
        $client = static::createClient();
        $token = $this->token;

        // 1. Create Contact with multiple events
        $today = new \DateTime();
        $client->request('POST', '/api/contacts', [
            'auth_bearer' => $token,
            'json' => [
                'contactNames' => [['given' => 'Event', 'family' => 'Tester']],
                'contactDates' => [
                    ['date' => $today->format('Y-m-d'), 'text' => 'birthday'], // Should match
                    ['date' => $today->format('Y-m-d'), 'text' => 'anniversary'], // Should NOT match
                ],
            ],
        ]);

        // 2. Create Policy Targeting only 'birthday'
        $this->createPolicy($client, $token, ['type' => 'all'], ['birthday'], 0);

        // 3. Run & Verify
        $this->runGenerateAndProcess($today);

        // Should find birthday message
        $this->assertActivityFeedMessage($client, $token, 'Contact Event Tester has birthday after 0 days');

        // Should NOT find anniversary message
        $this->assertActivityFeedMessageMissing($client, $token, 'Contact Event Tester has anniversary after 0 days');
    }

    public function testWildcardEventType(): void
    {
        $client = static::createClient();
        $token = $this->token;

        // 1. Create Contact with event
        $today = new \DateTime();
        $client->request('POST', '/api/contacts', [
            'auth_bearer' => $token,
            'json' => [
                'contactNames' => [['given' => 'Wildcard', 'family' => 'User']],
                'contactDates' => [['date' => $today->format('Y-m-d'), 'text' => 'custom-event']],
            ],
        ]);

        // 2. Create Policy with empty eventTypes (Wildcard)
        // Creating policy via API with empty eventTypes usually defaults to null in processor logic (?)
        // Or we send update to set it to null/empty if API enforces something.
        // Logic in NotificationPolicyProcessor treats empty eventTypes as [null] (wildcard).
        // So passing empty array works.
        $this->createPolicy($client, $token, ['type' => 'all'], [], 0);

        // 3. Run & Verify
        $this->runGenerateAndProcess($today);
        $this->assertActivityFeedMessage($client, $token, 'Contact Wildcard User has custom-event after 0 days');
    }

    public function testPositiveOffset(): void
    {
        $client = static::createClient();
        $token = $this->token;

        // NEW LOGIC: Positive Offset = Target Future (Before Event)
        // Set Event to TOMORROW
        $today = new \DateTime();
        $tomorrow = (clone $today)->modify('+1 day');

        $client->request('POST', '/api/contacts', [
            'auth_bearer' => $token,
            'json' => [
                'contactNames' => [['given' => 'Future', 'family' => 'Notification']],
                'contactDates' => [['date' => $tomorrow->format('Y-m-d'), 'text' => 'future-event']],
            ],
        ]);

        // Policy: Offset 1. Target = Today + 1 = Tomorrow.
        $this->createPolicy($client, $token, ['type' => 'all'], ['future-event'], 1);

        $this->runGenerateAndProcess($today);
        $this->assertActivityFeedMessage($client, $token, 'Contact Future Notification has future-event after 1 days');
    }

    public function testNegativeOffset(): void
    {
        $client = static::createClient();
        $token = $this->token;

        // NEW LOGIC: Negative Offset = Target Past (After Event)
        // Set Event to YESTERDAY
        $today = new \DateTime();
        $yesterday = (clone $today)->modify('-1 day');

        $client->request('POST', '/api/contacts', [
            'auth_bearer' => $token,
            'json' => [
                'contactNames' => [['given' => 'Past', 'family' => 'Bird']],
                'contactDates' => [['date' => $yesterday->format('Y-m-d'), 'text' => 'yesterday-event']],
            ],
        ]);

        // Policy: Offset -1. Target = Today + (-1) = Yesterday.
        $this->createPolicy($client, $token, ['type' => 'all'], ['yesterday-event'], -1);

        $this->runGenerateAndProcess($today);
        $this->assertActivityFeedMessage($client, $token, 'Contact Past Bird has yesterday-event after -1 days');
    }

    public function testMultipleDatesPerContact(): void
    {
        $client = static::createClient();
        $token = $this->token;

        $today = new \DateTime();

        $client->request('POST', '/api/contacts', [
            'auth_bearer' => $token,
            'json' => [
                'contactNames' => [['given' => 'Multi', 'family' => 'Date']],
                'contactDates' => [
                    ['date' => $today->format('Y-m-d'), 'text' => 'event1'],
                    ['date' => $today->format('Y-m-d'), 'text' => 'event2'],
                ],
            ],
        ]);

        // Policy for ALL events
        $this->createPolicy($client, $token, ['type' => 'all'], [], 0);

        $this->runGenerateAndProcess($today);

        $this->assertActivityFeedMessage($client, $token, 'Contact Multi Date has event1 after 0 days');
        $this->assertActivityFeedMessage($client, $token, 'Contact Multi Date has event2 after 0 days');
    }

    /**
     * @param array<string, mixed> $targets
     * @param array<string>        $eventTypes
     */
    private function createPolicy(
        \ApiPlatform\Symfony\Bundle\Test\Client $client,
        string $token,
        array $targets,
        array $eventTypes,
        int $offset,
    ): void {
        // Use a time slightly in the past
        $schedulerTime = (new \DateTime())->modify('-5 minutes')->format('H:i');

        $client->request('POST', '/api/notification-policies', [
            'auth_bearer' => $token,
            'json' => [
                'name' => 'Test Policy',
                'active' => true,
                'targets' => $targets,
                'eventTypes' => $eventTypes,
                'schedule' => [
                    [
                        'offsetDays' => $offset,
                        'time' => $schedulerTime,
                        'channels' => [$this->channelId],
                    ],
                ],
            ],
        ]);
        self::assertResponseStatusCodeSame(201);
    }

    private function runGenerateAndProcess(\DateTime $date): void
    {
        if (null === self::$kernel) {
            self::bootKernel();
        }

        /** @var \Symfony\Component\HttpKernel\KernelInterface $kernel */
        $kernel = self::$kernel;
        $application = new Application($kernel);
        $application->setAutoExit(false);

        $generateCommand = $application->find('ari:notifications:generate');
        $generateTester = new CommandTester($generateCommand);
        $generateTester->execute(['--date' => $date->format('Y-m-d')]);

        $processCommand = $application->find('ari:notification:process');

        // Loop to drain the queue
        do {
            $processTester = new CommandTester($processCommand);
            $processTester->execute([]);
            $output = $processTester->getDisplay();
        } while (str_contains($output, 'Processed'));
    }

    private function assertActivityFeedMessage(
        \ApiPlatform\Symfony\Bundle\Test\Client $client,
        string $token,
        string $message,
    ): void {
        $feedResponse = $client->request('GET', '/api/activity-feed', [
            'auth_bearer' => $token,
        ]);
        self::assertResponseIsSuccessful();
        $data = $feedResponse->toArray();
        $feeds = $data['member'] ?? [];

        $found = false;
        foreach ($feeds as $feed) {
            if (isset($feed['message']) && $feed['message'] === $message) {
                $found = true;
                break;
            }
        }
        self::assertTrue($found, "Did not find activity feed with message: $message");
    }

    private function assertActivityFeedMessageMissing(
        \ApiPlatform\Symfony\Bundle\Test\Client $client,
        string $token,
        string $message,
    ): void {
        $feedResponse = $client->request('GET', '/api/activity-feed', [
            'auth_bearer' => $token,
        ]);
        self::assertResponseIsSuccessful();
        $data = $feedResponse->toArray();
        $feeds = $data['member'] ?? [];

        $found = false;
        foreach ($feeds as $feed) {
            if (isset($feed['message']) && $feed['message'] === $message) {
                $found = true;
                break;
            }
        }
        self::assertFalse($found, "Found unexpected activity feed with message: $message");
    }
}
