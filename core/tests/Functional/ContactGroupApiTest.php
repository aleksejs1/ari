<?php

namespace App\Tests\Functional;

use ApiPlatform\Symfony\Bundle\Test\ApiTestCase;
use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;

class ContactGroupApiTest extends ApiTestCase
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

    public function testCreateLinkAndDeleteContactGroup(): void
    {
        $client = static::createClient();

        // 1. Create Contact
        $response = $client->request('POST', '/api/contacts', [
            'auth_bearer' => $this->token,
            'json' => [],
        ]);
        $contactIri = $response->toArray()['@id'];

        // 2. Create Group
        $response = $client->request('POST', '/api/groups', [
            'auth_bearer' => $this->token,
            'json' => ['name' => 'Friends'],
        ]);
        $groupIri = $response->toArray()['@id'];

        // 3. Create ContactGroup (link)
        $response = $client->request('POST', '/api/contact_groups', [
            'auth_bearer' => $this->token,
            'json' => [
                'contact' => $contactIri,
                'groupResource' => $groupIri,
            ],
        ]);
        self::assertResponseStatusCodeSame(201);
        $contactGroupIri = $response->toArray()['@id'];

        // 4. Verify link
        $client->request('GET', $contactGroupIri, [
            'auth_bearer' => $this->token,
        ]);
        self::assertResponseIsSuccessful();
        self::assertJsonContains([
            'contact' => $contactIri,
            'groupResource' => ['@id' => $groupIri],
        ]);

        // 5. Delete ContactGroup
        $client->request('DELETE', $contactGroupIri, [
            'auth_bearer' => $this->token,
        ]);
        self::assertResponseStatusCodeSame(204);

        // 6. Verify it's gone
        $client->request('GET', $contactGroupIri, [
            'auth_bearer' => $this->token,
        ]);
        self::assertResponseStatusCodeSame(404);
    }

    public function testSecurityIsolation(): void
    {
        $client = static::createClient();

        // User 1 creates Contact and Group
        $response = $client->request('POST', '/api/contacts', [
            'auth_bearer' => $this->token,
            'json' => [],
        ]);
        $contactIri = $response->toArray()['@id'];

        $response = $client->request('POST', '/api/groups', [
            'auth_bearer' => $this->token,
            'json' => ['name' => 'Friends'],
        ]);
        $groupIri = $response->toArray()['@id'];

        $response = $client->request('POST', '/api/contact_groups', [
            'auth_bearer' => $this->token,
            'json' => [
                'contact' => $contactIri,
                'groupResource' => $groupIri,
            ],
        ]);
        $contactGroupIri = $response->toArray()['@id'];

        // User 2 tries to access
        $client->request('GET', $contactGroupIri, [
            'auth_bearer' => $this->otherToken,
        ]);
        self::assertResponseStatusCodeSame(404);

        $client->request('DELETE', $contactGroupIri, [
            'auth_bearer' => $this->otherToken,
        ]);
        self::assertResponseStatusCodeSame(404);
    }
}
