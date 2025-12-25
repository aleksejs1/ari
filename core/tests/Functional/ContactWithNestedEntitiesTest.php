<?php

namespace App\Tests\Functional;

use ApiPlatform\Symfony\Bundle\Test\ApiTestCase;
use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;

class ContactWithNestedEntitiesTest extends ApiTestCase
{
    protected static ?bool $alwaysBootKernel = true;

    private string $token;
    private string $userUuid;

    #[\Override]
    protected function setUp(): void
    {
        $container = self::getContainer();
        /** @var \Doctrine\Persistence\ManagerRegistry $doctrine */
        $doctrine = $container->get('doctrine');
        /** @var EntityManagerInterface $em */
        $em = $doctrine->getManager();

        /** @var \Symfony\Component\DependencyInjection\Container $testContainer */
        $testContainer = $container->get('test.service_container');
        /** @var \Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface $hasher */
        $hasher = $testContainer->get('security.user_password_hasher');

        // Create User
        $this->userUuid = 'user-' . bin2hex(random_bytes(4));
        $user = new User();
        $user->setUuid($this->userUuid);
        $user->setPassword($hasher->hashPassword($user, 'pass'));
        $em->persist($user);
        $em->flush();

        // Get token
        $this->token = $this->getToken($this->userUuid, 'pass');
    }

    private function getToken(string $username, string $password): string
    {
        $response = static::createClient()->request('POST', '/api/login_check', [
            'json' => [
                'username' => $username,
                'password' => $password,
            ],
        ]);

        return $response->toArray()['token'];
    }

    /**
     * Test creating a Contact with nested ContactName and ContactDate entities in a single POST request.
     * This is a TDD test - it will fail initially because cascade persist is not configured.
     */
    public function testCreateContactWithNestedEntities(): void
    {
        $client = static::createClient();

        // Attempt to create Contact with embedded ContactNames and ContactDates
        $response = $client->request('POST', '/api/contacts', [
            'auth_bearer' => $this->token,
            'json' => [
                'contactNames' => [
                    [
                        'family' => 'Smith',
                        'given' => 'John',
                    ],
                    [
                        'family' => 'Smith',
                        'given' => 'Johnny',
                    ],
                ],
                'contactDates' => [
                    [
                        'date' => '1990-05-15',
                        'text' => 'Birthday',
                    ],
                    [
                        'date' => '2023-06-01',
                        'text' => 'Anniversary',
                    ],
                ],
            ],
        ]);

        self::assertResponseStatusCodeSame(201);

        $data = $response->toArray();
        $contactIri = $data['@id'];

        // Verify the response contains the nested entities
        self::assertArrayHasKey('contactNames', $data);
        self::assertCount(2, $data['contactNames']);

        self::assertArrayHasKey('contactDates', $data);
        self::assertCount(2, $data['contactDates']);

        // Verify the names
        self::assertJsonContains([
            'contactNames' => [
                [
                    'family' => 'Smith',
                    'given' => 'John',
                ],
                [
                    'family' => 'Smith',
                    'given' => 'Johnny',
                ],
            ],
        ]);

        // Verify the dates
        self::assertJsonContains([
            'contactDates' => [
                [
                    'date' => '1990-05-15T00:00:00+00:00',
                    'text' => 'Birthday',
                ],
                [
                    'date' => '2023-06-01T00:00:00+00:00',
                    'text' => 'Anniversary',
                ],
            ],
        ]);

        // Additional verification: fetch the contact and verify persistence
        $getResponse = $client->request('GET', $contactIri, [
            'auth_bearer' => $this->token,
        ]);

        self::assertResponseIsSuccessful();
        $getData = $getResponse->toArray();

        self::assertCount(2, $getData['contactNames']);
        self::assertCount(2, $getData['contactDates']);
    }

    /**
     * Test updating a Contact with nested entities using PUT.
     * This tests the full replacement behavior of PUT.
     */
    public function testPutContactWithNestedEntities(): void
    {
        $client = static::createClient();

        // 1. Create initial Contact with one name and one date
        $response = $client->request('POST', '/api/contacts', [
            'auth_bearer' => $this->token,
            'json' => [
                'contactNames' => [
                    [
                        'family' => 'Doe',
                        'given' => 'Jane',
                    ],
                ],
                'contactDates' => [
                    [
                        'date' => '1985-03-20',
                        'text' => 'Birthday',
                    ],
                ],
            ],
        ]);

        self::assertResponseStatusCodeSame(201);
        $contactIri = $response->toArray()['@id'];

        // 2. Use PUT to replace with new nested entities
        $putResponse = $client->request('PUT', $contactIri, [
            'auth_bearer' => $this->token,
            'json' => [
                'contactNames' => [
                    [
                        'family' => 'Johnson',
                        'given' => 'Bob',
                    ],
                    [
                        'family' => 'Johnson',
                        'given' => 'Bobby',
                    ],
                ],
                'contactDates' => [
                    [
                        'date' => '2024-12-25',
                        'text' => 'Christmas',
                    ],
                ],
            ],
        ]);

        self::assertResponseIsSuccessful();

        // 3. Verify the update
        $data = $putResponse->toArray();

        // Should have 2 names and 1 date (old ones should be removed)
        self::assertCount(2, $data['contactNames']);
        self::assertCount(1, $data['contactDates']);

        self::assertJsonContains([
            'contactNames' => [
                [
                    'family' => 'Johnson',
                    'given' => 'Bob',
                ],
                [
                    'family' => 'Johnson',
                    'given' => 'Bobby',
                ],
            ],
            'contactDates' => [
                [
                    'date' => '2024-12-25T00:00:00+00:00',
                    'text' => 'Christmas',
                ],
            ],
        ]);
    }

    /**
     * Test creating an empty Contact and then adding nested entities via PATCH.
     */
    public function testPatchContactWithNestedEntities(): void
    {
        $client = static::createClient();

        // 1. Create empty Contact
        $response = $client->request('POST', '/api/contacts', [
            'auth_bearer' => $this->token,
            'json' => [],
        ]);

        self::assertResponseStatusCodeSame(201);
        $contactIri = $response->toArray()['@id'];

        // 2. PATCH to add nested entities
        $patchResponse = $client->request('PATCH', $contactIri, [
            'auth_bearer' => $this->token,
            'headers' => ['Content-Type' => 'application/merge-patch+json'],
            'json' => [
                'contactNames' => [
                    [
                        'family' => 'Williams',
                        'given' => 'Alice',
                    ],
                ],
                'contactDates' => [
                    [
                        'date' => '2025-01-01',
                        'text' => 'New Year',
                    ],
                ],
            ],
        ]);

        self::assertResponseIsSuccessful();

        // 3. Verify the patch
        $data = $patchResponse->toArray();

        self::assertCount(1, $data['contactNames']);
        self::assertCount(1, $data['contactDates']);

        self::assertJsonContains([
            'contactNames' => [
                [
                    'family' => 'Williams',
                    'given' => 'Alice',
                ],
            ],
            'contactDates' => [
                [
                    'date' => '2025-01-01T00:00:00+00:00',
                    'text' => 'New Year',
                ],
            ],
        ]);
    }
}
