<?php

namespace App\Tests\Functional;

use ApiPlatform\Symfony\Bundle\Test\ApiTestCase;
use App\Entity\Contact;
use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;

class ContactSimilarApiTest extends ApiTestCase
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
        $this->userUuid = 'user-similar-' . bin2hex(random_bytes(4));
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

    public function testFindSimilarContacts(): void
    {
        $client = static::createClient();

        // 1. Create main contact "Ivanov"
        $ivanovIri = $this->createContactWithSurname($client, 'Ivanov');

        // 2. Create similar contacts
        $ivanovaIri = $this->createContactWithSurname($client, 'Ivanova');
        $ivaninIri = $this->createContactWithSurname($client, 'Ivanin');

        // 3. Create non-similar contact
        $petrovIri = $this->createContactWithSurname($client, 'Petrov');

        // 4. Request similar for Ivanov
        $response = $client->request('GET', $ivanovIri . '/similar', [
            'auth_bearer' => $this->token,
        ]);

        self::assertResponseIsSuccessful();
        /** @var array<int, array<string, mixed>> $items */
        $items = $response->toArray()['member'];

        self::assertCount(2, $items);

        $ids = array_map(fn($item) => $item['@id'], $items);

        self::assertContains($ivanovaIri, $ids);
        self::assertContains($ivaninIri, $ids);
        self::assertNotContains($petrovIri, $ids);
        self::assertNotContains($ivanovIri, $ids); // Self exclusion
    }

    public function testSimilarWithShortSurname(): void
    {
        $client = static::createClient();

        // Short surname "Li" (2 chars) -> prefix "" -> should return empty
        $liIri = $this->createContactWithSurname($client, 'Li');
        $this->createContactWithSurname($client, 'Lin');

        $response = $client->request('GET', $liIri . '/similar', [
            'auth_bearer' => $this->token,
        ]);

        self::assertResponseIsSuccessful();
        $items = $response->toArray()['member'];
        self::assertCount(0, $items);
    }

    public function testSimilarWithNoName(): void
    {
        $client = static::createClient();

        // Create contact without name
        $response = $client->request('POST', '/api/contacts', [
            'auth_bearer' => $this->token,
            'json' => [],
        ]);
        $contactIri = $response->toArray()['@id'];

        $response = $client->request('GET', $contactIri . '/similar', [
            'auth_bearer' => $this->token,
        ]);

        self::assertResponseIsSuccessful();
        $items = $response->toArray()['member'];
        self::assertCount(0, $items);
    }

    private function createContactWithSurname(\ApiPlatform\Symfony\Bundle\Test\Client $client, string $surname): string
    {
        // Create Contact
        $response = $client->request('POST', '/api/contacts', [
            'auth_bearer' => $this->token,
            'json' => [],
        ]);
        $contactIri = $response->toArray()['@id'];

        // Add Name
        $client->request('POST', '/api/contact_names', [
            'auth_bearer' => $this->token,
            'json' => [
                'family' => $surname,
                'given' => 'Test',
                'contact' => $contactIri,
            ],
        ]);

        return $contactIri;
    }

    private function createContactWithOrganization(
        \ApiPlatform\Symfony\Bundle\Test\Client $client,
        string $orgName,
        string $surname = 'Test'
    ): string {
        // Create Contact
        $response = $client->request('POST', '/api/contacts', [
            'auth_bearer' => $this->token,
            'json' => [],
        ]);
        $contactIri = $response->toArray()['@id'];

        // Add Name
        $client->request('POST', '/api/contact_names', [
            'auth_bearer' => $this->token,
            'json' => [
                'family' => $surname,
                'given' => 'Test',
                'contact' => $contactIri,
            ],
        ]);

        // Add Organization
        $client->request('POST', '/api/contact_organizations', [
            'auth_bearer' => $this->token,
            'json' => [
                'name' => $orgName,
                'contact' => $contactIri,
            ],
        ]);

        return $contactIri;
    }

    public function testFindSimilarContactsByOrganization(): void
    {
        $client = static::createClient();

        // 1. Create main contact "Acme"
        $acme1 = $this->createContactWithOrganization($client, 'Acme Corp', 'Smith');

        // 2. Create similar contact (diff surname, same org)
        $acme2 = $this->createContactWithOrganization($client, 'Acme Corp', 'Jones');

        // 3. Create non-similar contact
        $other = $this->createContactWithOrganization($client, 'Other Corp', 'Brown');

        // 4. Request similar for acme1
        $response = $client->request('GET', $acme1 . '/similar', [
            'auth_bearer' => $this->token,
        ]);

        self::assertResponseIsSuccessful();
        $items = $response->toArray()['member'];

        // Should find acme2 because of organization
        $ids = array_map(fn($item) => $item['@id'], $items);
        self::assertContains($acme2, $ids);
        self::assertNotContains($other, $ids);
    }

    public function testExcludeRelatedContacts(): void
    {
        $client = static::createClient();

        // 1. Create two similar contacts (same surname prefix)
        $c1 = $this->createContactWithSurname($client, 'Petrov');
        $c2 = $this->createContactWithSurname($client, 'Petrova');

        // Verify they are similar initially
        $response = $client->request('GET', $c1 . '/similar', [
            'auth_bearer' => $this->token,
        ]);
        $ids = array_map(fn($item) => $item['@id'], $response->toArray()['member']);
        self::assertContains($c2, $ids);

        // 2. Add relation between them
        $client->request('POST', '/api/contact_relations', [
            'auth_bearer' => $this->token,
            'json' => [
                'contact' => $c1,
                'relatedContact' => $c2,
                'type' => 'colleague'
            ],
        ]);

        // 3. Verify they are NO LONGER similar
        $response = $client->request('GET', $c1 . '/similar', [
            'auth_bearer' => $this->token,
        ]);
        $ids = array_map(fn($item) => $item['@id'], $response->toArray()['member']);
        self::assertNotContains($c2, $ids);
    }
}
