<?php

namespace App\Tests\Functional;

use App\Entity\Contact;
use App\Entity\ContactGroup;
use App\Entity\Group;
use App\Entity\ImportMapping;
use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;

class GroupDeletionTest extends AbstractApiTestCase
{
    public function testDeletingGroupCascadesToMappingsAndLinks(): void
    {
        $client = static::createClient();
        $container = self::getContainer();
        /** @var \Doctrine\Persistence\ManagerRegistry $doctrine */
        $doctrine = $container->get('doctrine');
        /** @var EntityManagerInterface $em */
        $em = $doctrine->getManager();

        // 1. Find the test user (created in AbstractApiTestCase setup)
        $user = $em->getRepository(User::class)->findOneBy(['uuid' => $this->userUuid]);
        self::assertInstanceOf(User::class, $user);

        // 2. Create a Group
        $group = new Group();
        $group->setName('Test Group');
        $group->setUser($user);
        $em->persist($group);

        // 3. Create a Contact
        $contact = new Contact();
        $contact->setUser($user);
        $em->persist($contact);

        // 4. Create an ImportMapping for the Group
        $mapping = new ImportMapping();
        $mapping->setUser($user);
        $mapping->setType('google_group');
        $mapping->setExternalId('group123');
        $mapping->setGroup($group);
        $em->persist($mapping);

        // 5. Create a ContactGroup linking Contact and Group
        $contactGroup = new ContactGroup($contact);
        $contactGroup->setGroupResource($group);
        $em->persist($contactGroup);

        $em->flush();

        $groupId = $group->getId();
        $mappingId = $mapping->getId();
        $contactGroupId = $contactGroup->getId();

        self::assertNotNull($groupId);
        self::assertNotNull($mappingId);
        self::assertNotNull($contactGroupId);

        // 6. Delete the Group via API
        $client->request('DELETE', '/api/groups/' . $groupId, [
            'auth_bearer' => $this->token,
        ]);
        self::assertResponseStatusCodeSame(204);

        // 7. Verify Group is gone
        $em->clear();
        $deletedGroup = $em->find(Group::class, $groupId);
        self::assertNull($deletedGroup, 'Group was not deleted');

        // 8. Verify ImportMapping is gone (Cascaded)
        $deletedMapping = $em->find(ImportMapping::class, $mappingId);
        self::assertNull($deletedMapping, 'ImportMapping was not cascaded deleted');

        // 9. Verify ContactGroup is gone (Cascaded)
        $deletedContactGroup = $em->find(ContactGroup::class, $contactGroupId);
        self::assertNull($deletedContactGroup, 'ContactGroup was not cascaded deleted');
    }
}
