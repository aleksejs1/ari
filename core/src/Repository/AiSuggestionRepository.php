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

    /**
     * Returns pending suggestions for a specific entity, filtered by tenant.
     * Used by AiSuggestionProvider (active in HTTP context, TenantFilter may be inactive).
     *
     * @return list<AiSuggestion>
     */
    public function findByEntityForTenant(User $tenant, string $entityType, int $entityId): array
    {
        /** @var list<AiSuggestion> $result */
        $result = $this->createQueryBuilder('s')
            ->where('s.tenant = :tenant')
            ->andWhere('s.entityType = :entityType')
            ->andWhere('s.entityId = :entityId')
            ->andWhere('s.status = :status')
            ->setParameter('tenant', $tenant)
            ->setParameter('entityType', $entityType)
            ->setParameter('entityId', $entityId)
            ->setParameter('status', 'pending')
            ->getQuery()
            ->getResult();

        return $result;
    }

    /**
     * Returns aggregated token/status stats for the tenant.
     *
     * @return array{pending: int, accepted: int, dismissed: int, error: int, skipped: int, tokensPrompt: int, tokensCompletion: int}
     */
    public function getStatsByTenant(User $tenant): array
    {
        /** @var list<array{status: string, cnt: int|string, promptTokens: int|string, completionTokens: int|string}> $rows */
        $rows = $this->createQueryBuilder('s')
            ->select(
                's.status',
                'COUNT(s.id) as cnt',
                'COALESCE(SUM(s.tokensPrompt), 0) as promptTokens',
                'COALESCE(SUM(s.tokensCompletion), 0) as completionTokens',
            )
            ->where('s.tenant = :tenant')
            ->setParameter('tenant', $tenant)
            ->groupBy('s.status')
            ->getQuery()
            ->getArrayResult();

        $stats = [
            'pending' => 0,
            'accepted' => 0,
            'dismissed' => 0,
            'error' => 0,
            'skipped' => 0,
            'tokensPrompt' => 0,
            'tokensCompletion' => 0,
        ];

        foreach ($rows as $row) {
            $status = $row['status'];
            if (\array_key_exists($status, $stats)) {
                $stats[$status] = (int) $row['cnt'];
            }
            $stats['tokensPrompt'] += (int) $row['promptTokens'];
            $stats['tokensCompletion'] += (int) $row['completionTokens'];
        }

        return $stats;
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
