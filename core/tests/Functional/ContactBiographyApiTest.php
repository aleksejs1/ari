<?php

namespace Ari\Tests\Functional;

use ApiPlatform\Symfony\Bundle\Test\ApiTestCase;
use Ari\Entity\Contact;
use Ari\Entity\User;
use Doctrine\ORM\EntityManagerInterface;

class ContactBiographyApiTest extends ApiTestCase
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
        /** @var \Doctrine\Bundle\DoctrineBundle\Registry $doctrine */
        $doctrine = $container->get('doctrine');
        /** @var EntityManagerInterface $em */
        $em = $doctrine->getManager();

        /** @var \Symfony\Component\DependencyInjection\Container $testContainer */
        $testContainer = $container->get('test.service_container');
        /** @var \Symfony\Component\PasswordHasher\Hasher\UserPasswordHasher $hasher */
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

        // Cast to string to avoid Psalm errors
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

    public function testContactBiographyCRUD(): void
    {
        $client = static::createClient();

        // 1. Create ContactBiography
        $response = $client->request('POST', '/api/contact_biographies', [
            'auth_bearer' => $this->token,
            'json' => [
                'type' => 'Education',
                'value' => 'MIT Graduate',
                'contact' => $this->contactIri,
            ],
        ]);

        self::assertResponseStatusCodeSame(201);
        $biographyIri = $response->toArray()['@id'];

        // 2. GET Item
        $client->request('GET', $biographyIri, [
            'auth_bearer' => $this->token,
        ]);
        self::assertResponseIsSuccessful();
        self::assertJsonContains([
            'type' => 'Education',
            'value' => 'MIT Graduate',
        ]);

        // 3. PUT (Update fully)
        $client->request('PUT', $biographyIri, [
            'auth_bearer' => $this->token,
            'json' => [
                'type' => 'Work',
                'value' => 'Software Engineer',
                'contact' => $this->contactIri,
            ],
        ]);
        self::assertResponseIsSuccessful();
        self::assertJsonContains([
            'type' => 'Work',
            'value' => 'Software Engineer',
        ]);

        // 4. PATCH (Update partially)
        $client->request('PATCH', $biographyIri, [
            'auth_bearer' => $this->token,
            'json' => [
                'value' => 'Senior Software Engineer',
            ],
            'headers' => ['Content-Type' => 'application/merge-patch+json'],
        ]);
        self::assertResponseIsSuccessful();
        self::assertJsonContains([
            'value' => 'Senior Software Engineer',
            // type remains 'Work'
            'type' => 'Work',
        ]);

        // 5. GET Collection
        $response = $client->request('GET', '/api/contact_biographies', [
            'auth_bearer' => $this->token,
            'headers' => ['Accept' => 'application/ld+json'],
        ]);
        self::assertResponseIsSuccessful();
        self::assertCount(1, $response->toArray()['member']);

        // 6. Security: Other user cannot see this item (filtered out -> 404)
        $client->request('GET', $biographyIri, [
            'auth_bearer' => $this->otherToken,
        ]);
        self::assertResponseStatusCodeSame(404);

        // Security: Other user cannot update (PUT) (filtered out -> 404)
        $client->request('PUT', $biographyIri, [
            'auth_bearer' => $this->otherToken,
            'json' => [
                'type' => 'Hacked',
                'value' => 'Hacked',
                'contact' => $this->contactIri,
            ],
        ]);
        self::assertResponseStatusCodeSame(404);

        // Security: Other user cannot update (PATCH) (filtered out -> 404)
        $client->request('PATCH', $biographyIri, [
            'auth_bearer' => $this->otherToken,
            'json' => [
                'value' => 'Hacked',
            ],
            'headers' => ['Content-Type' => 'application/merge-patch+json'],
        ]);
        self::assertResponseStatusCodeSame(404);

        // Security: Other user cannot delete (filtered out -> 404)
        $client->request('DELETE', $biographyIri, [
            'auth_bearer' => $this->otherToken,
        ]);
        self::assertResponseStatusCodeSame(404);

        // 7. Security: Other user cannot list this item
        $response = $client->request('GET', '/api/contact_biographies', [
            'auth_bearer' => $this->otherToken,
            'headers' => ['Accept' => 'application/ld+json'],
        ]);
        self::assertResponseIsSuccessful();
        self::assertCount(0, $response->toArray()['member']);

        // 8. DELETE
        $client->request('DELETE', $biographyIri, [
            'auth_bearer' => $this->token,
        ]);
        self::assertResponseStatusCodeSame(204);

        // 9. Verify deletion
        $client->request('GET', $biographyIri, [
            'auth_bearer' => $this->token,
        ]);
        self::assertResponseStatusCodeSame(404);
    }

    public function testCannotCreateContactBiographyForOthersContact(): void
    {
        $client = static::createClient();

        $client->request('POST', '/api/contact_biographies', [
            'auth_bearer' => $this->token,
            'json' => [
                'type' => 'Malicious',
                'value' => 'Entry',
                'contact' => $this->otherContactIri,
            ],
        ]);

        // When trying to use another user's contact, the contact is not found due to filter
        // -> 400 Bad Request (denormalization error)
        self::assertResponseStatusCodeSame(400);
    }
}
