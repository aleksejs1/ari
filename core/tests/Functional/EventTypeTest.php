<?php

namespace App\Tests\Functional;

use App\Entity\Contact;
use App\Entity\ContactDate;

class EventTypeTest extends AbstractApiTestCase
{
    #[\Override]
    protected function setUp(): void
    {
        parent::setUp();

        $container = self::getContainer();
        /** @var \Doctrine\Persistence\ManagerRegistry $doctrine */
        $doctrine = $container->get('doctrine');
        $em = $doctrine->getManager();

        // Seed data
        $user = $em->getRepository(\App\Entity\User::class)->findOneBy(['uuid' => $this->userUuid]);

        $contact = new Contact();
        $contact->setUser($user);
        $em->persist($contact);

        $date1 = new ContactDate($contact);
        $date1->setText('Birthday');
        $date1->setDate(new \DateTime('2023-01-01'));
        $em->persist($date1);

        $date2 = new ContactDate($contact);
        $date2->setText('Anniversary');
        $date2->setDate(new \DateTime('2023-02-01'));
        $em->persist($date2);

        $date3 = new ContactDate($contact);
        $date3->setText('Birthday'); // Duplicate
        $date3->setDate(new \DateTime('2023-03-01'));
        $em->persist($date3);

        $date4 = new ContactDate($contact);
        $date4->setText('Meeting');
        $date4->setDate(new \DateTime('2023-04-01'));
        $em->persist($date4);

        $em->flush();
    }

    public function testGetEventTypes(): void
    {
        $client = static::createClient();

        $response = $client->request('GET', '/api/notification-policy/event-types', [
            'auth_bearer' => $this->token,
        ]);

        self::assertResponseIsSuccessful();
        $data = $response->toArray();

        // Expected: Anniversary, Birthday, Meeting (Alphabetical)
        self::assertCount(3, $data['member']);
        self::assertEquals('Anniversary', $data['member'][0]['text']);
        self::assertEquals('Birthday', $data['member'][1]['text']);
        self::assertEquals('Meeting', $data['member'][2]['text']);

        self::assertEquals(3, $data['totalItems']);
    }

    public function testSearchEventTypes(): void
    {
        $client = static::createClient();

        $response = $client->request('GET', '/api/notification-policy/event-types?text=Birth', [
            'auth_bearer' => $this->token,
        ]);

        self::assertResponseIsSuccessful();
        $data = $response->toArray();

        self::assertGreaterThanOrEqual(1, $data['totalItems']);
        self::assertStringContainsString('Birthday', $data['member'][0]['text']);
    }

    public function testSearchParameter(): void
    {
        $client = static::createClient();

        $response = $client->request('GET', '/api/notification-policy/event-types?search=Anniv', [
            'auth_bearer' => $this->token,
        ]);

        self::assertResponseIsSuccessful();
        $data = $response->toArray();

        self::assertCount(1, $data['member']);
        self::assertEquals('Anniversary', $data['member'][0]['text']);
    }
}
