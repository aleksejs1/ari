<?php

namespace Ari\Repository;

use Ari\Entity\ContactName;
use Ari\Entity\User;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<ContactName>
 */
class ContactNameRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, ContactName::class);
    }

    /**
     * Returns a batch of ContactNames for the given tenant, ordered by ID for consistent pagination.
     * Used by TriggerBatchAiAnalysisMessageHandler. Does NOT rely on the TenantFilter
     * (which is inactive in Messenger workers) — filters by tenant explicitly.
     *
     * @return list<ContactName>
     */
    public function findByTenantForBatch(User $tenant, int $limit, int $offset): array
    {
        /** @var list<ContactName> $result */
        $result = $this->createQueryBuilder('cn')
            ->where('cn.tenant = :tenant')
            ->setParameter('tenant', $tenant)
            ->orderBy('cn.id', 'ASC')
            ->setMaxResults($limit)
            ->setFirstResult($offset)
            ->getQuery()
            ->getResult();

        return $result;
    }
}
