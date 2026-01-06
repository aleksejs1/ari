<?php

namespace App\Tests\Functional;

use ApiPlatform\Symfony\Bundle\Test\ApiTestCase;
use App\Entity\Contact;
use App\Entity\ContactRelation;
use App\Entity\User;

class ContactRelationApiTest extends ApiTestCase
{
    protected static ?bool $alwaysBootKernel = false;

    private string $token;
    private string $userUuid;
    private int $contactId1;
    private int $contactId2;
    private string $contactIri1;
    private string $contactIri2;

    #[\Override]
    protected function setUp(): void
    {
        $container = self::getContainer();
        /** @var \Doctrine\Persistence\ManagerRegistry $doctrine */
        $doctrine = $container->get('doctrine');
        $em = $doctrine->getManager();

        /** @var \Symfony\Component\DependencyInjection\ContainerInterface $testContainer */
        $testContainer = $container->get('test.service_container');
        /** @var \Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface $hasher */
        $hasher = $testContainer->get('security.user_password_hasher');

        // User A
        $this->userUuid = 'user-' . bin2hex(random_bytes(4));
        $user = new User();
        $user->setUuid($this->userUuid);
        $user->setPassword($hasher->hashPassword($user, 'pass'));
        $em->persist($user);

        // Contacts for User A
        $contact1 = new Contact();
        $contact1->setUser($user);
        $em->persist($contact1);

        $contact2 = new Contact();
        $contact2->setUser($user);
        $em->persist($contact2);

        $em->flush();
        $this->contactId1 = (int) $contact1->getId();
        $this->contactId2 = (int) $contact2->getId();
        $this->contactIri1 = '/api/contacts/' . $this->contactId1;
        $this->contactIri2 = '/api/contacts/' . $this->contactId2;

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

    public function testCreateContactRelation(): void
    {
        $client = static::createClient();
        $response = $client->request('POST', '/api/contact_relations', [
            'auth_bearer' => $this->token,
            'json' => [
                'contact' => $this->contactIri1,
                'relatedContact' => $this->contactIri2,
                'type' => 'Friend',
            ],
        ]);

        self::assertResponseStatusCodeSame(201);
        $data = $response->toArray();
        self::assertEquals('Friend', $data['type']);

        // Use regex for contact IRI since we might have full path or relative
        // Standard API Platform returns IRIs
        self::assertStringContainsString($this->contactIri1, $data['contact']);
        self::assertStringContainsString($this->contactIri2, $data['relatedContact']);
    }

    public function testGetContactRelations(): void
    {
        // Setup existing relation
        $client = static::createClient();
        $container = self::getContainer();
        /** @var \Doctrine\Persistence\ManagerRegistry $doctrine */
        $doctrine = $container->get('doctrine');
        $em = $doctrine->getManager();
        $c1 = $em->find(Contact::class, $this->contactId1);
        $c2 = $em->find(Contact::class, $this->contactId2);

        $rel = new ContactRelation($c1);
        $rel->setPerson($c2);
        $rel->setType('Colleague');
        $em->persist($rel);
        $em->flush();

        $response = $client->request('GET', '/api/contact_relations', [
            'auth_bearer' => $this->token,
            'headers' => ['Accept' => 'application/ld+json'],
        ]);

        self::assertResponseIsSuccessful();
        $data = $response->toArray();
        self::assertArrayHasKey('member', $data);
        self::assertCount(1, $data['member']);
    }

    public function testSecurityUserCannotSeeOtherUsersData(): void
    {
        // Create User B and their data
        $client = static::createClient();
        $container = self::getContainer();
        /** @var \Doctrine\Persistence\ManagerRegistry $doctrine */
        $doctrine = $container->get('doctrine');
        $em = $doctrine->getManager();
        /** @var \Symfony\Component\DependencyInjection\ContainerInterface $testContainer */
        $testContainer = $container->get('test.service_container');
        /** @var \Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface $hasher */
        $hasher = $testContainer->get('security.user_password_hasher');

        $userB = new User();
        $userB->setUuid('user-b-' . bin2hex(random_bytes(4)));
        $userB->setPassword($hasher->hashPassword($userB, 'pass'));
        $em->persist($userB);

        $contactB1 = new Contact();
        $contactB1->setUser($userB);
        $em->persist($contactB1);

        $contactB2 = new Contact();
        $contactB2->setUser($userB);
        $em->persist($contactB2);

        $rel = new ContactRelation($contactB1);
        $rel->setPerson($contactB2);
        $rel->setType('Secret');
        $em->persist($rel);
        $em->flush();

        $relId = $rel->getId();

        // Try to access as User A
        $client->request('GET', '/api/contact_relations/' . (string) $relId, [
            'auth_bearer' => $this->token,
        ]);
        self::assertResponseStatusCodeSame(404); // Should be filtered out by Tenant/Security
    }
}
