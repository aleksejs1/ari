<?php

namespace App\Tests\Functional;

class ContactGroupUpdateTest extends AbstractApiTestCase
{
    /**
     * @psalm-suppress InternalMethod
     */
    public function testContactGroupUpdatePreservesAssociation(): void
    {
        $client = static::createClient();

        // 1. Create a Group
        $response = $client->request('POST', '/api/groups', [
            'auth_bearer' => $this->token,
            'json' => ['name' => 'Test Group'],
        ]);
        self::assertResponseStatusCodeSame(201);
        $groupIri = $response->toArray()['@id'];

        // 2. Create a Contact with that Group
        $response = $client->request('POST', '/api/contacts', [
            'auth_bearer' => $this->token,
            'json' => [
                'contactGroups' => [
                    ['groupResource' => $groupIri],
                ],
            ],
        ]);
        self::assertResponseStatusCodeSame(201);
        $contactData = $response->toArray();
        $contactIri = $contactData['@id'];

        // 3. Update the Contact with the same Group data (simulating frontend behavior)
        // The frontend sends the groupResource but not the ContactGroup ID
        $initialContactGroups = (array) $contactData['contactGroups'];
        foreach ($initialContactGroups as &$groupData) {
            unset($groupData['@id'], $groupData['id']);
        }
        unset($groupData);

        self::assertArrayHasKey(0, $initialContactGroups);
        $initialContactGroupId = $contactData['contactGroups'][0]['@id']; // This should be the ContactGroup IRI

        // 3. Update the Contact with the same payload (simulate PUT)
        // We reuse the 'contactGroups' data which should cause issues if not handled correctly.
        $client->request('PUT', $contactIri, [
            'auth_bearer' => $this->token,
            'json' => [
                'contactGroups' => $initialContactGroups,
            ],
        ]);

        self::assertResponseIsSuccessful();
        $response = $client->getResponse();

        if (null === $response) {
            self::fail('Response is null');
        }

        $updatedContactData = $response->toArray();

        self::assertArrayHasKey('contactGroups', $updatedContactData);
        $updatedContactGroups = $updatedContactData['contactGroups'];
        self::assertIsArray($updatedContactGroups);
        self::assertCount(1, $updatedContactGroups);
        self::assertArrayHasKey(0, $updatedContactGroups);

        // Use assertion to check if the IRI is exactly the same
        self::assertSame(
            $initialContactGroupId,
            $updatedContactGroups[0]['@id'],
            'ContactGroup IRI changed, implying deletion and recreation.'
        );
    }
}
