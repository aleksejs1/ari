<?php

namespace Ari\Tests\Functional;

use Ari\Entity\ActivityFeed;
use Ari\Entity\User;

class ActivityFeedTest extends AbstractApiTestCase
{
    private function getUserEntity(): User
    {
        $container = self::getContainer();
        /** @var \Doctrine\Bundle\DoctrineBundle\Registry $doctrine */
        $doctrine = $container->get('doctrine');
        $em = $doctrine->getManager();
        $user = $em->getRepository(User::class)->findOneBy(['uuid' => $this->userUuid]);

        if (null === $user) {
            throw new \RuntimeException('User not found in test setup');
        }

        return $user;
    }

    public function testGetActivityFeedIncludesIsRead(): void
    {
        $client = static::createClient();
        $user = $this->getUserEntity();

        // Create ActivityFeed manually
        $container = self::getContainer();
        /** @var \Doctrine\Bundle\DoctrineBundle\Registry $doctrine */
        $doctrine = $container->get('doctrine');
        $em = $doctrine->getManager();

        $activity = new ActivityFeed();
        $activity->setUserId((int) $user->getId());
        $activity->setEventType('test_event');
        $activity->setTitle('Test Title');
        $activity->setMessage('Test Message');
        $activity->setRead(false);
        $activity->setCreatedAt(new \DateTime());
        $activity->setTenant($user); // Set Tenant User

        $em->persist($activity);
        $em->flush();

        $response = $client->request('GET', '/api/activity-feed', [
            'auth_bearer' => $this->token,
        ]);

        self::assertResponseIsSuccessful();
        $data = $response->toArray();
        $member = $data['member'] ?? []; // Hydra collection

        self::assertGreaterThan(0, count($member));
        self::assertArrayHasKey('isRead', $member[0], 'Response should contain check for "isRead" serialization name');
        self::assertFalse($member[0]['isRead']);
    }

    public function testUnreadCount(): void
    {
        $client = static::createClient();
        $user = $this->getUserEntity();

        // Create 2 Unread Activities
        $container = self::getContainer();
        /** @var \Doctrine\Bundle\DoctrineBundle\Registry $doctrine */
        $doctrine = $container->get('doctrine');
        $em = $doctrine->getManager();

        for ($i = 0; $i < 2; ++$i) {
            $activity = new ActivityFeed();
            $activity->setUserId((int) $user->getId());
            $activity->setEventType('count_event');
            $activity->setTitle('Count Title ' . $i);
            $activity->setRead(false);
            $activity->setCreatedAt(new \DateTime());
            $activity->setTenant($user);
            $em->persist($activity);
        }
        $em->flush();

        $response = $client->request('GET', '/api/activity-feed/unread-count', [
            'auth_bearer' => $this->token,
        ]);

        self::assertResponseIsSuccessful();
        $data = $response->toArray();

        // Response format depends on Controller implementation.
        self::assertArrayHasKey('count', $data);
        self::assertGreaterThanOrEqual(2, $data['count']);
    }

    public function testMarkAsRead(): void
    {
        $client = static::createClient();
        $user = $this->getUserEntity();

        // Create Unread Activity
        $container = self::getContainer();
        /** @var \Doctrine\Bundle\DoctrineBundle\Registry $doctrine */
        $doctrine = $container->get('doctrine');
        $em = $doctrine->getManager();

        $activity = new ActivityFeed();
        $activity->setUserId((int) $user->getId());
        $activity->setEventType('read_event');
        $activity->setTitle('Read Title');
        $activity->setRead(false);
        $activity->setCreatedAt(new \DateTime());
        $activity->setTenant($user);

        $em->persist($activity);
        $em->flush();
        $id = $activity->getId();

        $client->request('PATCH', '/api/activity-feed/read', [
            'auth_bearer' => $this->token,
            'json' => [
                'ids' => [$id],
            ],
            'headers' => [
                'Content-Type' => 'application/merge-patch+json',
            ],
        ]);

        self::assertResponseIsSuccessful();

        $em->clear(); // Clear cache to fetch fresh from DB
        $updatedActivity = $em->getRepository(ActivityFeed::class)->find($id);
        self::assertInstanceOf(ActivityFeed::class, $updatedActivity);
        self::assertTrue($updatedActivity->isRead());
    }
}
