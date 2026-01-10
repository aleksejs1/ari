<?php

namespace App\Tests\Functional;

use App\Entity\User;
use App\Entity\UserPref;
use PHPUnit\Framework\Attributes\CoversClass;

#[CoversClass(UserPref::class)]
class UserPrefApiTest extends AbstractApiTestCase
{
    private function createAnotherUserToken(): string
    {
        $uniqueId = uniqid();
        $user = new User();
        $user->setUuid($uniqueId);

        /** @var \Symfony\Component\PasswordHasher\Hasher\UserPasswordHasher $hasher */
        $hasher = self::getContainer()->get('security.user_password_hasher');
        $user->setPassword(
            $hasher->hashPassword($user, 'password'),
        );

        /** @var \Doctrine\Bundle\DoctrineBundle\Registry $doctrine */
        $doctrine = self::getContainer()->get('doctrine');
        $em = $doctrine->getManager();
        $em->persist($user);
        $em->flush();

        $client = static::createClient();
        $response = $client->request('POST', '/api/login_check', [
            'json' => [
                'username' => $uniqueId,
                'password' => 'password',
            ],
        ]);

        return $response->toArray()['token'];
    }

    public function testGetDefaultLanguage(): void
    {
        $client = static::createClient();

        $response = $client->request('GET', '/api/user_prefs/language', [
            'auth_bearer' => $this->token,
        ]);

        self::assertResponseIsSuccessful();
        $data = $response->toArray();
        self::assertEquals('language', $data['type']);
        self::assertEquals('en', $data['value']); // Default
    }

    public function testGetDefaultDateFormat(): void
    {
        $client = static::createClient();

        $response = $client->request('GET', '/api/user_prefs/dateFormat', [
            'auth_bearer' => $this->token,
        ]);

        self::assertResponseIsSuccessful();
        $data = $response->toArray();
        self::assertEquals('dateFormat', $data['type']);
        self::assertEquals('mm/dd/yyyy', $data['value']); // Default
    }

    public function testGetDefaultFavouriteGroupName(): void
    {
        $client = static::createClient();

        $response = $client->request('GET', '/api/user_prefs/favourite_group_name', [
            'auth_bearer' => $this->token,
        ]);

        self::assertResponseIsSuccessful();
        $data = $response->toArray();
        self::assertEquals('favourite_group_name', $data['type']);
        self::assertEquals('favourite', $data['value']); // Default
    }

    public function testUpdateLanguage(): void
    {
        $client = static::createClient();

        // 1. Update to 'ru'
        $response = $client->request('PATCH', '/api/user_prefs/language', [
            'auth_bearer' => $this->token,
            'headers' => ['Content-Type' => 'application/merge-patch+json'],
            'json' => [
                'type' => 'language',
                'value' => 'ru',
            ],
        ]);
        self::assertResponseIsSuccessful();
        $data = $response->toArray();
        self::assertEquals('ru', $data['value']);

        // 2. persist check (GET)
        $response = $client->request('GET', '/api/user_prefs/language', [
            'auth_bearer' => $this->token,
        ]);
        $data = $response->toArray();
        self::assertEquals('ru', $data['value']);
    }

    public function testUpdateDateFormat(): void
    {
        $client = static::createClient();

        // 1. Update to 'dd.mm.yyyy'
        $response = $client->request('PATCH', '/api/user_prefs/dateFormat', [
            'auth_bearer' => $this->token,
            'headers' => ['Content-Type' => 'application/merge-patch+json'],
            'json' => [
                'type' => 'dateFormat',
                'value' => 'dd.mm.yyyy',
            ],
        ]);
        self::assertResponseIsSuccessful();
        $data = $response->toArray();
        self::assertEquals('dd.mm.yyyy', $data['value']);

        // 2. persist check
        $response = $client->request('GET', '/api/user_prefs/dateFormat', [
            'auth_bearer' => $this->token,
        ]);
        $data = $response->toArray();
        self::assertEquals('dd.mm.yyyy', $data['value']);
    }

    public function testUpdateFavouriteGroupName(): void
    {
        $client = static::createClient();

        // 1. Update to 'My Favourites'
        $response = $client->request('PATCH', '/api/user_prefs/favourite_group_name', [
            'auth_bearer' => $this->token,
            'headers' => ['Content-Type' => 'application/merge-patch+json'],
            'json' => [
                'type' => 'favourite_group_name',
                'value' => 'My Favourites',
            ],
        ]);
        self::assertResponseIsSuccessful();
        $data = $response->toArray();
        self::assertEquals('My Favourites', $data['value']);

        // 2. persist check
        $response = $client->request('GET', '/api/user_prefs/favourite_group_name', [
            'auth_bearer' => $this->token,
        ]);
        $data = $response->toArray();
        self::assertEquals('My Favourites', $data['value']);
    }

    public function testInvalidTypeReturns404(): void
    {
        $client = static::createClient();
        $client->request('GET', '/api/user_prefs/invalid_type', [
            'auth_bearer' => $this->token,
        ]);
        self::assertResponseStatusCodeSame(404);
    }

    public function testInvalidValueReturnsViolation(): void
    {
        $client = static::createClient();
        $client->request('PATCH', '/api/user_prefs/language', [
            'auth_bearer' => $this->token,
            'headers' => ['Content-Type' => 'application/merge-patch+json'],
            'json' => [
                'type' => 'language',
                'value' => 'de', // Invalid
            ],
        ]);
        self::assertResponseStatusCodeSame(422);
    }

    public function testDeleteRevertsToDefault(): void
    {
        $client = static::createClient();

        // 1. Set distinct value
        $client->request('PATCH', '/api/user_prefs/language', [
            'auth_bearer' => $this->token,
            'headers' => ['Content-Type' => 'application/merge-patch+json'],
            'json' => [
                'type' => 'language',
                'value' => 'ru',
            ],
        ]);

        // 2. Delete
        $client->request('DELETE', '/api/user_prefs/language', [
            'auth_bearer' => $this->token,
        ]);
        self::assertResponseStatusCodeSame(204);

        // 3. GET should be default 'en'
        $response = $client->request('GET', '/api/user_prefs/language', [
            'auth_bearer' => $this->token,
        ]);
        $data = $response->toArray();
        self::assertEquals('en', $data['value']);
    }

    public function testUserIsolation(): void
    {
        $client = static::createClient();

        // User A (default token) sets language to 'ru'
        $client->request('PATCH', '/api/user_prefs/language', [
            'auth_bearer' => $this->token,
            'headers' => ['Content-Type' => 'application/merge-patch+json'],
            'json' => [
                'type' => 'language',
                'value' => 'ru',
            ],
        ]);

        // User B
        $userBToken = $this->createAnotherUserToken();

        // User B checks language -> should be default 'en'
        $response = $client->request('GET', '/api/user_prefs/language', [
            'auth_bearer' => $userBToken,
        ]);
        $data = $response->toArray();
        self::assertEquals('en', $data['value']);

        // Verify User A still has 'ru'
        $responseA = $client->request('GET', '/api/user_prefs/language', [
            'auth_bearer' => $this->token,
        ]);
        self::assertEquals('ru', $responseA->toArray()['value']);
    }
}
