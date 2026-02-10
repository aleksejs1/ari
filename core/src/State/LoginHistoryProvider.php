<?php

namespace Ari\State;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\Pagination\TraversablePaginator;
use ApiPlatform\State\ProviderInterface;
use Ari\ApiResource\LoginHistory;
use Ari\Entity\AuditLog;
use Ari\Entity\RefreshToken;
use Doctrine\Common\Util\ClassUtils;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\ORM\Tools\Pagination\Paginator;

/**
 * @implements ProviderInterface<LoginHistory>
 */
class LoginHistoryProvider implements ProviderInterface
{
    public function __construct(
        private readonly EntityManagerInterface $em,
    ) {
    }

    #[\Override]
    public function provide(Operation $operation, array $uriVariables = [], array $context = []): object|array|null
    {
        $page = (int) ($context['filters']['page'] ?? 1);
        $itemsPerPage = $operation->getPaginationItemsPerPage() ?? 30;
        if (isset($context['filters']['itemsPerPage'])) {
            $itemsPerPage = min((int) $context['filters']['itemsPerPage'], 100);
        }
        $offset = ($page - 1) * $itemsPerPage;

        $entityType = ClassUtils::getRealClass(RefreshToken::class);

        $qb = $this->em->createQueryBuilder()
            ->select('a')
            ->from(AuditLog::class, 'a')
            ->where('a.entityType = :entityType')
            ->andWhere('a.action = :action')
            ->setParameter('entityType', $entityType)
            ->setParameter('action', 'INSERT')
            ->orderBy('a.createdAt', 'DESC')
            ->setFirstResult($offset)
            ->setMaxResults($itemsPerPage);

        $doctrinePaginator = new Paginator($qb);
        $totalItems = $doctrinePaginator->count();

        $results = [];
        foreach ($doctrinePaginator as $auditLog) {
            \assert($auditLog instanceof AuditLog);
            $results[] = $this->toLoginHistory($auditLog);
        }

        return new TraversablePaginator(
            new \ArrayIterator($results),
            $page,
            $itemsPerPage,
            $totalItems,
        );
    }

    private function toLoginHistory(AuditLog $auditLog): LoginHistory
    {
        $snapshot = $auditLog->getSnapshotAfter() ?? [];

        return new LoginHistory(
            id: $auditLog->getId(),
            ipAddress: isset($snapshot['ipAddress']) && \is_string($snapshot['ipAddress']) ? $snapshot['ipAddress'] : null,
            userAgent: isset($snapshot['userAgent']) && \is_string($snapshot['userAgent']) ? $snapshot['userAgent'] : null,
            createdAt: $auditLog->getCreatedAt(),
        );
    }
}
