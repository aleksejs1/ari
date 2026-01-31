<?php

namespace Ari\Tests\Functional;

use ApiPlatform\Symfony\Bundle\Test\ApiTestCase;
use Ari\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasher;

class ContactSearchFilterTest extends ApiTestCase
{
    protected static ?bool $alwaysBootKernel = true;

    private string $token;
    private string $userUuid;

    #[\Override]
    protected function setUp(): void
    {
        $container = self::getContainer();
        /** @var \Doctrine\Bundle\DoctrineBundle\Registry $doctrine */
        $doctrine = $container->get('doctrine');
        /** @var EntityManagerInterface $em */
        $em = $doctrine->getManager();

        /** @var \Symfony\Component\DependencyInjection\Container $testContainer */
        $testContainer = $container->get('test.service_container');
        /** @var UserPasswordHasher $hasher */
        $hasher = $testContainer->get('security.user_password_hasher');

        // Create User
        $this->userUuid = 'user-search-' . bin2hex(random_bytes(4));
        $user = new User();
        $user->setUuid($this->userUuid);
        $user->setPassword($hasher->hashPassword($user, 'password'));
        $em->persist($user);
        $em->flush();

        $this->token = $this->getToken($this->userUuid, 'password');
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

    public function testSearchContacts(): void
    {
        $client = static::createClient();

        // 1. Create John Doe (Name match)
        $response = $client->request('POST', '/api/contacts', [
            'auth_bearer' => $this->token,
            'json' => [],
        ]);
        $johnIri = $response->toArray()['@id'];

        $client->request('POST', '/api/contact_names', [
            'auth_bearer' => $this->token,
            'json' => ['given' => 'John', 'family' => 'Doe', 'contact' => $johnIri],
        ]);

        // 2. Create Jane Smith (Email match)
        $response = $client->request('POST', '/api/contacts', [
            'auth_bearer' => $this->token,
            'json' => [],
        ]);
        $janeIri = $response->toArray()['@id'];

        $client->request('POST', '/api/contact_names', [
            'auth_bearer' => $this->token,
            'json' => ['given' => 'Jane', 'family' => 'Smith', 'contact' => $janeIri],
        ]);

        $client->request('POST', '/api/contact_email_adresses', [
            'auth_bearer' => $this->token,
            'json' => ['value' => 'jane.smith@example.com', 'contact' => $janeIri],
        ]);

        // 3. Create Bob Brown (Phone match)
        $response = $client->request('POST', '/api/contacts', [
            'auth_bearer' => $this->token,
            'json' => [],
        ]);
        $bobIri = $response->toArray()['@id'];

        $client->request('POST', '/api/contact_names', [
            'auth_bearer' => $this->token,
            'json' => ['given' => 'Bob', 'family' => 'Brown', 'contact' => $bobIri],
        ]);

        $client->request('POST', '/api/contact_phone_numbers', [
            'auth_bearer' => $this->token,
            'json' => ['value' => '+15551234567', 'contact' => $bobIri],
        ]);

        // 4. Create Alice Green (Organization match)
        $response = $client->request('POST', '/api/contacts', [
            'auth_bearer' => $this->token,
            'json' => [],
        ]);
        $aliceIri = $response->toArray()['@id'];

        $client->request('POST', '/api/contact_names', [
            'auth_bearer' => $this->token,
            'json' => ['given' => 'Alice', 'family' => 'Green', 'contact' => $aliceIri],
        ]);

        $client->request('POST', '/api/contact_organizations', [
            'auth_bearer' => $this->token,
            'json' => ['name' => 'Acme Corp', 'contact' => $aliceIri],
        ]);

        // Test 1: Search by Name "John"
        $response = $client->request('GET', '/api/contacts?search=John', [
            'auth_bearer' => $this->token,
            'headers' => ['Accept' => 'application/ld+json'],
        ]);
        self::assertResponseIsSuccessful();
        /** @var array<int, array{id?: int, '@id': string}> $data */
        $data = $response->toArray()['member'] ?? [];
        self::assertCount(1, $data);
        self::assertSame($johnIri, $data[0]['@id']);

        // Test 2: Search by Email "smith@example"
        $response = $client->request('GET', '/api/contacts?search=smith@example', [
            'auth_bearer' => $this->token,
            'headers' => ['Accept' => 'application/ld+json'],
        ]);
        self::assertResponseIsSuccessful();
        /** @var array<int, array{id?: int, '@id': string}> $data */
        $data = $response->toArray()['member'] ?? [];
        self::assertCount(1, $data);
        self::assertSame($janeIri, $data[0]['@id']);

        // Test 3: Search by Phone "555123"
        $response = $client->request('GET', '/api/contacts?search=555123', [
            'auth_bearer' => $this->token,
            'headers' => ['Accept' => 'application/ld+json'],
        ]);
        self::assertResponseIsSuccessful();
        /** @var array<int, array{id?: int, '@id': string}> $data */
        $data = $response->toArray()['member'] ?? [];
        self::assertCount(1, $data);
        self::assertSame($bobIri, $data[0]['@id']);

        // Test 4: Search by Organization "Acme"
        $response = $client->request('GET', '/api/contacts?search=Acme', [
            'auth_bearer' => $this->token,
            'headers' => ['Accept' => 'application/ld+json'],
        ]);
        self::assertResponseIsSuccessful();
        /** @var array<int, array{id?: int, '@id': string}> $data */
        $data = $response->toArray()['member'] ?? [];
        self::assertCount(1, $data);
        self::assertSame($aliceIri, $data[0]['@id']);

        // Test 5: Search for non-existent "Xyz"
        $response = $client->request('GET', '/api/contacts?search=Xyz', [
            'auth_bearer' => $this->token,
            'headers' => ['Accept' => 'application/ld+json'],
        ]);
        self::assertResponseIsSuccessful();
        /** @var array<int, array{id?: int, '@id': string}> $data */
        $data = $response->toArray()['member'] ?? [];
        self::assertCount(0, $data);
    }
}
