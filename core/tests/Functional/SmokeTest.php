<?php

namespace App\Tests\Functional;

use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;

class SmokeTest extends WebTestCase
{
    public function testApiDocsIsSuccessful(): void
    {
        $client = static::createClient();
        $client->request('GET', '/api/docs');

        self::assertResponseIsSuccessful();
    }
}
