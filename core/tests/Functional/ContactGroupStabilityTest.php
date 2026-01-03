<?php

namespace App\Tests\Functional;

class ContactGroupStabilityTest extends AbstractApiTestCase
{
    public function testGroupNameChangeDoesNotRemoveContactGroup(): void
    {
        $client = static::createClient();

        // 1. Create a Group
        $response = $client->request('POST', '/api/groups', [
            'auth_bearer' => $this->token,
            'json' => ['name' => 'Original Group Name'],
        ]);
        self::assertResponseStatusCodeSame(201);
        $groupIri = $response->toArray()['@id'];

        // 2. Create a Contact
        $response = $client->request('POST', '/api/contacts', [
            'auth_bearer' => $this->token,
            'json' => [],
        ]);
        self::assertResponseStatusCodeSame(201);
        $contactIri = $response->toArray()['@id'];

        // 3. Associate Contact with Group
        $response = $client->request('POST', '/api/contact_groups', [
            'auth_bearer' => $this->token,
            'json' => [
                'contact' => $contactIri,
                'groupResource' => $groupIri,
            ],
        ]);
        self::assertResponseStatusCodeSame(201);
        $contactGroupIri = $response->toArray()['@id'];

        // 4. Verify association exists
        $client->request('GET', $contactIri, [
            'auth_bearer' => $this->token,
        ]);
        self::assertResponseIsSuccessful();
        self::assertJsonContains([
            'contactGroups' => [
                ['groupResource' => $groupIri]
            ]
        ]);

        // 5. Change Group Name
        $client->request('PUT', $groupIri, [
            'auth_bearer' => $this->token,
            'json' => ['name' => 'Updated Group Name'],
        ]);
        self::assertResponseIsSuccessful();

        // 6. Verify association still exists on Contact
        $response = $client->request('GET', $contactIri, [
            'auth_bearer' => $this->token,
        ]);
        self::assertResponseIsSuccessful();

        // We expect the contactGroups to still contain our groupResource (even if it's expanded or just IRI)
        $data = $response->toArray();
        // var_dump($data);
        $found = false;
        foreach ($data['contactGroups'] as $cg) {
            $groupResource = $cg['groupResource'];
            $iri = is_array($groupResource) ? $groupResource['@id'] : $groupResource;
            if ($iri === $groupIri) {
                $found = true;
                // If it's expanded, let's also check the name
                if (is_array($groupResource)) {
                    self::assertSame('Updated Group Name', $groupResource['name']);
                }
                break;
            }
        }
        self::assertTrue($found, 'Contact group association was lost after group name update');

        // 7. Verify via ContactGroup resource directly
        $client->request('GET', $contactGroupIri, [
            'auth_bearer' => $this->token,
        ]);
        self::assertResponseIsSuccessful();
        self::assertJsonContains([
            'groupResource' => $groupIri
        ]);
    }
}
