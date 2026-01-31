<?php

namespace Ari\Tests\Functional;

use ApiPlatform\Symfony\Bundle\Test\ApiTestCase;
use Ari\Entity\Contact;
use Ari\Entity\Group;
use Ari\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Uid\Uuid;

class DuplicateUuidTest extends ApiTestCase
{
    protected static ?bool $alwaysBootKernel = true;

    private string $userUuid1;
    private string $userUuid2;

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
        /** @var \Symfony\Component\PasswordHasher\Hasher\UserPasswordHasher $hasher */
        $hasher = $testContainer->get('security.user_password_hasher');

        // Create User 1
        $this->userUuid1 = 'user1-' . bin2hex(random_bytes(4));
        $user1 = new User();
        $user1->setUuid($this->userUuid1);
        $user1->setPassword($hasher->hashPassword($user1, 'pass'));
        $em->persist($user1);

        // Create User 2
        $this->userUuid2 = 'user2-' . bin2hex(random_bytes(4));
        $user2 = new User();
        $user2->setUuid($this->userUuid2);
        $user2->setPassword($hasher->hashPassword($user2, 'pass'));
        $em->persist($user2);

        $em->flush();
    }

    public function testDuplicateGroupUuidAllowed(): void
    {
        $container = self::getContainer();
        /** @var \Doctrine\Bundle\DoctrineBundle\Registry $doctrine */
        $doctrine = $container->get('doctrine');
        /** @var EntityManagerInterface $em */
        $em = $doctrine->getManager();

        $user1 = $em->getRepository(User::class)->findOneBy(['uuid' => $this->userUuid1]);
        $user2 = $em->getRepository(User::class)->findOneBy(['uuid' => $this->userUuid2]);

        $sharedUuid = Uuid::v7();

        // User 1 creates group
        $group1 = new Group();
        $group1->setName('Group 1');
        $group1->setUuid($sharedUuid);
        $group1->setUser($user1);
        $em->persist($group1);
        $em->flush();

        // User 2 creates group with SAME UUID
        $group2 = new Group();
        $group2->setName('Group 2');
        $group2->setUuid($sharedUuid);
        $group2->setUser($user2);
        $em->persist($group2);
        $em->flush();

        self::assertNotNull($group1->getId());
        self::assertNotNull($group2->getId());
    }

    public function testDuplicateContactUuidAllowed(): void
    {
        $sharedUuid = Uuid::v7()->toRfc4122();

        // User 1 creates contact
        // Note: Contact creation via API might not expose UUID setting directly if it's protected,
        // but let's assume for import purposes or if exposed it works.
        // If API doesn't allow setting UUID, we might need to use EntityManager directly.
        // Let's try API first as per typical usage.

        // Actually, looking at Contact entity,
        // UUID is not in 'contact:write' / 'contact:create' group
        // explicitly shown in the view_file output?
        // Wait, looking at view_file output for Contact.php:
        // #[Groups(['contact:read', 'export'])]
        // private ?Uuid $uuid = null;
        // It seems UUID is NOT in denormalization groups.
        // So we cannot set it via API unless we add the group or use EntityManager.
        // For testing "import" scenario which usually uses a specific logic or if we want to validte DB constraint,
        // we should probably use EntityManager to force specific UUIDs if API doesn't support it yet.
        // However, the user request mentioned "import", so likely the import logic sets it.
        // To verify the CONSTRAINT, using EntityManager is safer and more direct.

        $container = self::getContainer();
        /** @var \Doctrine\Bundle\DoctrineBundle\Registry $doctrine */
        $doctrine = $container->get('doctrine');
        /** @var EntityManagerInterface $em */
        $em = $doctrine->getManager();

        $user1 = $em->getRepository(User::class)->findOneBy(['uuid' => $this->userUuid1]);
        $user2 = $em->getRepository(User::class)->findOneBy(['uuid' => $this->userUuid2]);

        // Create Contact 1
        $contact1 = new Contact();
        $contact1->setUuid(Uuid::fromString($sharedUuid));
        $contact1->setUser($user1);
        $em->persist($contact1);
        $em->flush();

        // Create Contact 2 with SAME UUID
        $contact2 = new Contact();
        $contact2->setUuid(Uuid::fromString($sharedUuid));
        $contact2->setUser($user2);
        $em->persist($contact2);
        $em->flush();

        // If we reached here without exception, success!
        self::assertNotNull($contact1->getId());
        self::assertNotNull($contact2->getId());
    }
}
