<?php

namespace App\Tests\Functional;

use ApiPlatform\Symfony\Bundle\Test\ApiTestCase;
use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;

class GroupApiTest extends ApiTestCase
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

    public function testCreateAndReadGroup(): void
    {
        $client = static::createClient();

        // 1. Create Group
        $response = $client->request('POST', '/api/groups', [
            'auth_bearer' => $this->token,
            'json' => ['name' => 'My First Group'],
        ]);

        self::assertResponseStatusCodeSame(201);
        $groupIri = $response->toArray()['@id'];

        // 2. Read Group
        $client->request('GET', $groupIri, [
            'auth_bearer' => $this->token,
        ]);
        self::assertResponseIsSuccessful();
        self::assertJsonContains([
            'name' => 'My First Group',
        ]);
    }

    public function testUpdateGroup(): void
    {
        $client = static::createClient();

        // 1. Create Group
        $response = $client->request('POST', '/api/groups', [
            'auth_bearer' => $this->token,
            'json' => ['name' => 'Group to Update'],
        ]);
        $groupIri = $response->toArray()['@id'];

        // 2. Update Group
        $client->request('PUT', $groupIri, [
            'auth_bearer' => $this->token,
            'json' => ['name' => 'Updated Group Name'],
        ]);
        self::assertResponseIsSuccessful();
        self::assertJsonContains(['name' => 'Updated Group Name']);

        // 3. Verify security: other user cannot update
        $client->request('PUT', $groupIri, [
            'auth_bearer' => $this->otherToken,
            'json' => ['name' => 'Hacked Group Name'],
        ]);
        self::assertResponseStatusCodeSame(404);
    }

    public function testDeleteGroup(): void
    {
        $client = static::createClient();

        // 1. Create Group
        $response = $client->request('POST', '/api/groups', [
            'auth_bearer' => $this->token,
            'json' => ['name' => 'Group to Delete'],
        ]);
        $groupIri = $response->toArray()['@id'];

        // 2. Verify security: other user cannot delete
        $client->request('DELETE', $groupIri, [
            'auth_bearer' => $this->otherToken,
        ]);
        self::assertResponseStatusCodeSame(404);

        // 3. Delete Group
        $client->request('DELETE', $groupIri, [
            'auth_bearer' => $this->token,
        ]);
        self::assertResponseStatusCodeSame(204);

        // 4. Verify it's gone
        $client->request('GET', $groupIri, [
            'auth_bearer' => $this->token,
        ]);
        self::assertResponseStatusCodeSame(404);
    }

    public function testGroupOwnership(): void
    {
        $client = static::createClient();

        // User 1 creates a group
        $response = $client->request('POST', '/api/groups', [
            'auth_bearer' => $this->token,
            'json' => ['name' => 'User 1 Group'],
        ]);
        $groupIri = $response->toArray()['@id'];

        // Other user cannot see this group
        $client->request('GET', $groupIri, [
            'auth_bearer' => $this->otherToken,
        ]);
        self::assertResponseStatusCodeSame(404);

        // Other user cannot update
        $client->request('PUT', $groupIri, [
            'auth_bearer' => $this->otherToken,
            'json' => ['name' => 'Hacked'],
        ]);
        self::assertResponseStatusCodeSame(404);

        // User 2 tries to list groups (should not see User 1's group)
        $response = $client->request('GET', '/api/groups', [
            'auth_bearer' => $this->otherToken,
            'headers' => ['Accept' => 'application/ld+json'],
        ]);
        self::assertResponseIsSuccessful();
        self::assertCount(0, $response->toArray()['member']);

        // User 1 tries to list groups (should see their group)
        $response = $client->request('GET', '/api/groups', [
            'auth_bearer' => $this->token,
            'headers' => ['Accept' => 'application/ld+json'],
        ]);
        self::assertResponseIsSuccessful();
        self::assertCount(1, $response->toArray()['member']);
        self::assertJsonContains(['member' => [['@id' => $groupIri]]]);
    }
}
