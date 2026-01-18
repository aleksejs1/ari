<?php

namespace App\Tests\Functional;

use App\Entity\Contact;
use App\Entity\NotificationChannel;
use App\Entity\NotificationQueue;
use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;

class ContactNotificationDeletionTest extends AbstractApiTestCase
{


    public function testDeleteChannelCascadesToQueue(): void
    {
        $client = static::createClient();
        $token = $this->token;

        // 1. Create Channel
        $response = $client->request('POST', '/api/notification_channels', [
            'auth_bearer' => $token,
            'json' => ['type' => 'email', 'config' => ['email' => 'test@example.com']],
        ]);
        self::assertResponseStatusCodeSame(201);
        $channelId = $response->toArray()['id'];

        // 2. Create Contact (needed for Queue Item)
        $contactResponse = $client->request('POST', '/api/contacts', [
            'auth_bearer' => $token,
            'json' => [
                'contactNames' => [['given' => 'Queue', 'family' => 'Test']],
            ],
        ]);
        $contactId = $contactResponse->toArray()['id'];

        // 3. Manually Create Queue Item linked to Channel
        // We need EM to do this as Queue is not exposed via API directly for creation usually
        $container = self::getContainer();
        /** @var EntityManagerInterface $em */
        $em = $container->get('doctrine')->getManager();

        /** @var NotificationChannel $channel */
        $channel = $em->getRepository(NotificationChannel::class)->find($channelId);
        /** @var Contact $contact */
        $contact = $em->getRepository(Contact::class)->find($contactId);

        $queue = new NotificationQueue();
        $queue->setChannel($channel);
        $queue->setContact($contact);
        $queue->setScheduledAt(new \DateTimeImmutable());
        $queue->setStatus('pending');
        $queue->setAttempts(0);
        $queue->setPayload(['test' => 'data']);
        $queue->setTenant($channel->getUser()); 

        $em->persist($queue);
        $em->flush();
        $queueId = $queue->getId();
        self::assertNotNull($queueId);

        // 4. Delete Channel
        $client->request('DELETE', '/api/notification_channels/' . $channelId, [
            'auth_bearer' => $token,
        ]);
        self::assertResponseStatusCodeSame(204);

        // 5. Verify Queue Item is Gone
        $em->clear(); // Clear cache to ensure we read from DB
        $deletedQueue = $em->getRepository(NotificationQueue::class)->find($queueId);
        self::assertNull($deletedQueue, 'Queue item should be deleted when channel is deleted');
    }
}
