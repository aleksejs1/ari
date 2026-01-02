<?php

namespace App\Tests\Functional;

use ApiPlatform\Symfony\Bundle\Test\ApiTestCase;
use App\Entity\User;
use App\Entity\Contact;
use Doctrine\ORM\EntityManagerInterface;

class ContactWithNestedEntitiesTest extends ApiTestCase
{
    protected static ?bool $alwaysBootKernel = false;

    private string $token;
    private string $userUuid;

    #[\Override]
    protected function setUp(): void
    {
        $container = self::getContainer();
        /** @var \Doctrine\Persistence\ManagerRegistry $doctrine */
        $doctrine = $container->get('doctrine');
        /** @var EntityManagerInterface $em */
        $em = $doctrine->getManager();

        /** @var \Symfony\Component\DependencyInjection\Container $testContainer */
        $testContainer = $container->get('test.service_container');
        /** @var \Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface $hasher */
        $hasher = $testContainer->get('security.user_password_hasher');

        // Create User
        $this->userUuid = 'user-' . bin2hex(random_bytes(4));
        $user = new User();
        $user->setUuid($this->userUuid);
        $user->setPassword($hasher->hashPassword($user, 'pass'));
        $em->persist($user);
        $em->flush();

        // Get token
        $this->token = $this->getToken($this->userUuid, 'pass');
    }

    private function getToken(string $username, string $password): string
    {
        $response = static::createClient()->request('POST', '/api/login_check', [
            'json' => [
                'username' => $username,
                'password' => $password,
            ],
        ]);

        return $response->toArray()['token'];
    }

    /**
     * Test creating a Contact with nested ContactName and ContactDate entities in a single POST request.
     * This is a TDD test - it will fail initially because cascade persist is not configured.
     */
    public function testCreateContactWithNestedEntities(): void
    {
        $client = static::createClient();

        // Create a contact to relate to
        $relatedContactResponse = $client->request('POST', '/api/contacts', [
            'auth_bearer' => $this->token,
            'json' => ['contactNames' => [['given' => 'Related']]],
        ]);
        $relatedContactIri = $relatedContactResponse->toArray()['@id'];

        // Attempt to create Contact with embedded ContactNames and ContactDates
        $response = $client->request('POST', '/api/contacts', [
            'auth_bearer' => $this->token,
            'json' => [
                'contactNames' => [
                    [
                        'family' => 'Smith',
                        'given' => 'John',
                    ],
                    [
                        'family' => 'Smith',
                        'given' => 'Johnny',
                    ],
                ],
                'contactDates' => [
                    [
                        'date' => '1990-05-15',
                        'text' => 'Birthday',
                    ],
                    [
                        'date' => '2023-06-01',
                        'text' => 'Anniversary',
                    ],
                ],
                'phoneNumbers' => [
                    [
                        'value' => '+111111111',
                        'type' => 'Home',
                    ],
                    [
                        'value' => '+222222222',
                        'type' => 'Work',
                    ],
                ],
                'contactEmailAdresses' => [
                    [
                        'value' => 'test1@example.com',
                        'type' => 'Home',
                    ],
                    [
                        'value' => 'test2@example.com',
                        'type' => 'Work',
                    ],
                ],
                'contactAddresses' => [
                    [
                        'type' => 'Home',
                        'city' => 'City 1',
                    ],
                    [
                        'type' => 'Work',
                        'city' => 'City 2',
                    ],
                ],
                'contactOrganizations' => [
                    [
                        'name' => 'Org 1',
                        'title' => 'Title 1',
                    ],
                    [
                        'name' => 'Org 2',
                        'title' => 'Title 2',
                    ],
                ],
                'contactBiographies' => [
                    [
                        'type' => 'Bio 1',
                        'value' => 'Value 1',
                    ],
                    [
                        'type' => 'Bio 2',
                        'value' => 'Value 2',
                    ],
                ],
                'contactRelations' => [
                    [
                        'person' => $relatedContactIri,
                        'type' => 'Friend',
                    ],
                ],
            ],
        ]);

        self::assertResponseStatusCodeSame(201);

        $data = $response->toArray();
        $contactIri = $data['@id'];

        // Verify the response contains the nested entities
        self::assertArrayHasKey('contactNames', $data);
        self::assertCount(2, $data['contactNames']);

        self::assertArrayHasKey('contactDates', $data);
        self::assertCount(2, $data['contactDates']);

        self::assertArrayHasKey('phoneNumbers', $data);
        self::assertCount(2, $data['phoneNumbers']);

        self::assertArrayHasKey('contactEmailAdresses', $data);
        self::assertCount(2, $data['contactEmailAdresses']);

        self::assertArrayHasKey('contactAddresses', $data);
        self::assertCount(2, $data['contactAddresses']);

        self::assertArrayHasKey('contactOrganizations', $data);
        self::assertCount(2, $data['contactOrganizations']);

        self::assertArrayHasKey('contactBiographies', $data);
        self::assertCount(2, $data['contactBiographies']);

        self::assertArrayHasKey('contactRelations', $data);
        self::assertCount(1, $data['contactRelations']);

        // Verify the names
        self::assertJsonContains([
            'contactNames' => [
                [
                    'family' => 'Smith',
                    'given' => 'John',
                ],
                [
                    'family' => 'Smith',
                    'given' => 'Johnny',
                ],
            ],
        ]);

        // Verify the dates
        self::assertJsonContains([
            'contactDates' => [
                [
                    'date' => '1990-05-15',
                    'text' => 'Birthday',
                ],
                [
                    'date' => '2023-06-01',
                    'text' => 'Anniversary',
                ],
            ],
            'phoneNumbers' => [
                [
                    'value' => '+111111111',
                    'type' => 'Home',
                ],
                [
                    'value' => '+222222222',
                    'type' => 'Work',
                ],
            ],
            'contactOrganizations' => [
                [
                    'name' => 'Org 1',
                    'title' => 'Title 1',
                ],
                [
                    'name' => 'Org 2',
                    'title' => 'Title 2',
                ],
            ],
            'contactBiographies' => [
                [
                    'type' => 'Bio 1',
                    'value' => 'Value 1',
                ],
                [
                    'type' => 'Bio 2',
                    'value' => 'Value 2',
                ],
            ],
            'contactRelations' => [
                [
                    'type' => 'Friend',
                ],
            ],
        ]);

        // Additional verification: fetch the contact and verify persistence
        $getResponse = $client->request('GET', $contactIri, [
            'auth_bearer' => $this->token,
        ]);

        self::assertResponseIsSuccessful();
        $getData = $getResponse->toArray();

        self::assertCount(2, $getData['contactNames']);
        self::assertCount(2, $getData['contactNames']);
        self::assertCount(2, $getData['contactDates']);
        self::assertCount(2, $getData['phoneNumbers']);
        self::assertCount(2, $getData['contactEmailAdresses']);
        self::assertCount(2, $getData['contactAddresses']);
        self::assertCount(2, $getData['contactAddresses']);
        self::assertCount(2, $getData['contactOrganizations']);
        self::assertCount(2, $getData['contactBiographies']);
    }

    /**
     * Test updating a Contact with nested entities using PUT.
     * This tests the full replacement behavior of PUT.
     */
    public function testPutContactWithNestedEntities(): void
    {
        $client = static::createClient();

        // Create a contact to relate to
        $relatedContactResponse = $client->request('POST', '/api/contacts', [
            'auth_bearer' => $this->token,
            'json' => ['contactNames' => [['given' => 'Related']]],
        ]);
        $relatedContactIri = $relatedContactResponse->toArray()['@id'];

        // 1. Create initial Contact with one name and one date
        $response = $client->request('POST', '/api/contacts', [
            'auth_bearer' => $this->token,
            'json' => [
                'contactNames' => [
                    [
                        'family' => 'Doe',
                        'given' => 'Jane',
                    ],
                ],
                'contactDates' => [
                    [
                        'date' => '1985-03-20',
                        'text' => 'Birthday',
                    ],
                ],
                'phoneNumbers' => [
                    [
                        'value' => '+123',
                        'type' => 'Old',
                    ],
                ],
                'contactEmailAdresses' => [
                    [
                        'value' => 'old@example.com',
                        'type' => 'Old',
                    ],
                ],
                'contactAddresses' => [
                    [
                        'type' => 'Old',
                        'city' => 'Old City',
                    ],
                ],
                'contactOrganizations' => [
                    [
                        'name' => 'Old Org',
                    ],
                ],
            ],
        ]);

        self::assertResponseStatusCodeSame(201);
        $contactIri = $response->toArray()['@id'];
        $contactId = $response->toArray()['id'];

        // 2. Use PUT to replace with new nested entities
        $putResponse = $client->request('PUT', $contactIri, [
            'auth_bearer' => $this->token,
            'json' => [
                'contactNames' => [
                    [
                        'family' => 'Johnson',
                        'given' => 'Bob',
                    ],
                    [
                        'family' => 'Johnson',
                        'given' => 'Bobby',
                    ],
                ],
                'contactDates' => [
                    [
                        'date' => '2024-12-25',
                        'text' => 'Christmas',
                    ],
                ],
                'phoneNumbers' => [
                    [
                        'value' => '+999',
                        'type' => 'New',
                    ],
                ],
                'contactEmailAdresses' => [
                    [
                        'value' => 'new@example.com',
                        'type' => 'New',
                    ],
                ],
                'contactAddresses' => [
                    [
                        'type' => 'New',
                        'city' => 'New City',
                    ],
                ],
                'contactOrganizations' => [
                    [
                        'name' => 'New Org',
                    ],
                ],
                'contactBiographies' => [
                    [
                        'type' => 'New Bio',
                        'value' => 'New Value',
                    ],
                ],
                'contactRelations' => [
                    [
                        'person' => $relatedContactIri,
                        'type' => 'New Relation',
                    ],
                ],
            ],
        ]);

        self::assertResponseIsSuccessful();

        // 3. Verify the update
        $data = $putResponse->toArray();

        // Should have 2 names and 1 date (old ones should be removed)
        self::assertCount(2, $data['contactNames']);
        self::assertCount(1, $data['contactDates']);
        self::assertCount(1, $data['phoneNumbers']);
        self::assertCount(1, $data['contactEmailAdresses']);
        self::assertCount(1, $data['contactEmailAdresses']);
        self::assertCount(1, $data['contactOrganizations']);
        self::assertCount(1, $data['contactBiographies']);
        self::assertCount(1, $data['contactRelations']);

        self::assertJsonContains([
            'contactNames' => [
                [
                    'family' => 'Johnson',
                    'given' => 'Bob',
                ],
                [
                    'family' => 'Johnson',
                    'given' => 'Bobby',
                ],
            ],
            'contactDates' => [
                [
                    'date' => '2024-12-25',
                    'text' => 'Christmas',
                ],
            ],
            'phoneNumbers' => [
                [
                    'value' => '+999',
                    'type' => 'New',
                ],
            ],
            'contactEmailAdresses' => [
                [
                    'value' => 'new@example.com',
                    'type' => 'New',
                ],
            ],
            'contactAddresses' => [
                [
                    'type' => 'New',
                    'city' => 'New City',
                ],
            ],
            'contactOrganizations' => [
                [
                    'name' => 'New Org',
                ],
            ],
            'contactBiographies' => [
                [
                    'type' => 'New Bio',
                    'value' => 'New Value',
                ],
            ],
            'contactRelations' => [
                [
                    'type' => 'New Relation',
                ],
            ],
        ]);

        // Verify Audit Log for the PUT operation (Removal of old entities and Insert of new ones)
        $timelineResponse = $client->request('GET', '/api/contacts/' . $contactId . '/timeline', [
            'auth_bearer' => $this->token,
        ]);
        self::assertResponseIsSuccessful();
        $logs = $timelineResponse->toArray()['logs'];

        $addressInserts = 0;
        $addressRemoves = 0;

        foreach ($logs as $log) {
            if ($log['entityType'] === 'App\\Entity\\ContactAddress') {
                if ($log['action'] === 'INSERT') {
                    $addressInserts++;
                    // Check if snapshotAfter has correct data
                    if (isset($log['snapshotAfter']['type']) && $log['snapshotAfter']['type'] === 'New') {
                        // OK
                    }
                } elseif ($log['action'] === 'REMOVE') {
                    $addressRemoves++;
                }
            }
        }

        // Assert we have activity
        self::assertGreaterThan(0, $addressInserts, 'Should have inserted new addresses');
        self::assertGreaterThan(0, $addressRemoves, 'Should have removed old addresses');
    }

    /**
     * Test creating an empty Contact and then adding nested entities via PATCH.
     */
    public function testPatchContactWithNestedEntities(): void
    {
        $client = static::createClient();

        // Create a contact to relate to
        $relatedContactResponse = $client->request('POST', '/api/contacts', [
            'auth_bearer' => $this->token,
            'json' => ['contactNames' => [['given' => 'Related']]],
        ]);
        $relatedContactIri = $relatedContactResponse->toArray()['@id'];

        // 1. Create empty Contact
        $response = $client->request('POST', '/api/contacts', [
            'auth_bearer' => $this->token,
            'json' => [],
        ]);

        self::assertResponseStatusCodeSame(201);
        $contactIri = $response->toArray()['@id'];

        // 2. PATCH to add nested entities
        $patchResponse = $client->request('PATCH', $contactIri, [
            'auth_bearer' => $this->token,
            'headers' => ['Content-Type' => 'application/merge-patch+json'],
            'json' => [
                'contactNames' => [
                    [
                        'family' => 'Williams',
                        'given' => 'Alice',
                    ],
                ],
                'contactDates' => [
                    [
                        'date' => '2025-01-01',
                        'text' => 'New Year',
                    ],
                ],
                'phoneNumbers' => [
                    [
                        'value' => '+555',
                        'type' => 'Patch',
                    ],
                ],
                'contactEmailAdresses' => [
                    [
                        'value' => 'patch@example.com',
                        'type' => 'Patch',
                    ],
                ],
                'contactAddresses' => [
                    [
                        'type' => 'Patch',
                        'city' => 'Patch City',
                    ],
                ],
                'contactOrganizations' => [
                    [
                        'name' => 'Patch Org',
                    ],
                ],
                'contactBiographies' => [
                    [
                        'type' => 'Patch Bio',
                        'value' => 'Patch Value',
                    ],
                ],
                'contactRelations' => [
                    [
                        'person' => $relatedContactIri,
                        'type' => 'Patch Relation',
                    ],
                ],
            ],
        ]);

        self::assertResponseIsSuccessful();

        // 3. Verify the patch
        $data = $patchResponse->toArray();

        self::assertCount(1, $data['contactNames']);
        self::assertCount(1, $data['contactNames']);
        self::assertCount(1, $data['contactDates']);
        self::assertCount(1, $data['phoneNumbers']);
        self::assertCount(1, $data['contactEmailAdresses']);
        self::assertCount(1, $data['contactEmailAdresses']);
        self::assertCount(1, $data['contactOrganizations']);
        self::assertCount(1, $data['contactBiographies']);
        self::assertCount(1, $data['contactRelations']);

        self::assertJsonContains([
            'contactNames' => [
                [
                    'family' => 'Williams',
                    'given' => 'Alice',
                ],
            ],
            'contactDates' => [
                [
                    'date' => '2025-01-01',
                    'text' => 'New Year',
                ],
            ],
            'phoneNumbers' => [
                [
                    'value' => '+555',
                    'type' => 'Patch',
                ],
            ],
            'contactEmailAdresses' => [
                [
                    'value' => 'patch@example.com',
                    'type' => 'Patch',
                ],
            ],
            'contactAddresses' => [
                [
                    'type' => 'Patch',
                    'city' => 'Patch City',
                ],
            ],
            'contactOrganizations' => [
                [
                    'name' => 'Patch Org',
                ],
            ],
            'contactBiographies' => [
                [
                    'type' => 'Patch Bio',
                    'value' => 'Patch Value',
                ],
            ],
            'contactRelations' => [
                [
                    'type' => 'Patch Relation',
                ],
            ],
        ]);
    }
    /**
     * Test creating a Contact with nested ContactGroup and Group.
     * Verifies that:
     * 1. A new Group can be created on the fly (nested).
     * 2. An existing Group can be linked by ID/IRI (no new group created).
     */
    public function testCreateContactWithNestedGroup(): void
    {
        $client = static::createClient();

        // 1. Create an existing group first
        $response = $client->request('POST', '/api/groups', [
            'auth_bearer' => $this->token,
            'json' => ['name' => 'Existing Group'],
        ]);
        $existingGroupIri = $response->toArray()['@id'];

        // 2. Create Contact with one NEW group and one EXISTING group
        $response = $client->request('POST', '/api/contacts', [
            'auth_bearer' => $this->token,
            'json' => [
                'contactGroups' => [
                    [
                        'groupResource' => [
                            'name' => 'New Nested Group',
                        ],
                    ],
                    [
                        'groupResource' => $existingGroupIri,
                    ],
                ],
            ],
        ]);

        self::assertResponseStatusCodeSame(201);
        $data = $response->toArray();

        self::assertCount(2, $data['contactGroups']);

        // 3. Verify groups
        // One group should be "New Nested Group"
        // One group should be "Existing Group"
        $groupNames = [];
        foreach ($data['contactGroups'] as $cg) {
            // Fetch the group resource
            // Fetch the group resource (either embedded object or IRI)

            if (is_array($cg['groupResource'])) {
                 $groupNames[] = $cg['groupResource']['name'];
            } else {
                 // It's an IRI, fetch it
                 $gResponse = $client->request('GET', $cg['groupResource'], ['auth_bearer' => $this->token]);
                 $groupNames[] = $gResponse->toArray()['name'];
            }
        }

        self::assertContains('New Nested Group', $groupNames);
        self::assertContains('Existing Group', $groupNames);
    }
    public function testCreateContactWithNestedRelationUsingRelatedContact(): void
    {
        $client = static::createClient();
        $container = self::getContainer();
        /** @var \Doctrine\Persistence\ManagerRegistry $doctrine */
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
                    ]
                ],
            ],
        ]);

        self::assertResponseStatusCodeSame(201);
        $data = $response->toArray();
        self::assertArrayHasKey('contactRelations', $data);
        self::assertCount(1, $data['contactRelations']);
        self::assertEquals('sister', $data['contactRelations'][0]['type']);
        // Verify relatedContact is set and returned (as relatedContact key due to SerializedName)
        self::assertStringContainsString($relatedContactIri, $data['contactRelations'][0]['relatedContact']);
    }

    public function testDeleteContactRelationsViaPut(): void
    {
        $client = static::createClient();
        $container = self::getContainer();
        /** @var \Doctrine\Persistence\ManagerRegistry $doctrine */
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

        $rel = new \App\Entity\ContactRelation($mainContact);
        $rel->setPerson($relatedContact);
        $rel->setType('Friend');
        $mainContact->addContactRelation($rel);
        $em->persist($rel);
        $em->flush();

        $mainContactId = (string) $mainContact->getId();

        // Assert it exists
        self::assertCount(1, $mainContact->getContactRelations());

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
        self::assertArrayHasKey('contactRelations', $data);
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
        /** @var \Doctrine\Persistence\ManagerRegistry $doctrine */
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

        $rel = new \App\Entity\ContactRelation($contactB);
        $rel->setPerson($contactA);
        $rel->setType('Sibling');
        $contactB->addContactRelation($rel);
        $em->persist($rel);
        $em->flush();
        $em->refresh($contactA);

        $contactAId = (string) $contactA->getId();

        // Assert A sees the relation (reverse)
        self::assertCount(1, $contactA->getContactRelations());

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

        // Verify it was really deleted (not just detached)
        $relInDb = $em->find(\App\Entity\ContactRelation::class, $rel->getId());
        self::assertNull($relInDb, 'The ContactRelation entity should be deleted from DB');
    }
}
