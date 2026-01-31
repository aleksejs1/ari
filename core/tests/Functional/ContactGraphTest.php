<?php

namespace Ari\Tests\Functional;

use Ari\Entity\Contact;
use Ari\Entity\ContactRelation;
use Ari\Entity\User;

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

    public function testLevelFiltering(): void
    {
        $client = static::createClient();
        $em = self::getContainer()->get('doctrine')->getManager();
        $user = $em->getRepository(User::class)->findOneBy(['uuid' => $this->userUuid]);

        // A -> B -> C
        $contactA = new Contact(); $contactA->setUser($user); $em->persist($contactA);
        $contactB = new Contact(); $contactB->setUser($user); $em->persist($contactB);
        $contactC = new Contact(); $contactC->setUser($user); $em->persist($contactC);

        $relAB = new ContactRelation($contactA); $relAB->setPerson($contactB); $em->persist($relAB);
        $relBC = new ContactRelation($contactB); $relBC->setPerson($contactC); $em->persist($relBC);
        $em->flush();

        // Level 1 from A: A, B
        $response = $client->request('GET', '/api/contact-graph?contactId=' . (int) $contactA->getId() . '&level=1', [
            'auth_bearer' => $this->token,
        ]);
        static::assertResponseIsSuccessful();
        $data = $response->toArray();
        static::assertCount(2, $data['nodes']);
        static::assertCount(1, $data['links']);

        // Level 2 from A: A, B, C
        $response = $client->request('GET', '/api/contact-graph?contactId=' . (int) $contactA->getId() . '&level=2', [
            'auth_bearer' => $this->token,
        ]);
        static::assertResponseIsSuccessful();
        $data = $response->toArray();
        static::assertCount(3, $data['nodes']);
        static::assertCount(2, $data['links']);
    }

    public function testGroupFiltering(): void
    {
        $client = static::createClient();
        $em = self::getContainer()->get('doctrine')->getManager();
        $user = $em->getRepository(User::class)->findOneBy(['uuid' => $this->userUuid]);

        $group = new \Ari\Entity\Group();
        $group->setUser($user);
        $group->setName('Test Group');
        $em->persist($group);

        $contactInGroup = new Contact(); $contactInGroup->setUser($user); $em->persist($contactInGroup);
        $contactOutGroup = new Contact(); $contactOutGroup->setUser($user); $em->persist($contactOutGroup);

        $cg = new \Ari\Entity\ContactGroup($contactInGroup);
        $cg->setGroupResource($group);
        $em->persist($cg);

        $rel = new ContactRelation($contactInGroup);
        $rel->setPerson($contactOutGroup);
        $em->persist($rel);
        $em->flush();

        $response = $client->request('GET', '/api/contact-graph?groupId=' . (int) $group->getId(), [
            'auth_bearer' => $this->token,
        ]);
        static::assertResponseIsSuccessful();
        $data = $response->toArray();

        // Should contain both contacts (one is in group, other is connected to it)
        static::assertCount(2, $data['nodes']);
        static::assertCount(1, $data['links']);
    }
}
