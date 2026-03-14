<?php

namespace Ari\Tests\Functional;

use Ari\Entity\ApiKey;
use Ari\Entity\User;

class ApiKeyApiTest extends AbstractApiTestCase
{
    // -- LIST -----------------------------------------------------------------

    public function testListApiKeysRequiresAuth(): void
    {
        $client = static::createClient();
        $client->request('GET', '/api/api_keys');
        self::assertResponseStatusCodeSame(401);
    }

    public function testListApiKeysEmpty(): void
    {
        $client = static::createClient();
        $response = $client->request('GET', '/api/api_keys', [
            'auth_bearer' => $this->token,
        ]);

        self::assertResponseIsSuccessful();
        $data = $response->toArray();
        self::assertArrayHasKey('member', $data);
        self::assertArrayHasKey('totalItems', $data);
    }

    // -- CREATE ---------------------------------------------------------------

    public function testCreateApiKey(): void
    {
        $client = static::createClient();
        $response = $client->request('POST', '/api/api_keys', [
            'auth_bearer' => $this->token,
            'json' => [
                'name' => 'My Integration',
                'scopes' => ['contacts:read', 'contacts:write'],
            ],
        ]);

        self::assertResponseStatusCodeSame(201);
        $data = $response->toArray();

        self::assertArrayHasKey('id', $data);
        self::assertArrayHasKey('name', $data);
        self::assertArrayHasKey('scopes', $data);
        self::assertArrayHasKey('secretLastFour', $data);
        self::assertArrayHasKey('createdAt', $data);
        self::assertArrayHasKey('token', $data);

        self::assertEquals('My Integration', $data['name']);
        self::assertStringStartsWith('ari_', $data['token']);
        self::assertEquals(substr($data['token'], -4), $data['secretLastFour']);
    }

    public function testCreateApiKeyRequiresName(): void
    {
        $client = static::createClient();
        $client->request('POST', '/api/api_keys', [
            'auth_bearer' => $this->token,
            'json' => [
                'scopes' => ['*'],
            ],
        ]);

        self::assertResponseStatusCodeSame(422);
    }

    // -- GET single -----------------------------------------------------------

    public function testGetApiKey(): void
    {
        $client = static::createClient();
        $createResponse = $client->request('POST', '/api/api_keys', [
            'auth_bearer' => $this->token,
            'json' => ['name' => 'Test Key', 'scopes' => ['*']],
        ]);
        $id = $createResponse->toArray()['id'];

        $response = $client->request('GET', '/api/api_keys/' . $id, [
            'auth_bearer' => $this->token,
        ]);

        self::assertResponseIsSuccessful();
        $data = $response->toArray();
        self::assertEquals($id, $data['id']);
        // token must NOT appear in GET response
        self::assertArrayNotHasKey('token', $data);
    }

    // -- PATCH ----------------------------------------------------------------

    public function testPatchApiKey(): void
    {
        $client = static::createClient();
        $createResponse = $client->request('POST', '/api/api_keys', [
            'auth_bearer' => $this->token,
            'json' => ['name' => 'Old Name', 'scopes' => ['*']],
        ]);
        $id = $createResponse->toArray()['id'];

        $client->request('PATCH', '/api/api_keys/' . $id, [
            'auth_bearer' => $this->token,
            'headers' => ['Content-Type' => 'application/merge-patch+json'],
            'json' => ['name' => 'New Name'],
        ]);

        self::assertResponseIsSuccessful();
        $data = $client->request('GET', '/api/api_keys/' . $id, [
            'auth_bearer' => $this->token,
        ])->toArray();
        self::assertEquals('New Name', $data['name']);
    }

    // -- DELETE ---------------------------------------------------------------

    public function testDeleteApiKey(): void
    {
        $client = static::createClient();
        $createResponse = $client->request('POST', '/api/api_keys', [
            'auth_bearer' => $this->token,
            'json' => ['name' => 'To Delete', 'scopes' => ['*']],
        ]);
        $id = $createResponse->toArray()['id'];

        $client->request('DELETE', '/api/api_keys/' . $id, [
            'auth_bearer' => $this->token,
        ]);

        self::assertResponseStatusCodeSame(204);

        $client->request('GET', '/api/api_keys/' . $id, [
            'auth_bearer' => $this->token,
        ]);
        self::assertResponseStatusCodeSame(404);
    }

    // -- ISOLATION ------------------------------------------------------------

    public function testApiKeyIsolation(): void
    {
        $clientA = static::createClient();

        // Create key as User A
        $createResponse = $clientA->request('POST', '/api/api_keys', [
            'auth_bearer' => $this->token,
            'json' => ['name' => 'User A Key', 'scopes' => ['*']],
        ]);
        $id = $createResponse->toArray()['id'];

        // User B cannot GET it
        $userB = $this->createUser('api-key-b-' . bin2hex(random_bytes(4)), 'pass');
        $tokenB = $this->getToken((string) $userB->getUuid(), 'pass');

        $clientB = static::createClient();
        $clientB->request('GET', '/api/api_keys/' . $id, [
            'auth_bearer' => $tokenB,
        ]);
        // The Doctrine tenant filter hides other tenants' records → 404 (not 403),
        // which is the privacy-preserving behaviour for this resource.
        self::assertResponseStatusCodeSame(404);
    }

    // -- USE API KEY FOR AUTH -------------------------------------------------

    public function testApiKeyCanAuthenticateRequests(): void
    {
        $client = static::createClient();

        // Create an API key
        $createResponse = $client->request('POST', '/api/api_keys', [
            'auth_bearer' => $this->token,
            'json' => ['name' => 'Auth Test', 'scopes' => ['*']],
        ]);
        $rawToken = $createResponse->toArray()['token'];

        // Use it to access a protected endpoint
        $response = $client->request('GET', '/api/api_keys', [
            'headers' => ['Authorization' => 'Bearer ' . $rawToken],
        ]);

        self::assertResponseIsSuccessful();
        $data = $response->toArray();
        self::assertArrayHasKey('member', $data);
    }

    public function testInvalidApiKeyReturns401(): void
    {
        $client = static::createClient();
        $client->request('GET', '/api/api_keys', [
            'headers' => ['Authorization' => 'Bearer ari_invalidtoken1234'],
        ]);
        self::assertResponseStatusCodeSame(401);
    }
}
