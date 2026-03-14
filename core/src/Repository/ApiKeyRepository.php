<?php

namespace Ari\Repository;

use Ari\Entity\ApiKey;
use Ari\Entity\User;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<ApiKey>
 */
class ApiKeyRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, ApiKey::class);
    }

    public function findBySecretHash(string $hash): ?ApiKey
    {
        return $this->findOneBy(['secretHash' => $hash]);
    }

    public function countByTenant(User $user): int
    {
        return (int) $this->createQueryBuilder('k')
            ->select('COUNT(k.id)')
            ->andWhere('k.tenant = :tenant')
            ->setParameter('tenant', $user)
            ->getQuery()
            ->getSingleScalarResult();
    }

    /**
     * @return ApiKey[]
     */
    public function findByTenant(User $user, int $limit, int $offset): array
    {
        return $this->createQueryBuilder('k')
            ->andWhere('k.tenant = :tenant')
            ->setParameter('tenant', $user)
            ->orderBy('k.createdAt', 'DESC')
            ->setMaxResults($limit)
            ->setFirstResult($offset)
            ->getQuery()
            ->getResult();
    }
}
