<?php

namespace Ari\Repository;

use Ari\Entity\Contact;
use Ari\Entity\User;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Contact>
 */
class ContactRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Contact::class);
    }

    /**
     * Returns the number of contacts owned by the given user.
     * Used by EntitlementService for quota checks.
     * The Doctrine TenantFilter is also active during normal requests,
     * but the explicit WHERE clause makes this safe in all contexts (tests, CLI, etc.).
     */
    public function countByTenant(User $user): int
    {
        return (int) $this->createQueryBuilder('c')
            ->select('COUNT(c.id)')
            ->andWhere('c.tenant = :tenant')
            ->setParameter('tenant', $user)
            ->getQuery()
            ->getSingleScalarResult();
    }

    /**
     * Given a list of UUID strings, returns those that already exist in DB for the given user.
     * Used by XmlImportService for quota pre-check (Phase 0).
     *
     * @param string[] $uuids RFC4122 UUID strings from the import file
     *
     * @return string[] Subset of $uuids that exist in the database (as RFC4122 strings)
     */
    public function findExistingUuids(array $uuids, User $user): array
    {
        if ([] === $uuids) {
            return [];
        }

        // Convert strings to Uuid objects for type-safe Doctrine queries.
        // Doctrine's UUID type handles object→binary/string conversion; raw strings in
        // IN clauses may not be converted automatically in all driver configurations.
        $uuidObjects = [];
        foreach ($uuids as $uuidStr) {
            try {
                $uuidObjects[] = \Symfony\Component\Uid\Uuid::fromString($uuidStr);
            } catch (\InvalidArgumentException) {
                // Skip malformed UUIDs from the import file
            }
        }

        if ([] === $uuidObjects) {
            return [];
        }

        /** @var Contact[] $contacts */
        $contacts = $this->findBy(['uuid' => $uuidObjects, 'tenant' => $user]);

        $result = [];
        foreach ($contacts as $contact) {
            $uuid = $contact->getUuid()?->toRfc4122();
            if (null !== $uuid) {
                $result[] = $uuid;
            }
        }

        return $result;
    }
}
