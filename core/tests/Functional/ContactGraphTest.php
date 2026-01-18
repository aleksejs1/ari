<?php

namespace App\Tests\Functional;

use App\Entity\Contact;
use App\Entity\ContactRelation;
use App\Entity\User;

class ContactGraphTest extends AbstractApiTestCase
{
    public function testGetContactGraph(): void
    {
        $client = static::createClient();

        $container = self::getContainer();
        $em = $container->get('doctrine')->getManager();

        $user = $em->getRepository(User::class)->findOneBy(['uuid' => $this->userUuid]);

        // 1. Create contacts
        $contactA = new Contact();
        $contactA->setUser($user);
        $em->persist($contactA);

        $contactB = new Contact();
        $contactB->setUser($user);
        $em->persist($contactB);

        // 2. Create relation
        $relation = new ContactRelation($contactA);
        $relation->setPerson($contactB);
        $relation->setType('friend');
        $em->persist($relation);

        $em->flush();

        // 3. Test API
        $client->request('GET', '/api/contact-graph', [
            'auth_bearer' => $this->token,
        ]);

        static::assertResponseIsSuccessful();
        static::assertJsonContains([
            'nodes' => [
                ['id' => $contactA->getId(), 'user' => 'Unknown Contact'],
                ['id' => $contactB->getId(), 'user' => 'Unknown Contact'],
            ],
            'links' => [
                ['source' => $contactA->getId(), 'target' => $contactB->getId()],
            ],
        ]);
    }

    public function testGetContactGraphMultiTenancy(): void
    {
        $client = static::createClient();
        $container = self::getContainer();
        $em = $container->get('doctrine')->getManager();

        /** @var \Symfony\Component\DependencyInjection\Container $testContainer */
        $testContainer = $container->get('test.service_container');
        /** @var \Symfony\Component\PasswordHasher\Hasher\UserPasswordHasher $hasher */
        $hasher = $testContainer->get('security.user_password_hasher');

        // User 2 with no contacts
        $user2 = new User();
        $user2->setUuid('user-2-graph-' . bin2hex(random_bytes(4)));
        $user2->setPassword($hasher->hashPassword($user2, 'pass'));
        $em->persist($user2);
        $em->flush();

        $token2 = $this->getToken($user2->getUserIdentifier(), 'pass');

        // Login as User 2 and check graph (should be empty)
        $response = $client->request('GET', '/api/contact-graph', [
            'auth_bearer' => $token2,
        ]);

        static::assertResponseIsSuccessful();
        $data = $response->toArray();
        static::assertSame([], $data['nodes']);
        static::assertSame([], $data['links']);
    }
}
