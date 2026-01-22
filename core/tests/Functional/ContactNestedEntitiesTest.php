<?php

namespace App\Tests\Functional;

class ContactNestedEntitiesTest extends AbstractApiTestCase
{
    /**
     * Test creating a Contact with nested ContactName and ContactDate entities in a single POST request.
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
                'contactInteractions' => [
                    [
                        'type' => 'call',
                        'description' => 'First call',
                        'timestamp' => '2023-10-01T10:00:00+00:00',
                    ],
                    [
                        'type' => 'meeting',
                        'description' => 'Lunch',
                        'timestamp' => '2023-10-02T12:00:00+00:00',
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

        self::assertArrayHasKey('contactInteractions', $data);
        self::assertCount(2, $data['contactInteractions']);

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
            'contactInteractions' => [
                [
                    'type' => 'call',
                    'description' => 'First call',
                    'timestamp' => '2023-10-01T10:00:00+00:00',
                ],
                [
                    'type' => 'meeting',
                    'description' => 'Lunch',
                    'timestamp' => '2023-10-02T12:00:00+00:00',
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
        self::assertCount(2, $getData['contactDates']);
        self::assertCount(2, $getData['phoneNumbers']);
        self::assertCount(2, $getData['contactEmailAdresses']);
        self::assertCount(2, $getData['contactAddresses']);
        self::assertCount(2, $getData['contactOrganizations']);
        self::assertCount(2, $getData['contactBiographies']);
        self::assertCount(2, $getData['contactInteractions']);
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
                'contactInteractions' => [
                    [
                        'type' => 'email',
                        'description' => 'Follow up',
                        'timestamp' => '2025-01-01T09:00:00+00:00',
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
        self::assertCount(1, $data['contactOrganizations']);
        self::assertCount(1, $data['contactBiographies']);
        self::assertCount(1, $data['contactRelations']);
        self::assertCount(1, $data['contactInteractions']);

        self::assertJsonContains([
            'contactNames' => [
                1 => [ // ID is because of Collections
                    'family' => 'Johnson',
                    'given' => 'Bob',
                ],
                2 => [ // ID is because of Collections
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
            'contactInteractions' => [
                [
                    'type' => 'email',
                    'description' => 'Follow up',
                    'timestamp' => '2025-01-01T09:00:00+00:00',
                ],
            ],
        ]);

        // Verify Audit Log for the PUT operation
        $timelineResponse = $client->request('GET', '/api/contacts/' . $contactId . '/timeline', [
            'auth_bearer' => $this->token,
        ]);
        self::assertResponseIsSuccessful();
        $logs = $timelineResponse->toArray()['logs'];

        $addressInserts = 0;
        $addressRemoves = 0;
        $addressUpdates = 0;

        foreach ($logs as $log) {
            if ('App\\Entity\\ContactAddress' === $log['entityType']) {
                if ('INSERT' === $log['action']) {
                    ++$addressInserts;
                } elseif ('REMOVE' === $log['action']) {
                    ++$addressRemoves;
                } elseif ('UPDATE' === $log['action']) {
                    ++$addressUpdates;
                }
            }
        }

        self::assertEquals(1, $addressInserts, 'Should have inserted 1 new address');
        self::assertEquals(0, $addressRemoves, 'Should not have removed old addresses');
        self::assertEquals(1, $addressUpdates, 'Should have updated 1 address');
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
                'contactInteractions' => [
                    [
                        'type' => 'note',
                        'description' => 'Patch Note',
                        'timestamp' => '2025-02-01T08:00:00+00:00',
                    ],
                ],
            ],
        ]);

        self::assertResponseIsSuccessful();

        // 3. Verify the patch
        $data = $patchResponse->toArray();

        self::assertCount(1, $data['contactNames']);
        self::assertCount(1, $data['contactDates']);
        self::assertCount(1, $data['phoneNumbers']);
        self::assertCount(1, $data['contactEmailAdresses']);
        self::assertCount(1, $data['contactOrganizations']);
        self::assertCount(1, $data['contactBiographies']);
        self::assertCount(1, $data['contactRelations']);
        self::assertCount(1, $data['contactInteractions']);

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
            'contactInteractions' => [
                [
                    'type' => 'note',
                    'description' => 'Patch Note',
                    'timestamp' => '2025-02-01T08:00:00+00:00',
                ],
            ],
        ]);
    }
}
