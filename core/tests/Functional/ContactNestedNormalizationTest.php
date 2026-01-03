<?php

namespace App\Tests\Functional;

class ContactNestedNormalizationTest extends AbstractApiTestCase
{
    public function testNestedEmptyStringToNullNormalization(): void
    {
        $client = static::createClient();

        // 1. Create Contact with nested entities containing empty strings
        $response = $client->request('POST', '/api/contacts', [
            'auth_bearer' => $this->token,
            'json' => [
                'contactNames' => [
                    [
                        'family' => '',
                        'given' => '',
                    ],
                ],
                'phoneNumbers' => [
                    [
                        'value' => '',
                        'type' => '',
                    ],
                ],
                'contactEmailAdresses' => [
                    [
                        'value' => '',
                        'type' => '',
                    ],
                ],
                'contactAddresses' => [
                    [
                        'type' => '',
                        'street' => '',
                        'city' => '',
                    ],
                ],
            ],
        ]);

        self::assertResponseStatusCodeSame(201);
        $data = $response->toArray();

        // Verify all nested fields are null (normalized from "")
        self::assertNull($data['contactNames'][0]['family']);
        self::assertNull($data['contactNames'][0]['given']);
        self::assertNull($data['phoneNumbers'][0]['value']);
        self::assertNull($data['phoneNumbers'][0]['type']);
        self::assertNull($data['contactEmailAdresses'][0]['value']);
        self::assertNull($data['contactEmailAdresses'][0]['type']);
        self::assertNull($data['contactAddresses'][0]['type']);
        self::assertNull($data['contactAddresses'][0]['street']);
        self::assertNull($data['contactAddresses'][0]['city']);
    }
}
