<?php

namespace Ari\Tests\Functional;

use Ari\Entity\Contact;
use Ari\Entity\ContactRelation;
use Ari\Entity\User;

class ContactNestedRelationsTest extends AbstractApiTestCase
{
    public function testCreateContactWithNestedRelationUsingRelatedContact(): void
    {
        $client = static::createClient();
        $container = self::getContainer();
        /** @var \Doctrine\Bundle\DoctrineBundle\Registry $doctrine */
        $doctrine = $container->get('doctrine');
        $em = $doctrine->getManager();

        // Find the user created in setUp
        $user = $em->getRepository(User::class)->findOneBy(['uuid' => $this->userUuid]);

        // Create a separate contact to be related
        $relatedContact = new Contact();
        $relatedContact->setUser($user);
        $em->persist($relatedContact);
        $em->flush();
        $relatedContactIri = '/api/contacts/' . (string) $relatedContact->getId();

        $response = $client->request('POST', '/api/contacts', [
            'auth_bearer' => $this->token,
            'json' => [
                'contactRelations' => [
                    [
                        'relatedContact' => $relatedContactIri,
                        'type' => 'sister',
                    ],
                ],
            ],
        ]);

        self::assertResponseStatusCodeSame(201);
        $data = $response->toArray();
        self::assertArrayHasKey('contactRelations', $data);
        self::assertCount(1, $data['contactRelations']);
        self::assertEquals('sister', $data['contactRelations'][0]['type']);
        self::assertStringContainsString($relatedContactIri, $data['contactRelations'][0]['relatedContact']);
    }

    public function testDeleteContactRelationsViaPut(): void
    {
        $client = static::createClient();
        $container = self::getContainer();
        /** @var \Doctrine\Bundle\DoctrineBundle\Registry $doctrine */
        $doctrine = $container->get('doctrine');
        $em = $doctrine->getManager();

        $user = $em->getRepository(User::class)->findOneBy(['uuid' => $this->userUuid]);

        // 1. Create a contact with a relation
        $relatedContact = new Contact();
        $relatedContact->setUser($user);
        $em->persist($relatedContact);

        $mainContact = new Contact();
        $mainContact->setUser($user);
        $em->persist($mainContact);

        $rel = new ContactRelation($mainContact);
        $rel->setPerson($relatedContact);
        $rel->setType('Friend');
        $mainContact->addContactRelation($rel);
        $em->persist($rel);
        $em->flush();

        $mainContactId = (string) $mainContact->getId();

        // 2. PUT with empty relations
        $response = $client->request('PUT', '/api/contacts/' . $mainContactId, [
            'auth_bearer' => $this->token,
            'json' => [
                'displayName' => 'Updated Name',
                'contactRelations' => [],
            ],
        ]);

        self::assertResponseIsSuccessful();
        $data = $response->toArray();
        self::assertCount(0, $data['contactRelations'], 'Contact relations should be empty after PUT');

        // 3. Verify in DB
        $em->clear();
        $reloaded = $em->find(Contact::class, $mainContactId);
        self::assertInstanceOf(Contact::class, $reloaded);
        self::assertCount(0, $reloaded->getContactRelations(), 'DB should have 0 relations for this contact');
    }

    public function testDeleteReverseContactRelationsViaPut(): void
    {
        $client = static::createClient();
        $container = self::getContainer();
        /** @var \Doctrine\Bundle\DoctrineBundle\Registry $doctrine */
        $doctrine = $container->get('doctrine');
        $em = $doctrine->getManager();

        $user = $em->getRepository(User::class)->findOneBy(['uuid' => $this->userUuid]);

        // 1. Create a relation owned by B, where A is the person
        $contactB = new Contact();
        $contactB->setUser($user);
        $em->persist($contactB);

        $contactA = new Contact();
        $contactA->setUser($user);
        $em->persist($contactA);

        $rel = new ContactRelation($contactB);
        $rel->setPerson($contactA);
        $rel->setType('Sibling');
        $contactB->addContactRelation($rel);
        $em->persist($rel);
        $em->flush();
        $em->refresh($contactA);

        $contactAId = (string) $contactA->getId();

        // 2. PUT A with empty relations
        $response = $client->request('PUT', '/api/contacts/' . $contactAId, [
            'auth_bearer' => $this->token,
            'json' => [
                'contactRelations' => [],
            ],
        ]);

        self::assertResponseIsSuccessful();
        $data = $response->toArray();
        self::assertCount(0, $data['contactRelations'], 'Contact relations should be empty after PUT on A');

        // 3. Verify in DB
        $em->clear();
        $reloadedA = $em->find(Contact::class, $contactAId);
        self::assertInstanceOf(Contact::class, $reloadedA);
        self::assertCount(0, $reloadedA->getContactRelations(), 'DB should have 0 relations for contact A');

        // Verify it was really deleted
        $relInDb = $em->find(ContactRelation::class, $rel->getId());
        self::assertNull($relInDb, 'The ContactRelation entity should be deleted from DB');
    }

    public function testPromoteReverseRelationToForwardViaPut(): void
    {
        $client = static::createClient();
        $container = self::getContainer();
        /** @var \Doctrine\Bundle\DoctrineBundle\Registry $doctrine */
        $doctrine = $container->get('doctrine');
        $em = $doctrine->getManager();

        $user = $em->getRepository(User::class)->findOneBy(['uuid' => $this->userUuid]);

        // 1. Setup: Contact A and Contact B
        $contactA = new Contact();
        $contactA->setUser($user);
        $em->persist($contactA);

        $contactB = new Contact();
        $contactB->setUser($user);
        $em->persist($contactB);

        // Relation: A is Father of B (A owns the relation)
        $relAB = new ContactRelation($contactA);
        $relAB->setPerson($contactB);
        $relAB->setType('Father');
        $contactA->addContactRelation($relAB);
        $em->persist($relAB);
        $em->flush();

        $contactAId = (string) $contactA->getId();
        $contactBId = (string) $contactB->getId();
        $originalRelId = $relAB->getId();

        // 2. PUT B with contactRelations: [{"relatedContact": "/api/contacts/A", "type": "Son"}]
        $response = $client->request('PUT', '/api/contacts/' . $contactBId, [
            'auth_bearer' => $this->token,
            'json' => [
                'contactRelations' => [
                    [
                        'relatedContact' => '/api/contacts/' . $contactAId,
                        'type' => 'Son',
                    ],
                ],
            ],
        ]);

        self::assertResponseIsSuccessful();
        $data = $response->toArray();

        self::assertCount(1, $data['contactRelations']);
        self::assertEquals('Son', $data['contactRelations'][0]['type']);

        // 3. Verify in DB
        $em->clear();
        $reloadedA = $em->find(Contact::class, $contactAId);
        $reloadedB = $em->find(Contact::class, $contactBId);

        self::assertInstanceOf(Contact::class, $reloadedA);
        self::assertInstanceOf(Contact::class, $reloadedB);

        // B now owns the relation
        $bRelations = $reloadedB->getContactRelationsCollection();
        self::assertCount(1, $bRelations, 'B should have 1 relation');
        $firstRel = $bRelations->first();
        self::assertInstanceOf(ContactRelation::class, $firstRel);
        self::assertEquals('Son', $firstRel->getType());

        // A should have NO forward relations anymore
        self::assertCount(0, $reloadedA->getContactRelationsCollection(), 'A should have 0 FORWARD relations');

        // The original relation should be gone
        $oldRel = $em->find(ContactRelation::class, $originalRelId);
        self::assertNull($oldRel, 'The original relation (A->B) should be deleted');
    }
}
