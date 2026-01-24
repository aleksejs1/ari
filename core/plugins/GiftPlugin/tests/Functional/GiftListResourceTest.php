<?php

namespace Plugins\GiftPlugin\Tests\Functional;

use App\Tests\Functional\AbstractApiTestCase;

class GiftListResourceTest extends AbstractApiTestCase
{
    public function testCreateAndReadGiftList(): void
    {
        // 1. Authentication (User A)
        $userA = 'userA@example.com';
        $this->createUser($userA, 'password');
        $tokenA = $this->getToken($userA, 'password');

        // 2. Create Gift List
        $client = self::createClient();
        $client->request('POST', '/api/gift_lists', [
            'headers' => ['Authorization' => 'Bearer ' . $tokenA],
            'json' => [
                'name' => 'My Wishlist',
                'description' => 'For my birthday',
                'eventDate' => '2026-05-20',
            ],
        ]);

        static::assertResponseStatusCodeSame(201);
        static::assertJsonContains([
            'name' => 'My Wishlist',
            'description' => 'For my birthday',
        ]);

        $response = $client->getResponse();
        if (null === $response) {
            static::fail('Response is null');
        }
        $responseData = $response->toArray();
        static::assertArrayHasKey('id', $responseData);
        $giftListId = $responseData['id'];

        // 3. Verify Isolation (User B)
        $userB = 'userB@example.com';
        $this->createUser($userB, 'password');
        $tokenB = $this->getToken($userB, 'password');

        $client = self::createClient();
        $client->request('GET', '/api/gift_lists/' . $giftListId, [
            'headers' => ['Authorization' => 'Bearer ' . $tokenB],
        ]);

        // User B should not see User A's gift list
        static::assertResponseStatusCodeSame(404);
    }
}
