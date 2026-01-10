<?php

namespace App\Tests\Functional;

use ApiPlatform\Symfony\Bundle\Test\ApiTestCase;
use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasher;

class ContactGroupFilterTest extends ApiTestCase
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
        $this->userUuid = 'user-filter-' . bin2hex(random_bytes(4));
        $user = new User();
        $user->setUuid($this->userUuid);
        $user->setPassword($hasher->hashPassword($user, 'password'));
        $em->persist($user);
        $em->flush();

        // Get tokens
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

    public function testFilterContactsByGroup(): void
    {
        $client = static::createClient();

        // Create Group A
        $response = $client->request('POST', '/api/groups', [
            'auth_bearer' => $this->token,
            'json' => ['name' => 'Group A'],
        ]);
        $groupAIri = $response->toArray()['@id'];

        // Create Group B
        $response = $client->request('POST', '/api/groups', [
            'auth_bearer' => $this->token,
            'json' => ['name' => 'Group B'],
        ]);
        $groupBIri = $response->toArray()['@id'];

        // Contact 1 in Group A
        $response = $client->request('POST', '/api/contacts', [
            'auth_bearer' => $this->token,
            'json' => [],
        ]);
        $contact1Iri = $response->toArray()['@id'];

        $client->request('POST', '/api/contact_groups', [
            'auth_bearer' => $this->token,
            'json' => [
                'contact' => $contact1Iri,
                'groupResource' => $groupAIri,
            ],
        ]);

        // Contact 2 in Group B
        $response = $client->request('POST', '/api/contacts', [
            'auth_bearer' => $this->token,
            'json' => [],
        ]);
        $contact2Iri = $response->toArray()['@id'];

        $client->request('POST', '/api/contact_groups', [
            'auth_bearer' => $this->token,
            'json' => [
                'contact' => $contact2Iri,
                'groupResource' => $groupBIri,
            ],
        ]);

        // Contact 3 in Group A
        $response = $client->request('POST', '/api/contacts', [
            'auth_bearer' => $this->token,
            'json' => [],
        ]);
        $contact3Iri = $response->toArray()['@id'];

        $client->request('POST', '/api/contact_groups', [
            'auth_bearer' => $this->token,
            'json' => [
                'contact' => $contact3Iri,
                'groupResource' => $groupAIri,
            ],
        ]);

        // Filter by Group A
        $response = $client->request('GET', '/api/contacts?contactGroups.groupResource=' . $groupAIri, [
            'auth_bearer' => $this->token,
            'headers' => ['Accept' => 'application/ld+json'],
        ]);

        self::assertResponseIsSuccessful();
        $responseArray = $response->toArray();
        /** @var array<int, array{id?: int, '@id': string}> $data */
        $data = $responseArray['member'] ?? [];

        self::assertCount(2, $data);
        $ids = array_map(fn ($c) => $c['@id'], $data);
        self::assertContains($contact1Iri, $ids);
        self::assertContains($contact3Iri, $ids);
        self::assertNotContains($contact2Iri, $ids);

        // Filter by Group B
        $response = $client->request('GET', '/api/contacts?contactGroups.groupResource=' . $groupBIri, [
            'auth_bearer' => $this->token,
            'headers' => ['Accept' => 'application/ld+json'],
        ]);

        self::assertResponseIsSuccessful();
        /** @var array<int, array{id?: int, '@id': string}> $data */
        $data = $response->toArray()['member'] ?? [];
        self::assertCount(1, $data);
        self::assertSame($contact2Iri, $data[0]['@id']);
    }
}
