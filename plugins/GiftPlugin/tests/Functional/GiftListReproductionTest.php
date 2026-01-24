<?php

namespace Plugins\GiftPlugin\Tests\Functional;

use App\Tests\Functional\AbstractApiTestCase;

class GiftListReproductionTest extends AbstractApiTestCase
{
    public function testCreateGiftListWithExactPayload(): void
    {
        // 1. Authentication
        $user = 'repro@example.com';
        $this->createUser($user, 'password');
        $token = $this->getToken($user, 'password');

        // 2. Exact Payload from User Report
        $payload = [
            "name" => "qqq",
            "description" => "qwe",
            "eventDate" => "2026-01-13"
        ];

        $client = self::createClient();
        $client->request('POST', '/api/gift_lists', [
            'headers' => ['Authorization' => 'Bearer ' . $token],
            'json' => $payload,
        ]);

        static::assertResponseStatusCodeSame(201);
    }
}
