<?php

namespace Ari\Tests\Functional;

use Ari\Entity\NotificationQueue;
use Ari\Entity\NotificationRule;
use Symfony\Bundle\FrameworkBundle\Console\Application;
use Symfony\Component\Console\Tester\CommandTester;

class NotificationRuleDeletionTest extends AbstractApiTestCase
{
    private ?string $channelId = null;

    #[\Override]
    protected function setUp(): void
    {
        parent::setUp();
        self::bootKernel();

        // Create Channel 'web'
        $client = static::createClient();
        $channelResponse = $client->request('POST', '/api/notification_channels', [
            'auth_bearer' => $this->token,
            'json' => ['type' => 'web', 'config' => []],
        ]);
        self::assertResponseStatusCodeSame(201);
        $this->channelId = $channelResponse->toArray()['id'];
    }

    public function testRuleDeletionCancelsQueue(): void
    {
        $client = static::createClient();
        $token = $this->token;

        // 1. Create Contact
        $today = new \DateTime();
        $contactResponse = $client->request('POST', '/api/contacts', [
            'auth_bearer' => $token,
            'json' => [
                'contactNames' => [['given' => 'Deletion', 'family' => 'Test']],
                'contactDates' => [['date' => $today->format('Y-m-d'), 'text' => 'event']],
            ],
        ]);
        $contactId = $contactResponse->toArray()['id'];

        // 2. Create Policy
        // We use 'all' with one event type 'event'
        $policyResponse = $client->request('POST', '/api/notification-policies', [
            'auth_bearer' => $token,
            'json' => [
                'name' => 'Deletion Policy',
                'active' => true,
                'targets' => ['type' => 'all'],
                'eventTypes' => ['event'],
                'schedule' => [
                    [
                        'offsetDays' => 0,
                        'time' => '09:00',
                        'channels' => [$this->channelId],
                    ],
                ],
            ],
        ]);
        self::assertResponseStatusCodeSame(201);
        $policyId = $policyResponse->toArray()['id'];

        // 3. Run Generator to create Queue items
        $this->runGenerate($today);

        // Verify Queue Item exists and is Pending
        /** @var \Doctrine\Bundle\DoctrineBundle\Registry $doctrine */
        $doctrine = self::getContainer()->get('doctrine');
        /** @var \Doctrine\ORM\EntityManagerInterface $em */
        $em = $doctrine->getManager();
        $queueRepo = $em->getRepository(NotificationQueue::class);

        $queues = $queueRepo->findBy(['contact' => $contactId]);
        self::assertNotEmpty($queues, 'Should find at least one queue item for the contact');
        $queue = $queues[0];
        self::assertSame('pending', $queue->getStatus());
        $rule = $queue->getRule();
        self::assertNotNull($rule);
        $ruleId = $rule->getId();

        // 4. Update Policy to remove the Rule
        // ... (existing code for request) ...
        $client->request('PATCH', '/api/notification-policies/' . $policyId, [
            'auth_bearer' => $token,
            'headers' => ['Content-Type' => 'application/merge-patch+json'],
            'json' => [
                'name' => 'Deletion Policy',
                'targets' => ['type' => 'all'],
                'eventTypes' => ['event'],
                'schedule' => [], // Empty schedule to trigger rule removal
            ],
        ]);
        self::assertResponseStatusCodeSame(200);

        // 5. Verify Rule is Deleted and Queue is Canceled
        /** @var \Doctrine\Bundle\DoctrineBundle\Registry $doctrine */
        $doctrine = self::getContainer()->get('doctrine');
        $doctrine->resetManager(); // clear was not enough? resetManager behaves like re-booting EM.
        // Actually $em->clear() is what we used before. resetManager replaces the EM instance.
        // Let's stick to $em->clear() but we need to re-fetch $em if we reset.
        // The previous code used $em->clear().
        // Let's just use $em->clear() ensuring we have the right EM.
        /** @var \Doctrine\ORM\EntityManagerInterface $em */
        $em = $doctrine->getManager();
        $em->clear();

        $queueRepo = $em->getRepository(NotificationQueue::class);
        $ruleRepo = $em->getRepository(NotificationRule::class);

        $queueFresh = $queueRepo->find($queue->getId());
        self::assertNotNull($queueFresh, 'Queue item should still exist');
        self::assertSame('canceled', $queueFresh->getStatus(), 'Queue status should be canceled');
        self::assertNull($queueFresh->getRule(), 'Queue rule should be null');
        self::assertSame('Rule deleted', $queueFresh->getResult());

        // Verify Rule is gone
        $deletedRule = $ruleRepo->find($ruleId);
        self::assertNull($deletedRule, 'Rule should be deleted');
    }

    private function runGenerate(\DateTime $date): void
    {
        if (null === self::$kernel) {
            self::bootKernel();
        }

        /** @var \Symfony\Component\HttpKernel\KernelInterface $kernel */
        $kernel = self::$kernel;
        $application = new Application($kernel);
        $application->setAutoExit(false);

        $generateCommand = $application->find('ari:notification:generate');
        $generateTester = new CommandTester($generateCommand);
        $generateTester->execute(['--date' => $date->format('Y-m-d')]);
    }
}
