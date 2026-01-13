<?php

namespace App\Tests\Functional;

use App\Entity\Contact;
use App\Entity\ContactDate;
use App\Entity\Group;
use App\Entity\ContactGroup;
use App\Entity\NotificationPolicy;
use App\Entity\UserPref;
use Doctrine\ORM\EntityManagerInterface;

class ContactDatePolicyFilterTest extends AbstractApiTestCase
{
    protected static ?bool $alwaysBootKernel = true;

    public function testContactDateFilteringByPolicy(): void
    {
        $client = static::createClient();
        $em = static::getContainer()->get('doctrine')->getManager();
        /** @var EntityManagerInterface $em */
        
        // 1. Setup User
        $user = $em->getRepository(\App\Entity\User::class)->findOneBy(['uuid' => $this->userUuid]);
        
        // 2. Setup Groups
        $groupA = new Group();
        $groupA->setName('Group A');
        $groupA->setUser($user);
        $em->persist($groupA);
        
        $groupB = new Group();
        $groupB->setName('Group B');
        $groupB->setUser($user);
        $em->persist($groupB);
        
        // 3. Setup Contacts
        $contact1 = new Contact();
        $contact1->setUser($user);
        $em->persist($contact1);
        
        $cg1 = new ContactGroup($contact1);
        $cg1->setGroupResource($groupA);
        $em->persist($cg1);
        
        $contact2 = new Contact();
        $contact2->setUser($user);
        $em->persist($contact2);
        
        $cg2 = new ContactGroup($contact2);
        $cg2->setGroupResource($groupB);
        $em->persist($cg2);
        
        // 4. Setup ContactDates
        $date1 = new ContactDate($contact1);
        $date1->setText('Birthday');
        $date1->setDate(new \DateTime('1990-01-01'));
        $em->persist($date1);
        
        $date2 = new ContactDate($contact1);
        $date2->setText('Wedding');
        $date2->setDate(new \DateTime('2010-06-01'));
        $em->persist($date2);
        
        $date3 = new ContactDate($contact2);
        $date3->setText('Birthday');
        $date3->setDate(new \DateTime('1995-03-01'));
        $em->persist($date3);
        
        $em->flush();
        
        // 5. Create Notification Policy
        // Rule: Group A + Birthday
        $payload = [
            'name' => 'Test Dashboard Policy',
            'targets' => [
                'type' => 'group',
                'ids' => [$groupA->getId()],
            ],
            'eventTypes' => ['Birthday'],
            'schedule' => [], // Rules are needed, schedule is mostly for queue gen but Processor creates rules from it?
            // Wait, NotificationPolicyProcessor creates rules from schedule items.
            // If schedule is empty, no rules will be created.
            // But I can create a dummy rule.
        ];
        
        // Actually, let's use a channel to make schedule valid
        $channelResponse = $client->request('POST', '/api/notification_channels', [
            'auth_bearer' => $this->token,
            'json' => ['type' => 'web', 'config' => []],
        ]);
        $channelId = $channelResponse->toArray()['id'];
        
        $payload['schedule'] = [
            [
                'offsetDays' => 0,
                'time' => '09:00',
                'channels' => [$channelId],
            ]
        ];
        
        $policyResponse = $client->request('POST', '/api/notification-policies', [
            'auth_bearer' => $this->token,
            'json' => $payload,
        ]);
        self::assertResponseStatusCodeSame(201);
        $policyId = $policyResponse->toArray()['id'];
        
        // 6. Verify unfiltered collection
        $response = $client->request('GET', '/api/contact_dates?upcomingAnniversary=asc', [
            'auth_bearer' => $this->token,
        ]);
        self::assertResponseIsSuccessful();
        /** @var array<int, array<string, mixed>> $members */
        $members = $response->toArray()['member'];
        self::assertCount(3, $members);
        
        // 7. Set UserPref for dashboard policy
        $client->request('PUT', '/api/user_prefs/dashboard_notification_policy', [
            'auth_bearer' => $this->token,
            'json' => ['value' => (string) $policyId],
        ]);
        self::assertResponseIsSuccessful();
        
        // 8. Verify filtered collection
        // Should only show $date1 (Group A + Birthday)
        $response = $client->request('GET', '/api/contact_dates?upcomingAnniversary=asc', [
            'auth_bearer' => $this->token,
        ]);
        self::assertResponseIsSuccessful();
        /** @var array<int, array<string, mixed>> $members */
        $members = $response->toArray()['member'];
        self::assertCount(1, $members);
        self::assertEquals('Birthday', $members[0]['text']);
        self::assertStringContainsString((string) $contact1->getId(), $members[0]['contact']['@id']);
        
        // 9. Change Pref to 0 (Disable filtering)
        $client->request('PUT', '/api/user_prefs/dashboard_notification_policy', [
            'auth_bearer' => $this->token,
            'json' => ['value' => '0'],
        ]);
        self::assertResponseIsSuccessful();
        
        $response = $client->request('GET', '/api/contact_dates?upcomingAnniversary=asc', [
            'auth_bearer' => $this->token,
        ]);
        self::assertResponseIsSuccessful();
        self::assertCount(3, $response->toArray()['member']);
        
        // 10. Test with multiple rules
        // Update policy to include Group B + Birthday
        $payload['targets']['ids'] = [$groupA->getId(), $groupB->getId()];
        $client->request('PUT', '/api/notification-policies/' . $policyId, [
            'auth_bearer' => $this->token,
            'json' => $payload,
        ]);
        self::assertResponseIsSuccessful();
        
        // Set pref back
        $client->request('PUT', '/api/user_prefs/dashboard_notification_policy', [
            'auth_bearer' => $this->token,
            'json' => ['value' => (string) $policyId],
        ]);
        self::assertResponseIsSuccessful();
        
        // Refresh EM and verify rules
        $em->clear();
        $policy = $em->getRepository(NotificationPolicy::class)->find($policyId);
        self::assertInstanceOf(NotificationPolicy::class, $policy);
        self::assertCount(2, $policy->getNotificationRules());
        
        $response = $client->request('GET', '/api/contact_dates?upcomingAnniversary=asc', [
            'auth_bearer' => $this->token,
        ]);
        self::assertResponseIsSuccessful();
        /** @var array<int, array<string, mixed>> $members */
        $members = $response->toArray()['member'];
        self::assertCount(2, $members);
    }
}
