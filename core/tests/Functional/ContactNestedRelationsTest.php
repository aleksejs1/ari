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

    /**
     * Reverse relations (owned by another contact) are read-only.
     * PUTting a contact with empty relations should NOT delete reverse relations.
     */
    public function testPutDoesNotDeleteReverseRelations(): void
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

        $contactAId = (string) $contactA->getId();
        $relId = $rel->getId();

        // 2. PUT A with empty relations — should NOT delete B's relation
        $client->request('PUT', '/api/contacts/' . $contactAId, [
            'auth_bearer' => $this->token,
            'json' => [
                'contactRelations' => [],
            ],
        ]);

        self::assertResponseIsSuccessful();

        // 3. Verify the reverse relation still exists in DB
        $em->clear();
        $relInDb = $em->find(ContactRelation::class, $relId);
        self::assertNotNull($relInDb, 'The reverse relation (owned by B) should NOT be deleted when PUTting A');

        // 4. Contact B should still have its forward relation
        $reloadedB = $em->find(Contact::class, (string) $contactB->getId());
        self::assertInstanceOf(Contact::class, $reloadedB);
        self::assertCount(1, $reloadedB->getContactRelationsCollection(), 'B should still have 1 forward relation');
    }

    /**
     * Regression test: adding a relation from B→C must NOT destroy existing A→B relation.
     *
     * Scenario:
     * 1. Contact A gets a forward relation to Contact B (type "husband")
     * 2. Contact B is PUT with a new relation to Contact C (type "spouse")
     *    — the frontend also echoes back the virtual reverse relation A→B
     * 3. After step 2, the A→B relation must still exist
     */
    public function testPutContactPreservesOtherContactsRelations(): void
    {
        $client = static::createClient();
        $container = self::getContainer();
        /** @var \Doctrine\Bundle\DoctrineBundle\Registry $doctrine */
        $doctrine = $container->get('doctrine');
        $em = $doctrine->getManager();

        $user = $em->getRepository(User::class)->findOneBy(['uuid' => $this->userUuid]);

        // 1. Create contacts A, B, C
        $contactA = new Contact();
        $contactA->setUser($user);
        $em->persist($contactA);

        $contactB = new Contact();
        $contactB->setUser($user);
        $em->persist($contactB);

        $contactC = new Contact();
        $contactC->setUser($user);
        $em->persist($contactC);

        // 2. Create forward relation A→B (type "husband")
        $relAB = new ContactRelation($contactA);
        $relAB->setPerson($contactB);
        $relAB->setType('husband');
        $contactA->addContactRelation($relAB);
        $em->persist($relAB);
        $em->flush();

        $contactAId = (string) $contactA->getId();
        $contactBId = (string) $contactB->getId();
        $contactCId = (string) $contactC->getId();
        $relABId = $relAB->getId();

        // 3. PUT Contact B: echo back the reverse relation + add new forward B→C
        $client->request('PUT', '/api/contacts/' . $contactBId, [
            'auth_bearer' => $this->token,
            'json' => [
                'contactRelations' => [
                    [
                        // This is the virtual reverse relation echoed by the frontend
                        'id' => $relABId,
                        'relatedContact' => '/api/contacts/' . $contactAId,
                        'type' => 'Wife',
                    ],
                    [
                        // New forward relation B→C
                        'relatedContact' => '/api/contacts/' . $contactCId,
                        'type' => 'spouse',
                    ],
                ],
            ],
        ]);

        self::assertResponseIsSuccessful();

        // 4. Verify the original A→B relation still exists
        $em->clear();
        $relInDb = $em->find(ContactRelation::class, $relABId);
        self::assertNotNull($relInDb, 'The A→B relation must NOT be deleted when PUTting B');
        self::assertEquals('husband', $relInDb->getType(), 'The A→B relation type should be unchanged');

        // 5. Verify Contact B now has a forward relation to C
        $reloadedB = $em->find(Contact::class, $contactBId);
        self::assertInstanceOf(Contact::class, $reloadedB);
        $bForwardRelations = $reloadedB->getContactRelationsCollection();
        self::assertCount(1, $bForwardRelations, 'B should have 1 forward relation (to C)');
        $bRel = $bForwardRelations->first();
        self::assertInstanceOf(ContactRelation::class, $bRel);
        $person = $bRel->getPerson();
        self::assertNotNull($person);
        self::assertEquals($contactCId, (string) $person->getId());
        self::assertEquals('spouse', $bRel->getType());

        // 6. Verify Contact A still has its forward relation
        $reloadedA = $em->find(Contact::class, $contactAId);
        self::assertInstanceOf(Contact::class, $reloadedA);
        $aForwardRelations = $reloadedA->getContactRelationsCollection();
        self::assertCount(1, $aForwardRelations, 'A should still have 1 forward relation (to B)');
    }

    /**
     * Test that adding a new forward relation on B works even when B already
     * has an existing forward relation.
     */
    public function testPutAddsNewForwardRelationAlongsideExisting(): void
    {
        $client = static::createClient();
        $container = self::getContainer();
        /** @var \Doctrine\Bundle\DoctrineBundle\Registry $doctrine */
        $doctrine = $container->get('doctrine');
        $em = $doctrine->getManager();

        $user = $em->getRepository(User::class)->findOneBy(['uuid' => $this->userUuid]);

        $contactA = new Contact();
        $contactA->setUser($user);
        $em->persist($contactA);

        $contactB = new Contact();
        $contactB->setUser($user);
        $em->persist($contactB);

        $contactC = new Contact();
        $contactC->setUser($user);
        $em->persist($contactC);

        // B has an existing forward relation to A
        $relBA = new ContactRelation($contactB);
        $relBA->setPerson($contactA);
        $relBA->setType('Friend');
        $contactB->addContactRelation($relBA);
        $em->persist($relBA);
        $em->flush();

        $contactBId = (string) $contactB->getId();
        $contactCId = (string) $contactC->getId();
        $relBAId = $relBA->getId();

        // PUT Contact B: keep existing B→A + add new B→C
        $client->request('PUT', '/api/contacts/' . $contactBId, [
            'auth_bearer' => $this->token,
            'json' => [
                'contactRelations' => [
                    [
                        'id' => $relBAId,
                        'relatedContact' => '/api/contacts/' . (string) $contactA->getId(),
                        'type' => 'Friend',
                    ],
                    [
                        'relatedContact' => '/api/contacts/' . $contactCId,
                        'type' => 'Colleague',
                    ],
                ],
            ],
        ]);

        self::assertResponseIsSuccessful();

        $em->clear();
        $reloadedB = $em->find(Contact::class, $contactBId);
        self::assertInstanceOf(Contact::class, $reloadedB);
        $bRelations = $reloadedB->getContactRelationsCollection();
        self::assertCount(2, $bRelations, 'B should have 2 forward relations');
    }
}
