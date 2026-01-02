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
}
