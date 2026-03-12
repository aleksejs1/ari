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
}
