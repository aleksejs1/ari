<?php

namespace Ari\Repository;

use Ari\Entity\AuditLog;
use Ari\Entity\Contact;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<AuditLog>
 */
class AuditLogRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, AuditLog::class);
    }

    /**
     * Fetch all timeline audit logs for a contact up to (and including) the target log,
     * sorted in chronological order (ASC by createdAt, then ASC by id).
     *
     * @return list<AuditLog>
     */
    public function findTimelineLogsUpTo(int|string $contactId, int $targetLogId): array
    {
        $contactId = (string) $contactId;
        $contactClass = Contact::class;

        // First, get the target log's createdAt to bound the query
        $targetLog = $this->find($targetLogId);
        if (null === $targetLog) {
            return [];
        }

        // Verify the target log belongs to this contact
        $belongsToContact = ($targetLog->getEntityType() === $contactClass && $targetLog->getEntityId() === $contactId)
            || ($targetLog->getOwnerEntityType() === $contactClass && $targetLog->getOwnerEntityId() === $contactId);

        if (!$belongsToContact) {
            return [];
        }

        $qb = $this->createQueryBuilder('a')
            ->where('(a.entityType = :contactClass AND a.entityId = :contactId)')
            ->orWhere('(a.ownerEntityType = :contactClass AND a.ownerEntityId = :contactId)')
            ->andWhere('a.createdAt <= :targetDate OR (a.createdAt = :targetDate AND a.id <= :targetLogId)')
            ->setParameter('contactClass', $contactClass)
            ->setParameter('contactId', $contactId)
            ->setParameter('targetDate', $targetLog->getCreatedAt())
            ->setParameter('targetLogId', $targetLogId)
            ->orderBy('a.createdAt', 'ASC')
            ->addOrderBy('a.id', 'ASC');

        /** @var list<AuditLog> $results */
        $results = $qb->getQuery()->getResult();

        return $results;
    }
}
