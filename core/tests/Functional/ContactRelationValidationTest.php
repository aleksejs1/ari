<?php

namespace App\Tests\Functional;

use ApiPlatform\Symfony\Bundle\Test\ApiTestCase;
use App\Entity\Contact;
use App\Entity\User;

class ContactRelationValidationTest extends ApiTestCase
{
    protected static ?bool $alwaysBootKernel = false;

    private string $token;
    private string $userUuid;

    #[\Override]
    protected function setUp(): void
    {
        $container = self::getContainer();
        /** @var \Doctrine\Bundle\DoctrineBundle\Registry $doctrine */
        $doctrine = $container->get('doctrine');
        $em = $doctrine->getManager();

        /** @var \Symfony\Component\DependencyInjection\Container $testContainer */
        $testContainer = $container->get('test.service_container');
        /** @var \Symfony\Component\PasswordHasher\Hasher\UserPasswordHasher $hasher */
        $hasher = $testContainer->get('security.user_password_hasher');

        // User
        $this->userUuid = 'user-' . bin2hex(random_bytes(4));
        $user = new User();
        $user->setUuid($this->userUuid);
        $user->setPassword($hasher->hashPassword($user, 'pass'));
        $em->persist($user);

        $em->flush();

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

    public function testSelfRelationIsIgnored(): void
    {
        $client = static::createClient();
        $container = self::getContainer();
        /** @var \Doctrine\Bundle\DoctrineBundle\Registry $doctrine */
        $doctrine = $container->get('doctrine');
        $em = $doctrine->getManager();

        $user = $em->getRepository(User::class)->findOneBy(['uuid' => $this->userUuid]);

        $contact = new Contact();
        $contact->setUser($user);
        $em->persist($contact);
        $em->flush();

        $contactId = (string) $contact->getId();

        // PUT on existing contact to test self-reference
        $response = $client->request('PUT', '/api/contacts/' . $contactId, [
            'auth_bearer' => $this->token,
            'json' => [
                'contactRelations' => [
                    [
                        'relatedContact' => '/api/contacts/' . $contactId,
                        'type' => 'Self',
                    ],
                ],
            ],
        ]);

        self::assertResponseIsSuccessful();
        $data = $response->toArray();

        // Should have 0 relations
        self::assertCount(0, $data['contactRelations'], 'Self-relation should be ignored');

        // Verify in DB
        $em->clear();
        $reloaded = $em->find(Contact::class, $contactId);
        self::assertInstanceOf(Contact::class, $reloaded);
        self::assertCount(
            0,
            $reloaded->getContactRelationsCollection(),
            'DB should have 0 relations (self-reference ignored)'
        );
    }

    public function testDuplicateRelationIsIgnored(): void
    {
        $client = static::createClient();
        $container = self::getContainer();
        /** @var \Doctrine\Bundle\DoctrineBundle\Registry $doctrine */
        $doctrine = $container->get('doctrine');
        $em = $doctrine->getManager();

        $user = $em->getRepository(User::class)->findOneBy(['uuid' => $this->userUuid]);

        $mainContact = new Contact();
        $mainContact->setUser($user);
        $em->persist($mainContact);

        $otherContact = new Contact();
        $otherContact->setUser($user);
        $em->persist($otherContact);
        $em->flush();

        $mainContactId = (string) $mainContact->getId();
        $otherContactId = (string) $otherContact->getId();

        // PUT with two identical relations
        $response = $client->request('PUT', '/api/contacts/' . $mainContactId, [
            'auth_bearer' => $this->token,
            'json' => [
                'contactRelations' => [
                    [
                        'relatedContact' => '/api/contacts/' . $otherContactId,
                        'type' => 'Friend',
                    ],
                    [
                        'relatedContact' => '/api/contacts/' . $otherContactId,
                        'type' => 'Friend',
                    ],
                ],
            ],
        ]);

        self::assertResponseIsSuccessful();
        $data = $response->toArray();

        // Should have only 1 relation
        self::assertCount(1, $data['contactRelations'], 'Duplicate relation should be ignored');

        // Verify in DB
        $em->clear();
        $reloaded = $em->find(Contact::class, $mainContactId);
        self::assertInstanceOf(Contact::class, $reloaded);
        self::assertCount(
            1,
            $reloaded->getContactRelationsCollection(),
            'DB should have only 1 relation (duplicate ignored)'
        );
    }

    public function testDifferentTypeDuplicateIsAllowed(): void
    {
        $client = static::createClient();
        $container = self::getContainer();
        /** @var \Doctrine\Bundle\DoctrineBundle\Registry $doctrine */
        $doctrine = $container->get('doctrine');
        $em = $doctrine->getManager();

        $user = $em->getRepository(User::class)->findOneBy(['uuid' => $this->userUuid]);

        $mainContact = new Contact();
        $mainContact->setUser($user);
        $em->persist($mainContact);

        $otherContact = new Contact();
        $otherContact->setUser($user);
        $em->persist($otherContact);
        $em->flush();

        $mainContactId = (string) $mainContact->getId();
        $otherContactId = (string) $otherContact->getId();

        // PUT with two relations of different types for same person
        $response = $client->request('PUT', '/api/contacts/' . $mainContactId, [
            'auth_bearer' => $this->token,
            'json' => [
                'contactRelations' => [
                    [
                        'relatedContact' => '/api/contacts/' . $otherContactId,
                        'type' => 'Colleague',
                    ],
                    [
                        'relatedContact' => '/api/contacts/' . $otherContactId,
                        'type' => 'Friend',
                    ],
                ],
            ],
        ]);

        self::assertResponseIsSuccessful();
        $data = $response->toArray();

        // Should have 2 relations
        self::assertCount(
            2,
            $data['contactRelations'],
            'Relations with same person but different types should be allowed'
        );

        // Verify in DB
        $em->clear();
        $reloaded = $em->find(Contact::class, $mainContactId);
        self::assertInstanceOf(Contact::class, $reloaded);
        self::assertCount(2, $reloaded->getContactRelationsCollection(), 'DB should have 2 relations');
    }

    public function testDuplicateRelationInPostIsIgnored(): void
    {
        $client = static::createClient();
        $container = self::getContainer();
        /** @var \Doctrine\Bundle\DoctrineBundle\Registry $doctrine */
        $doctrine = $container->get('doctrine');
        $em = $doctrine->getManager();

        $user = $em->getRepository(User::class)->findOneBy(['uuid' => $this->userUuid]);

        $otherContact = new Contact();
        $otherContact->setUser($user);
        $em->persist($otherContact);
        $em->flush();

        $otherContactId = (string) $otherContact->getId();

        // POST new contact with two identical relations
        $response = $client->request('POST', '/api/contacts', [
            'auth_bearer' => $this->token,
            'json' => [
                'displayName' => 'Multi-Rel Contact',
                'contactRelations' => [
                    [
                        'relatedContact' => '/api/contacts/' . $otherContactId,
                        'type' => 'Twin',
                    ],
                    [
                        'relatedContact' => '/api/contacts/' . $otherContactId,
                        'type' => 'Twin',
                    ],
                ],
            ],
        ]);

        self::assertResponseIsSuccessful();
        $data = $response->toArray();

        // Should have only 1 relation
        self::assertCount(1, $data['contactRelations'], 'Duplicate relation in POST should be ignored');
    }
}
