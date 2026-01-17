<?php

namespace App\Tests\Functional\Controller;

use ApiPlatform\Symfony\Bundle\Test\ApiTestCase;

class DemoAccountActionTest extends ApiTestCase
{
    protected static ?bool $alwaysBootKernel = true;

    public function testGenerateDemoAccount(): void
    {
        $client = static::createClient();

        $response = $client->request('POST', '/api/demo-account');

        self::assertResponseStatusCodeSame(201);
        self::assertResponseHeaderSame('content-type', 'application/json');

        $content = $response->toArray();

        self::assertArrayHasKey('username', $content);
        self::assertNotEmpty($content['username']);
        // It seems it returns a UUID
        self::assertTrue(
             \Symfony\Component\Uid\Uuid::isValid($content['username']) 
             || str_starts_with($content['username'], 'demo_'),
             'Username should be a UUID or start with demo_'
        );
    }
}
