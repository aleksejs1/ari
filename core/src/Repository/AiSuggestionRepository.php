<?php

namespace Ari\Repository;

use Ari\Entity\AiSuggestion;
use Ari\Entity\User;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<AiSuggestion>
 */
class AiSuggestionRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, AiSuggestion::class);
    }

    public function findBySuggestionKey(
        User $tenant,
        string $entityType,
        int $entityId,
        string $suggestionType,
        string $sourceHash,
    ): ?AiSuggestion {
        return $this->createQueryBuilder('s')
            ->where('s.tenant = :tenant')
            ->andWhere('s.entityType = :entityType')
            ->andWhere('s.entityId = :entityId')
            ->andWhere('s.suggestionType = :suggestionType')
            ->andWhere('s.sourceHash = :sourceHash')
            ->setParameter('tenant', $tenant)
            ->setParameter('entityType', $entityType)
            ->setParameter('entityId', $entityId)
            ->setParameter('suggestionType', $suggestionType)
            ->setParameter('sourceHash', $sourceHash)
            ->getQuery()
            ->getOneOrNullResult();
    }
}
