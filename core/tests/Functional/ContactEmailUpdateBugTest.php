<?php

namespace App\Tests\Functional;

class ContactEmailUpdateBugTest extends AbstractApiTestCase
{
    public function testPatchUpdatesExistingEmailAddress(): void
    {
        $client = static::createClient();

        // 1. Create a contact with an email address
        $response = $client->request('POST', '/api/contacts', [
            'auth_bearer' => $this->token,
            'json' => [
                'contactNames' => [
                    ['given' => 'Test', 'family' => 'User']
                ],
                'contactEmailAdresses' => [
                    ['value' => 'original@example.com', 'type' => 'work']
                ]
            ]
        ]);

        self::assertResponseStatusCodeSame(201);
        $contact = $response->toArray();
        $contactId = $contact['@id'];
        $emailAddress = $contact['contactEmailAdresses'][0];
        $emailId = $emailAddress['id'];
        $emailIri = $emailAddress['@id'];

        // 2. Update the email address using PATCH
        // We send the existing ID and IRI to ensure it updates instead of replaces
        $patchResponse = $client->request('PATCH', $contactId, [
            'auth_bearer' => $this->token,
            'headers' => ['Content-Type' => 'application/merge-patch+json'],
            'json' => [
                'contactEmailAdresses' => [
                    [
                        '@id' => $emailIri,
                        'id' => $emailId,
                        'value' => 'updated@example.com',
                        'type' => 'work'
                    ]
                ]
            ]
        ]);

        self::assertResponseIsSuccessful();
        $updatedContact = $patchResponse->toArray();

        // 3. Verify that the email address was updated using the same ID
        self::assertCount(
            1,
            $updatedContact['contactEmailAdresses'],
            'Should have exactly one email address'
        );

        $updatedEmail = $updatedContact['contactEmailAdresses'][0];

        // This assertion creates the failure if the bug exists (ID changes)
        self::assertSame(
            $emailId,
            $updatedEmail['id'],
            'The email ID should remain the same after update (update vs replace)'
        );
        self::assertSame('updated@example.com', $updatedEmail['value'], 'value should be updated');
    }
}
