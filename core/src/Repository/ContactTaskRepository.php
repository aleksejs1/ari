<?php

namespace Ari\Repository;

use Ari\Entity\ContactTask;
use Ari\Entity\User;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<ContactTask>
 */
class ContactTaskRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, ContactTask::class);
    }

    /**
     * Returns the IDs of contacts that have at least one actionable overdue task
     * for the given tenant.
     *
     * A task is considered overdue when:
     *   - due_date is not null and is on or before today
     *   - status is 'pending' with no active snooze (snoozed_until IS NULL or <= today)
     *   - OR status is 'snoozed' and the snooze has expired (snoozed_until <= today)
     *
     * The second case ensures contacts reappear in needs-attention as soon as the
     * snooze date arrives, without waiting for a cron job to flip the status back.
     *
     * Used by NeedsAttentionProvider to merge task-based overdue contacts
     * with cadence-based overdue contacts.
     *
     * The composite index (tenant_id, status, due_date) makes this O(matching tasks).
     *
     * @return list<int>
     */
    public function findOverdueContactIds(User $user): array
    {
        $today = new \DateTimeImmutable('today');

        /** @var list<array{contactId: int}> $rows */
        $rows = $this->createQueryBuilder('ct')
            ->select('IDENTITY(ct.contact) AS contactId')
            ->where('ct.tenant = :user')
            ->andWhere('ct.dueDate IS NOT NULL')
            ->andWhere('ct.dueDate <= :today')
            ->andWhere('ct.status IN (:statuses)')
            ->andWhere('ct.snoozedUntil IS NULL OR ct.snoozedUntil <= :today')
            ->setParameter('user', $user)
            ->setParameter('statuses', [ContactTask::STATUS_PENDING, ContactTask::STATUS_SNOOZED])
            ->setParameter('today', $today)
            ->distinct()
            ->getQuery()
            ->getArrayResult();

        return array_map(static fn (array $row): int => $row['contactId'], $rows);
    }
}
