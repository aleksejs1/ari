<?php

declare(strict_types=1);

namespace Ari\Tests\Functional;

use Ari\Entity\Contact;
use Ari\Entity\Group;
use Ari\Entity\TokenStorage;
use Ari\Entity\User;
use Doctrine\ORM\EntityManagerInterface;

final class UserDeletionTest extends AbstractApiTestCase
{
    public function testDeleteUserRemovesAllData(): void
    {
        $client = static::createClient();
        $container = self::getContainer();
        /** @var \Doctrine\Bundle\DoctrineBundle\Registry $doctrine */
        $doctrine = $container->get('doctrine');
        /** @var EntityManagerInterface $em */
        $em = $doctrine->getManager();

        // 1. Get the current user
        $user = $em->getRepository(User::class)->findOneBy(['uuid' => $this->userUuid]);
        self::assertInstanceOf(User::class, $user);
        $userId = $user->getId();

        // 2. Create associated data
        $contact = new Contact();
        $contact->setUser($user);
        $em->persist($contact);

        $group = new Group();
        $group->setName('User Delete Group');
        $group->setUser($user);
        $em->persist($group);

        $tokenStorage = new TokenStorage();
        $tokenStorage->setUser($user);
        $tokenStorage->setType('test');
        $em->persist($tokenStorage);

        $em->flush();

        $contactId = $contact->getId();
        $groupId = $group->getId();
        $tokenId = $tokenStorage->getId();

        self::assertNotNull($userId);
        self::assertNotNull($contactId);
        self::assertNotNull($groupId);
        self::assertNotNull($tokenId);

        // 3. Delete the user via API
        $client->request('DELETE', '/api/profile', [
            'auth_bearer' => $this->token,
        ]);
        self::assertResponseStatusCodeSame(204);

        // 4. Verify all data is gone
        $em->clear();

        self::assertNull($em->find(User::class, $userId), 'User was not deleted');
        self::assertNull($em->find(Contact::class, $contactId), 'Contact was not cascaded deleted');
        self::assertNull($em->find(Group::class, $groupId), 'Group was not cascaded deleted');
        self::assertNull($em->find(TokenStorage::class, $tokenId), 'TokenStorage was not cascaded deleted');
    }
}
