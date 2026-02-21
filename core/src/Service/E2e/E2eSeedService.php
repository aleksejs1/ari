<?php

namespace Ari\Service\E2e;

use Ari\Entity\Contact;
use Ari\Entity\ContactDate;
use Ari\Entity\ContactEmailAdress;
use Ari\Entity\ContactGroup;
use Ari\Entity\ContactName;
use Ari\Entity\ContactPhoneNumber;
use Ari\Entity\Group;
use Ari\Entity\NotificationChannel;
use Ari\Entity\NotificationPolicy;
use Ari\Entity\NotificationRule;
use Ari\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

class E2eSeedService
{
    public function __construct(
        private readonly EntityManagerInterface $entityManager,
        private readonly UserPasswordHasherInterface $passwordHasher,
        private readonly JWTTokenManagerInterface $jwtManager,
    ) {
    }

    public function seed(): void
    {
        $this->disableTenantFilter();
        $this->truncateAllTables();

        $userA = $this->createUser('e2e-user', 'e2e-password', ['ROLE_USER']);
        $userB = $this->createUser('e2e-user-b', 'e2e-password', ['ROLE_USER']);
        $this->createUser('e2e-admin', 'e2e-password', ['ROLE_ADMIN']);

        $this->seedUserA($userA);
        $this->seedUserB($userB);

        $this->entityManager->flush();
        $this->enableTenantFilter();
    }

    /**
     * @return array{token: string, email: string}
     */
    public function createIsolatedUser(string $uuid, string $password): array
    {
        $this->disableTenantFilter();

        $user = $this->createUser($uuid, $password, ['ROLE_USER']);

        $group = new Group();
        $group->setName('Test Group');
        $group->setColor('#6366f1');
        $group->setUser($user);
        $this->entityManager->persist($group);

        $contact = new Contact();
        $contact->setUser($user);
        $this->entityManager->persist($contact);

        $name = new ContactName($contact);
        $name->setGiven('Test');
        $name->setFamily('Contact');
        $this->entityManager->persist($name);

        $email = new ContactEmailAdress($contact);
        $email->setValue($uuid . '@e2e.local');
        $email->setType('personal');
        $this->entityManager->persist($email);

        $this->entityManager->flush();
        $this->enableTenantFilter();

        $token = $this->jwtManager->create($user);

        return ['token' => $token, 'email' => $uuid . '@e2e.local'];
    }

    public function deleteUser(string $uuid): void
    {
        $this->disableTenantFilter();

        $user = $this->entityManager->getRepository(User::class)->findOneBy(['uuid' => $uuid]);
        if (null !== $user) {
            $this->entityManager->remove($user);
            $this->entityManager->flush();
        }

        $this->enableTenantFilter();
    }

    public function cleanupOrphanedUsers(): int
    {
        $this->disableTenantFilter();

        $seedUsers = ['e2e-user', 'e2e-user-b', 'e2e-admin'];

        $qb = $this->entityManager->getRepository(User::class)->createQueryBuilder('u');
        $orphans = $qb
            ->where($qb->expr()->like('u.uuid', ':prefix'))
            ->andWhere($qb->expr()->notIn('u.uuid', ':seedUsers'))
            ->setParameter('prefix', 'e2e-%')
            ->setParameter('seedUsers', $seedUsers)
            ->getQuery()
            ->getResult();

        $count = 0;
        /** @var User $user */
        foreach ($orphans as $user) {
            $this->entityManager->remove($user);
            ++$count;
        }

        if ($count > 0) {
            $this->entityManager->flush();
        }

        $this->enableTenantFilter();

        return $count;
    }

    /**
     * @param list<string> $roles
     */
    private function createUser(string $uuid, string $password, array $roles): User
    {
        $user = new User();
        $user->setUuid($uuid);
        $user->setRoles($roles);
        $user->setPassword($this->passwordHasher->hashPassword($user, $password));
        $this->entityManager->persist($user);

        return $user;
    }

    private function seedUserA(User $user): void
    {
        $family = $this->createGroup($user, 'Family', '#ef4444');
        $work = $this->createGroup($user, 'Work', '#3b82f6');
        $friends = $this->createGroup($user, 'Friends', '#22c55e');

        $this->createContact($user, 'John', 'Doe', [
            'email' => 'john.doe@example.com',
            'phone' => '+1-555-0101',
            'birthday' => '1990-03-15',
            'groups' => [$family],
        ]);

        $this->createContact($user, 'Jane', 'Smith', [
            'email' => 'jane.smith@example.com',
            'phone' => '+1-555-0102',
            'groups' => [$work],
        ]);

        $this->createContact($user, 'Bob', 'Wilson', [
            'email' => 'bob.wilson@example.com',
            'groups' => [$friends],
        ]);

        for ($i = 1; $i <= 7; ++$i) {
            $this->createContact($user, "Test{$i}", "Contact{$i}", [
                'email' => "test{$i}@example.com",
            ]);
        }

        $webChannel = new NotificationChannel();
        $webChannel->setUser($user);
        $webChannel->setType('web');
        $webChannel->setConfig([]);
        $this->entityManager->persist($webChannel);

        $policy = new NotificationPolicy();
        $policy->setUser($user);
        $policy->setName('Birthday Reminders');
        $policy->setIsActive(true);
        $this->entityManager->persist($policy);

        $rule = new NotificationRule();
        $rule->setPolicy($policy);
        $rule->setChannel($webChannel);
        $rule->setEventType('birthday');
        $rule->setOffsetDays(1);
        $rule->setTenant($user);
        $this->entityManager->persist($rule);
    }

    private function seedUserB(User $user): void
    {
        $this->createGroup($user, 'Private Group', '#a855f7');
        $this->createContact($user, 'Secret', 'Person', [
            'email' => 'secret@example.com',
        ]);
    }

    private function createGroup(User $user, string $name, string $color): Group
    {
        $group = new Group();
        $group->setName($name);
        $group->setColor($color);
        $group->setUser($user);
        $this->entityManager->persist($group);

        return $group;
    }

    /**
     * @param array{email?: string, phone?: string, birthday?: string, groups?: Group[]} $data
     */
    private function createContact(User $user, string $given, string $family, array $data): void
    {
        $contact = new Contact();
        $contact->setUser($user);
        $this->entityManager->persist($contact);

        $name = new ContactName($contact);
        $name->setGiven($given);
        $name->setFamily($family);
        $this->entityManager->persist($name);

        if (isset($data['email'])) {
            $email = new ContactEmailAdress($contact);
            $email->setValue($data['email']);
            $email->setType('personal');
            $this->entityManager->persist($email);
        }

        if (isset($data['phone'])) {
            $phone = new ContactPhoneNumber($contact);
            $phone->setValue($data['phone']);
            $phone->setType('mobile');
            $this->entityManager->persist($phone);
        }

        if (isset($data['birthday'])) {
            $date = new ContactDate($contact);
            $date->setText('Birthday');
            $date->setDate(new \DateTime($data['birthday']));
            $this->entityManager->persist($date);
        }

        foreach ($data['groups'] ?? [] as $group) {
            $cg = new ContactGroup($contact);
            $cg->setGroupResource($group);
            $this->entityManager->persist($cg);
        }
    }

    private function truncateAllTables(): void
    {
        $connection = $this->entityManager->getConnection();
        $platform = $connection->getDatabasePlatform();
        $isSqlite = $platform instanceof \Doctrine\DBAL\Platforms\SqlitePlatform;

        if ($isSqlite) {
            $connection->executeStatement('PRAGMA journal_mode = WAL');
            $connection->executeStatement('PRAGMA foreign_keys = OFF');
        } else {
            $connection->executeStatement('SET FOREIGN_KEY_CHECKS = 0');
        }

        $tables = $connection->createSchemaManager()->listTableNames();
        foreach ($tables as $table) {
            if ('doctrine_migration_versions' === $table) {
                continue;
            }
            if ($isSqlite) {
                $connection->executeStatement(sprintf('DELETE FROM "%s"', $table));
            } else {
                $connection->executeStatement(sprintf('TRUNCATE TABLE `%s`', $table));
            }
        }

        if ($isSqlite) {
            $connection->executeStatement('DELETE FROM sqlite_sequence');
            $connection->executeStatement('PRAGMA foreign_keys = ON');
        } else {
            $connection->executeStatement('SET FOREIGN_KEY_CHECKS = 1');
        }
    }

    private function disableTenantFilter(): void
    {
        $filters = $this->entityManager->getFilters();
        if ($filters->isEnabled('tenant')) {
            $filters->disable('tenant');
        }
    }

    private function enableTenantFilter(): void
    {
        $filters = $this->entityManager->getFilters();
        if (!$filters->isEnabled('tenant')) {
            $filters->enable('tenant');
        }
    }
}
