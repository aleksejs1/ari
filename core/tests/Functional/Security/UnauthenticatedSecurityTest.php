<?php

namespace App\Tests\Functional\Security;

use ApiPlatform\Symfony\Bundle\Test\ApiTestCase;
use PHPUnit\Framework\Attributes\DataProvider;

class UnauthenticatedSecurityTest extends ApiTestCase
{
    protected static ?bool $alwaysBootKernel = true;

    #[DataProvider('apiRoutesProvider')]
    public function testApiIsBlockedForUnauthenticatedUser(string $method, string $url): void
    {
        $client = static::createClient();
        $client->request($method, $url, [
            'json' => [],
            'headers' => ['Content-Type' => 'application/ld+json'],
        ]);

        self::assertResponseStatusCodeSame(401);
    }

    /**
     * @return array<int, array{0: string, 1: string}>
     */
    public static function apiRoutesProvider(): array
    {
        return [
            // Contacts
            ['GET', '/api/contacts'],
            ['POST', '/api/contacts'],
            ['GET', '/api/contacts/1'],
            ['PUT', '/api/contacts/1'],
            ['PATCH', '/api/contacts/1'],
            ['DELETE', '/api/contacts/1'],

            // Contact Names
            ['GET', '/api/contact_names'],
            ['POST', '/api/contact_names'],
            ['GET', '/api/contact_names/1'],
            ['PUT', '/api/contact_names/1'],
            ['PATCH', '/api/contact_names/1'],
            ['DELETE', '/api/contact_names/1'],

            // Contact Dates
            ['GET', '/api/contact_dates'],
            ['POST', '/api/contact_dates'],
            ['GET', '/api/contact_dates/1'],
            ['PUT', '/api/contact_dates/1'],
            ['PATCH', '/api/contact_dates/1'],
            ['DELETE', '/api/contact_dates/1'],
        ];
    }
}
