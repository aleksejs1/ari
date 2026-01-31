<?php

namespace Ari\Tests\Functional;

class ContactNestedGroupsTest extends AbstractApiTestCase
{
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
        $groupNames = [];
        foreach ($data['contactGroups'] as $cg) {
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
}
