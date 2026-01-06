<?php

namespace App\Tests\Functional;

use App\Entity\NotificationQueue;
use App\Entity\NotificationRule;
use Symfony\Bundle\FrameworkBundle\Console\Application;
use Symfony\Component\Console\Tester\CommandTester;

class NotificationGenerateCommandTest extends AbstractApiTestCase
{
    public function testGenerateNotifications(): void
    {
        $client = static::createClient();
        $token = $this->token; // Assuming AbstractApiTestCase provides this after createClient

        // 1. Create a Contact with a Birthday tomorrow
        $tomorrow = new \DateTime('+1 day');
        $contactResponse = $client->request('POST', '/api/contacts', [
            'auth_bearer' => $token,
            'json' => [
                'contactDates' => [
                    [
                        'date' => $tomorrow->format('Y-m-d'),
                        'text' => 'birthday'
                    ]
                ]
            ]
        ]);
        self::assertResponseStatusCodeSame(201);
        $contactId = $contactResponse->toArray()['id'];

        // 2. Create Channel
        $channelResponse = $client->request('POST', '/api/notification_channels', [
            'auth_bearer' => $token,
            'json' => ['type' => 'email', 'config' => []]
        ]);
        self::assertResponseStatusCodeSame(201);
        $channelData = $channelResponse->toArray();
        self::assertEquals('email', $channelData['type'], 'Channel type verified from API response');
        $channelId = $channelData['id'];



        $groupResponse = $client->request('POST', '/api/groups', [
            'auth_bearer' => $token,
            'json' => ['name' => 'Birthday Group']
        ]);
        $groupId = $groupResponse->toArray()['id'];

        // Add contact to group
        $client->request('POST', '/api/contact_groups', [
            'auth_bearer' => $token,
            'json' => [
                'contact' => '/api/contacts/' . $contactId,
                'groupResource' => '/api/groups/' . $groupId
            ]
        ]);
        self::assertResponseStatusCodeSame(201);

        // Create Policy targeting this group
        $client->request('POST', '/api/notification-policies', [
            'auth_bearer' => $token,
            'json' => [
                'name' => 'Birthday Reminder',
                'targets' => ['type' => 'group', 'ids' => [$groupId]],
                'eventTypes' => ['birthday'],
                'schedule' => [
                    [
                        // Execution(Today) = Event(Tomorrow) + (-1). Target = Today - (-1) = Tomorrow. Correct.
                        'offsetDays' => -1,
                        'time' => '09:00',
                        'channels' => [$channelId]
                    ]
                ]
            ]
        ]);
        self::assertResponseStatusCodeSame(201);

        // 4. Run Command
        $kernel = self::bootKernel();
        $application = new Application($kernel);

        $command = $application->find('ari:notifications:generate');
        $commandTester = new CommandTester($command);

        // Execute for Today
        $commandTester->execute([
            '--date' => (new \DateTime())->format('Y-m-d')
        ]);

        $output = $commandTester->getDisplay();
        self::assertMatchesRegularExpression('/Generated \d+ notification queue items/', $output);

        // Ensure count is not 0
        preg_match('/Generated (\d+) notification queue items/', $output, $matches);
        self::assertGreaterThan(0, (int)$matches[1]);

        // 5. Verify Queue Item in DB
        $doctrine = $kernel->getContainer()->get('doctrine');
        if (!$doctrine instanceof \Doctrine\Persistence\ManagerRegistry) {
             throw new \RuntimeException('Doctrine service not found');
        }
        $entityManager = $doctrine->getManager();
        $contact = $entityManager->getRepository(\App\Entity\Contact::class)->find($contactId);
        $queueItem = $entityManager->getRepository(NotificationQueue::class)->findOneBy(['contact' => $contact]);

        self::assertNotNull($queueItem, 'Queue item should exist for the created contact');
        self::assertEquals('pending', $queueItem->getStatus());

        // 6. Idempotency Check
        $commandTester->execute([
            '--date' => (new \DateTime())->format('Y-m-d')
        ]);
        $output = $commandTester->getDisplay();
        self::assertStringContainsString('Generated 0 notification queue items', $output);
    }
}
