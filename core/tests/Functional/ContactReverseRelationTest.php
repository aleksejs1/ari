<?php

namespace App\Tests\Functional;

use ApiPlatform\Symfony\Bundle\Test\ApiTestCase;
use App\Entity\Contact;
use App\Entity\ContactRelation;
use App\Entity\User;

class ContactReverseRelationTest extends ApiTestCase
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

        // User A
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

    public function testGetContactWithReverseRelationAndValidIri(): void
    {
        $client = static::createClient();
        $container = self::getContainer();
        /** @var \Doctrine\Bundle\DoctrineBundle\Registry $doctrine */
        $doctrine = $container->get('doctrine');
        $em = $doctrine->getManager();
        $user = $em->getRepository(User::class)->findOneBy(['uuid' => $this->userUuid]);

        // Contact A (Me)
        $me = new Contact();
        $me->setUser($user);
        $em->persist($me);

        // Contact B (My Sister)
        $mySister = new Contact();
        $mySister->setUser($user);
        $em->persist($mySister);

        $bio = new \App\Entity\ContactBiography();
        $bio->setType('Gender');
        $bio->setValue('female');
        $mySister->addContactBiography($bio);
        $em->persist($bio);

        // Relation: My Sister (contact) -> Me (person/relatedContact) is 'sister'
        // This means from "Me" perspective (reverse relation), she is my Sister.
        // Wait, if she is the 'contact', and she says "Me is my sister", then...

        // Let's model: B (Sister) claims A (Me) is her Brother.
        // contact=B, person=A, type=Brother.
        // Then browsing A (Me), I should see B listed as Sister (reverse of Brother).

        // Let's do:
        // A (Me)
        // B (Sister)
        // Relation: contact=B, person=A, type=Brother

        $rel = new ContactRelation($mySister);
        $rel->setPerson($me); // Me is the 'relatedContact' of B
        $rel->setType('Brother');
        $em->persist($rel);
        $em->flush();

        $meId = $me->getId();
        $relId = $rel->getId();

        // Fetch Me (Contact A)
        $response = $client->request('GET', '/api/contacts/' . (string) $meId, [
            'auth_bearer' => $this->token,
            'headers' => ['Accept' => 'application/ld+json'],
        ]);

        self::assertResponseIsSuccessful();
        $data = $response->toArray();

        self::assertArrayHasKey('contactRelations', $data);
        // Should have 1 relation (reverse one)
        self::assertCount(1, $data['contactRelations']);

        $reverseRelData = $data['contactRelations'][0];

        // Check Type Inversion
        // If B says "A is my Brother", then A sees "B is my Sister".
        self::assertEquals('Sister', $reverseRelData['type']);

        // Check DisplayName
        self::assertArrayHasKey('displayName', $reverseRelData);
        self::assertEquals('Unknown Contact', $reverseRelData['displayName']);

        // Check IRI presence (The Fix Verification)
        // The item should have a valid @id
        self::assertArrayHasKey('@id', $reverseRelData);
        // It should match the original relation ID
        self::assertStringEndsWith('/api/contact_relations/' . (string) $relId, $reverseRelData['@id']);
    }
}
