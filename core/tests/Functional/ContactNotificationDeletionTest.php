<?php

namespace Ari\Tests\Functional;

use Ari\Entity\Contact;
use Ari\Entity\NotificationChannel;
use Ari\Entity\NotificationQueue;
use Ari\Entity\User;
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
        
        // 3.5 Create Notification Rule linked to Channel (to test Rule Cascade)
        $policy = new \Ari\Entity\NotificationPolicy();
        $policy->setName('Test Policy');
        $policy->setUser($channel->getUser()); // setUser also sets Tenant
        $policy->setIsActive(true);
        $em->persist($policy);

        $rule = new \Ari\Entity\NotificationRule();
        $rule->setTenant($channel->getUser());
        $rule->setPolicy($policy);
        $rule->setChannel($channel);
        $rule->setOffsetDays(0);
        $em->persist($rule);

        // 3.6 Create Notification Subscription linked to Channel
        $subscription = new \Ari\Entity\NotificationSubscription();
        $subscription->setUser($channel->getUser());
        $subscription->setChannel($channel);
        $subscription->setEntityType('contact');
        $subscription->setEntityId($contactId);
        $em->persist($subscription);

        // 3.7 Create Notification Intent linked to Channel
        $intent = new \Ari\Entity\NotificationIntent();
        $intent->setChannel($channel);
        $intent->setPayload(['test' => 'intent']);
        $em->persist($intent);

        $em->flush();
        $queueId = $queue->getId();
        $ruleId = $rule->getId();
        $subscriptionId = $subscription->getId();
        $intentId = $intent->getId();
        self::assertNotNull($queueId);
        self::assertNotNull($ruleId);
        self::assertNotNull($subscriptionId);
        self::assertNotNull($intentId);

        // 4. Delete Channel
        $client->request('DELETE', '/api/notification_channels/' . $channelId, [
            'auth_bearer' => $token,
        ]);
        self::assertResponseStatusCodeSame(204);

        // 5. Verify Queue Item is Gone
        $em->clear(); // Clear cache to ensure we read from DB
        $deletedQueue = $em->getRepository(NotificationQueue::class)->find($queueId);
        self::assertNull($deletedQueue, 'Queue item should be deleted when channel is deleted');
        
        $deletedRule = $em->getRepository(\Ari\Entity\NotificationRule::class)->find($ruleId);
        self::assertNull($deletedRule, 'Notification Rule should be deleted when channel is deleted');

        $deletedSubscription = $em->getRepository(\Ari\Entity\NotificationSubscription::class)->find($subscriptionId);
        self::assertNull($deletedSubscription, 'Notification Subscription should be deleted when channel is deleted');

        $deletedIntent = $em->getRepository(\Ari\Entity\NotificationIntent::class)->find($intentId);
        self::assertNull($deletedIntent, 'Notification Intent should be deleted when channel is deleted');
    }
}
