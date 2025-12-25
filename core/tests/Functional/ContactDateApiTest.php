<?php

namespace App\Tests\Functional;

use ApiPlatform\Symfony\Bundle\Test\ApiTestCase;
use App\Entity\Contact;
use App\Entity\ContactDate;
use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;

class ContactDateApiTest extends ApiTestCase
{
    protected static ?bool $alwaysBootKernel = true;

    private string $token;
    private string $otherToken;
    private string $userUuid;
    private string $otherUserUuid;
    private string $contactIri;
    private string $otherContactIri;

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

        // Create Contacts for each user
        $contact1 = new Contact();
        $contact1->setUser($user1);
        $em->persist($contact1);

        $contact2 = new Contact();
        $contact2->setUser($user2);
        $em->persist($contact2);

        $em->flush();

        // Get tokens
        $this->token = $this->getToken($this->userUuid, 'pass');
        $this->otherToken = $this->getToken($this->otherUserUuid, 'pass');

        $this->contactIri = '/api/contacts/' . (string) $contact1->getId();
        $this->otherContactIri = '/api/contacts/' . (string) $contact2->getId();
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

    public function testContactDateCRUD(): void
    {
        $client = static::createClient();

        // 1. Create ContactDate
        $response = $client->request('POST', '/api/contact_dates', [
            'auth_bearer' => $this->token,
            'json' => [
                'date' => '2023-01-01',
                'text' => 'Wedding Anniversary',
                'contact' => $this->contactIri,
            ],
        ]);

        self::assertResponseStatusCodeSame(201);
        $dateIri = $response->toArray()['@id'];

        // 2. GET Item
        $client->request('GET', $dateIri, [
            'auth_bearer' => $this->token,
        ]);
        self::assertResponseIsSuccessful();
        self::assertJsonContains([
            'date' => '2023-01-01T00:00:00+00:00',
            'text' => 'Wedding Anniversary',
        ]);

        // 3. PUT (Update fully)
        $client->request('PUT', $dateIri, [
            'auth_bearer' => $this->token,
            'json' => [
                'date' => '2023-01-02',
                'text' => 'Wedding Anniversary (Observed)',
                'contact' => $this->contactIri,
            ],
        ]);
        self::assertResponseIsSuccessful();
        self::assertJsonContains([
            'date' => '2023-01-02T00:00:00+00:00',
            'text' => 'Wedding Anniversary (Observed)',
        ]);

        // 4. PATCH (Update partially)
        $client->request('PATCH', $dateIri, [
            'auth_bearer' => $this->token,
            'json' => [
                'text' => 'Updated Anniversary',
            ],
            'headers' => ['Content-Type' => 'application/merge-patch+json'],
        ]);
        self::assertResponseIsSuccessful();
        self::assertJsonContains([
            'text' => 'Updated Anniversary',
        ]);

        // 5. GET Collection
        $response = $client->request('GET', '/api/contact_dates', [
            'auth_bearer' => $this->token,
            'headers' => ['Accept' => 'application/ld+json'],
        ]);
        self::assertResponseIsSuccessful();
        self::assertCount(1, $response->toArray()['member']);

        // 6. Security: Other user cannot see this item
        $client->request('GET', $dateIri, [
            'auth_bearer' => $this->otherToken,
        ]);
        self::assertResponseStatusCodeSame(403);

        // 7. Security: Other user cannot list this item
        $response = $client->request('GET', '/api/contact_dates', [
            'auth_bearer' => $this->otherToken,
            'headers' => ['Accept' => 'application/ld+json'],
        ]);
        self::assertResponseIsSuccessful();
        self::assertCount(0, $response->toArray()['member']);

        // 8. DELETE
        $client->request('DELETE', $dateIri, [
            'auth_bearer' => $this->token,
        ]);
        self::assertResponseStatusCodeSame(204);

        // 9. Verify deletion
        $client->request('GET', $dateIri, [
            'auth_bearer' => $this->token,
        ]);
        self::assertResponseStatusCodeSame(404);
    }

    public function testCannotCreateContactDateForOthersContact(): void
    {
        $client = static::createClient();

        $client->request('POST', '/api/contact_dates', [
            'auth_bearer' => $this->token,
            'json' => [
                'date' => '2023-01-01',
                'text' => 'Malicious Date',
                'contact' => $this->otherContactIri,
            ],
        ]);

        self::assertResponseStatusCodeSame(403);
    }
}
