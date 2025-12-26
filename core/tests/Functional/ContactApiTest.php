<?php

namespace App\Tests\Functional;

use ApiPlatform\Symfony\Bundle\Test\ApiTestCase;
use App\Entity\Contact;
use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;

class ContactApiTest extends ApiTestCase
{
    protected static ?bool $alwaysBootKernel = true;

    private string $token;
    private string $otherToken;
    private string $userUuid;
    private string $otherUserUuid;

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

        // Create User 1
        $this->userUuid = 'user1-' . bin2hex(random_bytes(4));
        $user1 = new User();
        $user1->setUuid($this->userUuid);
        $user1->setPassword($hasher->hashPassword($user1, 'pass'));
        $em->persist($user1);

        // Create User 2
        $this->otherUserUuid = 'user2-' . bin2hex(random_bytes(4));
        $user2 = new User();
        $user2->setUuid($this->otherUserUuid);
        $user2->setPassword($hasher->hashPassword($user2, 'pass'));
        $em->persist($user2);

        $em->flush();

        // Get tokens
        $this->token = $this->getToken($this->userUuid, 'pass');
        $this->otherToken = $this->getToken($this->otherUserUuid, 'pass');
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

    public function testCreateAndReadContact(): void
    {
        $client = static::createClient();

        // 1. Create Contact
        $response = $client->request('POST', '/api/contacts', [
            'auth_bearer' => $this->token,
            'json' => [], // Contact has no direct fields in 'contact:create' group yet
        ]);

        self::assertResponseStatusCodeSame(201);
        $contactIri = $response->toArray()['@id'];

        // 2. Add ContactName
        $client->request('POST', '/api/contact_names', [
            'auth_bearer' => $this->token,
            'json' => [
                'family' => 'Doe',
                'given' => 'John',
                'contact' => $contactIri,
            ],
        ]);
        self::assertResponseStatusCodeSame(201);

        // 3. Add ContactDate
        $client->request('POST', '/api/contact_dates', [
            'auth_bearer' => $this->token,
            'json' => [
                'date' => '2023-01-01',
                'text' => 'Birthday',
                'contact' => $contactIri,
            ],
        ]);
        self::assertResponseStatusCodeSame(201);

        // 4. Read Contact and verify names and dates
        $client->request('GET', $contactIri, [
            'auth_bearer' => $this->token,
        ]);
        self::assertResponseIsSuccessful();
        self::assertJsonContains([
            'contactNames' => [
                [
                    'family' => 'Doe',
                    'given' => 'John',
                ],
            ],
            'contactDates' => [
                [
                    'date' => '2023-01-01T00:00:00+00:00',
                    'text' => 'Birthday',
                ],
            ],
        ]);
    }

    public function testUpdateContact(): void
    {
        $client = static::createClient();

        // 1. Create Contact
        $response = $client->request('POST', '/api/contacts', [
            'auth_bearer' => $this->token,
            'json' => [],
        ]);
        $contactIri = $response->toArray()['@id'];

        // 2. Update Contact (we use PATCH for partial update/merge)
        $client->request('PATCH', $contactIri, [
            'auth_bearer' => $this->token,
            'json' => [],
            'headers' => ['Content-Type' => 'application/merge-patch+json'],
        ]);
        self::assertResponseIsSuccessful();

        // 3. Verify security: other user cannot update (filtered out -> 404)
        $client->request('PATCH', $contactIri, [
            'auth_bearer' => $this->otherToken,
            'json' => [],
            'headers' => ['Content-Type' => 'application/merge-patch+json'],
        ]);
        self::assertResponseStatusCodeSame(404);
    }

    public function testDeleteContact(): void
    {
        $client = static::createClient();

        // 1. Create Contact
        $response = $client->request('POST', '/api/contacts', [
            'auth_bearer' => $this->token,
            'json' => [],
        ]);
        $contactIri = $response->toArray()['@id'];

        // 2. Verify security: other user cannot delete (filtered out -> 404)
        $client->request('DELETE', $contactIri, [
            'auth_bearer' => $this->otherToken,
        ]);
        self::assertResponseStatusCodeSame(404);

        // 3. Delete Contact
        $client->request('DELETE', $contactIri, [
            'auth_bearer' => $this->token,
        ]);
        self::assertResponseStatusCodeSame(204);

        // 4. Verify it's gone
        $client->request('GET', $contactIri, [
            'auth_bearer' => $this->token,
        ]);
        self::assertResponseStatusCodeSame(404);
    }

    public function testContactOwnership(): void
    {
        $client = static::createClient();

        // User 1 creates a contact
        $response = $client->request('POST', '/api/contacts', [
            'auth_bearer' => $this->token,
            'json' => [],
        ]);
        $contactIri = $response->toArray()['@id'];

        // Other user cannot see this contact (filtered out -> 404)
        $client->request('GET', $contactIri, [
            'auth_bearer' => $this->otherToken,
        ]);
        self::assertResponseStatusCodeSame(404);

        // Other user cannot update (filtered out -> 404)
        $client->request('PUT', $contactIri, [
            'auth_bearer' => $this->otherToken,
            'json' => ['some' => 'data'],
        ]);
        self::assertResponseStatusCodeSame(404);

        // Other user cannot patch (filtered out -> 404)
        $client->request('PATCH', $contactIri, [
            'auth_bearer' => $this->otherToken,
            'json' => ['some' => 'data'],
            'headers' => ['Content-Type' => 'application/merge-patch+json'],
        ]);
        self::assertResponseStatusCodeSame(404);

        // Other user cannot delete (filtered out -> 404)
        $client->request('DELETE', $contactIri, [
            'auth_bearer' => $this->otherToken,
        ]);
        self::assertResponseStatusCodeSame(404);

        // User 2 tries to list contacts (should not see User 1's contact)
        $response = $client->request('GET', '/api/contacts', [
            'auth_bearer' => $this->otherToken,
            'headers' => ['Accept' => 'application/ld+json'],
        ]);
        self::assertResponseIsSuccessful();
        self::assertCount(0, $response->toArray()['member']);

        // User 1 tries to list contacts (should see their contact)
        $response = $client->request('GET', '/api/contacts', [
            'auth_bearer' => $this->token,
            'headers' => ['Accept' => 'application/ld+json'],
        ]);
        self::assertResponseIsSuccessful();
        self::assertCount(1, $response->toArray()['member']);
        self::assertJsonContains(['member' => [['@id' => $contactIri]]]);
    }

    public function testCascadeDeletion(): void
    {
        $client = static::createClient();

        // 1. Create Contact
        $response = $client->request('POST', '/api/contacts', [
            'auth_bearer' => $this->token,
            'json' => [],
        ]);
        $contactIri = $response->toArray()['@id'];

        // 2. Add Name and Date
        $response = $client->request('POST', '/api/contact_names', [
            'auth_bearer' => $this->token,
            'json' => [
                'family' => 'Doe',
                'given' => 'Jane',
                'contact' => $contactIri,
            ],
        ]);
        $nameIri = $response->toArray()['@id'];

        $response = $client->request('POST', '/api/contact_dates', [
            'auth_bearer' => $this->token,
            'json' => [
                'date' => '2025-01-01',
                'text' => 'New Year',
                'contact' => $contactIri,
            ],
        ]);
        $dateIri = $response->toArray()['@id'];

        // 3. Delete Contact
        $client->request('DELETE', $contactIri, [
            'auth_bearer' => $this->token,
        ]);
        self::assertResponseStatusCodeSame(204);

        // 4. Verify Name is gone
        $client->request('GET', $nameIri, [
            'auth_bearer' => $this->token,
        ]);
        self::assertResponseStatusCodeSame(404);

        // 5. Verify Date is gone
        $client->request('GET', $dateIri, [
            'auth_bearer' => $this->token,
        ]);
        self::assertResponseStatusCodeSame(404);
    }
}
