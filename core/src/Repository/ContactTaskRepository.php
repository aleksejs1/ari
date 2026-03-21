<?php

declare(strict_types=1);

namespace Ari\Repository;

use Ari\Entity\ContactPlaybook;
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

    /**
     * Returns the first active (pending, snoozed, awaiting_reflection) task for a given playbook series.
     */
    public function findActiveTaskForSeries(ContactPlaybook $playbook, string $seriesKey): ?ContactTask
    {
        return $this->findOneBy([
            'playbook' => $playbook,
            'seriesKey' => $seriesKey,
            'status' => [ContactTask::STATUS_PENDING, ContactTask::STATUS_SNOOZED, ContactTask::STATUS_AWAITING_REFLECTION],
        ]);
    }

    /**
     * Returns the most recently created task for a given playbook series (any status).
     */
    public function findLastTaskForSeries(ContactPlaybook $playbook, string $seriesKey): ?ContactTask
    {
        /** @var ContactTask|null */
        return $this->createQueryBuilder('ct')
            ->where('ct.playbook = :playbook')
            ->andWhere('ct.seriesKey = :seriesKey')
            ->setParameter('playbook', $playbook)
            ->setParameter('seriesKey', $seriesKey)
            ->orderBy('ct.createdAt', 'DESC')
            ->setMaxResults(1)
            ->getQuery()
            ->getOneOrNullResult();
    }

    /**
     * Counts completed tasks for a given playbook series.
     */
    public function countCompletedForSeries(ContactPlaybook $playbook, string $seriesKey): int
    {
        return (int) $this->createQueryBuilder('ct')
            ->select('COUNT(ct.id)')
            ->where('ct.playbook = :playbook')
            ->andWhere('ct.seriesKey = :seriesKey')
            ->andWhere('ct.status = :status')
            ->setParameter('playbook', $playbook)
            ->setParameter('seriesKey', $seriesKey)
            ->setParameter('status', ContactTask::STATUS_COMPLETED)
            ->getQuery()
            ->getSingleScalarResult();
    }

    /**
     * Returns all active (pending, snoozed, awaiting_reflection) tasks for a set of playbooks,
     * grouped by playbook ID. Used by ContactPlaybookService::generateMissingTasksForAllActive
     * to replace N×K findActiveTaskForSeries queries with a single query.
     *
     * @param list<ContactPlaybook> $playbooks
     *
     * @return array<int, list<ContactTask>>
     */
    public function findActiveTasksForPlaybooks(array $playbooks): array
    {
        if ([] === $playbooks) {
            return [];
        }

        /** @var list<ContactTask> $tasks */
        $tasks = $this->createQueryBuilder('ct')
            ->addSelect('r')
            ->leftJoin('ct.reflection', 'r')
            ->where('ct.playbook IN (:playbooks)')
            ->andWhere('ct.status IN (:statuses)')
            ->setParameter('playbooks', $playbooks)
            ->setParameter('statuses', [ContactTask::STATUS_PENDING, ContactTask::STATUS_SNOOZED, ContactTask::STATUS_AWAITING_REFLECTION])
            ->getQuery()
            ->getResult();

        $grouped = [];
        foreach ($tasks as $task) {
            $playbookId = $task->getPlaybook()?->getId();
            if (null !== $playbookId) {
                $grouped[$playbookId][] = $task;
            }
        }

        return $grouped;
    }

    /**
     * Returns the most recently created task per (playbook, seriesKey) for all given playbooks.
     * Used by ContactPlaybookService::generateMissingTasksForAllActive to replace N×K
     * findLastTaskForSeries queries with two queries (subquery + result fetch).
     *
     * @param list<ContactPlaybook> $playbooks
     *
     * @return array<int, array<string, ContactTask>> [playbookId => [seriesKey => ContactTask]]
     */
    public function findLastTasksForPlaybooks(array $playbooks): array
    {
        if ([] === $playbooks) {
            return [];
        }

        // Subquery: MAX(id) per (playbook, seriesKey) as a proxy for most recent createdAt.
        // Auto-increment IDs are monotonically increasing, so MAX(id) == latest row.
        $subQb = $this->createQueryBuilder('ct2')
            ->select('MAX(ct2.id)')
            ->where('ct2.playbook IN (:playbooks)')
            ->groupBy('ct2.playbook, ct2.seriesKey');

        /** @var list<ContactTask> $tasks */
        $tasks = $this->createQueryBuilder('ct')
            ->addSelect('r')
            ->leftJoin('ct.reflection', 'r')
            ->where('ct.id IN (' . $subQb->getDQL() . ')')
            ->setParameter('playbooks', $playbooks)
            ->getQuery()
            ->getResult();

        $grouped = [];
        foreach ($tasks as $task) {
            $playbookId = $task->getPlaybook()?->getId();
            $seriesKey = $task->getSeriesKey();
            if (null !== $playbookId && null !== $seriesKey) {
                $grouped[$playbookId][$seriesKey] = $task;
            }
        }

        return $grouped;
    }

    /**
     * Returns all tasks in awaiting_reflection status whose reflection window has expired.
     * Used by ReflectionFinalisationCommand to auto-complete stale reflections.
     *
     * @return list<ContactTask>
     */
    public function findOverdueReflections(): array
    {
        /** @var list<ContactTask> */
        return $this->createQueryBuilder('ct')
            ->where('ct.status = :status')
            ->andWhere('ct.reflectionDueAt IS NOT NULL')
            ->andWhere('ct.reflectionDueAt <= :now')
            ->setParameter('status', ContactTask::STATUS_AWAITING_REFLECTION)
            ->setParameter('now', new \DateTimeImmutable())
            ->orderBy('ct.createdAt', 'ASC')
            ->getQuery()
            ->getResult();
    }
}
