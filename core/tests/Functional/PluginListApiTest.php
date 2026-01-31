<?php

namespace Ari\Tests\Functional;

class PluginListApiTest extends AbstractApiTestCase
{
    public function testGetPlugins(): void
    {
        $client = static::createClient();

        $response = $client->request('GET', '/api/plugins', [
            'auth_bearer' => $this->token,
        ]);

        self::assertResponseIsSuccessful();

        $data = $response->toArray();
        self::assertArrayHasKey('plugins', $data);
        self::assertIsArray($data['plugins']);
    }

    public function testGetPluginsRequiresAuth(): void
    {
        $client = static::createClient();

        $client->request('GET', '/api/plugins');

        self::assertResponseStatusCodeSame(401);
    }
}
