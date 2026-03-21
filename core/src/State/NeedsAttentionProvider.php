<?php

namespace Ari\State;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\Pagination\TraversablePaginator;
use ApiPlatform\State\ProviderInterface;
use Ari\Dto\NeedsAttentionContactDto;
use Ari\Entity\Contact;
use Ari\Entity\User;
use Ari\Repository\ContactTaskRepository;
use Doctrine\ORM\EntityManagerInterface;
use Psr\Log\LoggerInterface;
use Symfony\Bundle\SecurityBundle\Security;

/**
 * State provider for GET /api/contacts/needs-attention.
 *
 * Returns contacts that meet at least one of these conditions:
 *   1. Cadence-overdue: cadenceDays is set and last interaction + cadenceDays < today.
 *   2. Task-overdue: has at least one pending ContactTask with due_date <= today
 *      and no active snooze.
 *
 * Merge strategy (PLAN_RELATIONSHIP_PLAYBOOKS.md §7.4):
 *   - Collect cadence-overdue contact IDs + lastAt via a GROUP BY query (no DB pagination).
 *   - Collect task-overdue contact IDs via ContactTaskRepository.
 *   - Union both sets in PHP with array_unique().
 *   - Apply PHP-level pagination (page × itemsPerPage slice).
 *   - Load paginated contacts in a single IN(...) query.
 *
 * At typical scale (< 10k contacts per user) the full-scan cadence query
 * runs in < 50ms, making PHP-level pagination acceptable.
 *
 * @implements ProviderInterface<object>
 */
final class NeedsAttentionProvider implements ProviderInterface
{
    public function __construct(
        private readonly EntityManagerInterface $em,
        private readonly Security $security,
        private readonly LoggerInterface $logger,
        private readonly ContactTaskRepository $contactTaskRepository,
    ) {
    }

    #[\Override]
    public function provide(Operation $operation, array $uriVariables = [], array $context = []): object|array
    {
        $page = max(1, (int) ($context['filters']['page'] ?? 1));
        $itemsPerPage = $operation->getPaginationItemsPerPage() ?? 20;
        if (isset($context['filters']['itemsPerPage'])) {
            $itemsPerPage = min((int) $context['filters']['itemsPerPage'], 100);
        }

        $user = $this->security->getUser();
        if (!$user instanceof User) {
            return new TraversablePaginator(new \ArrayIterator([]), 1, $itemsPerPage, 0);
        }

        $today = new \DateTimeImmutable('today');

        // ── Step 1: Cadence-overdue contacts (full scan, no DB pagination) ────────
        // Uses the denormalized Contact::$lastInteractionAt field (maintained by
        // ContactInteractionListener) to avoid a GROUP BY + JOIN on contact_interaction.
        /** @var list<array{contactId: int|string, cadenceDays: int|string, lastAt: \DateTimeImmutable|null}> $cadenceRows */
        $cadenceRows = $this->em->createQueryBuilder()
            ->select('c.id AS contactId, c.cadenceDays AS cadenceDays, c.lastInteractionAt AS lastAt')
            ->from(Contact::class, 'c')
            ->where('c.user = :user')
            ->andWhere('c.cadenceDays IS NOT NULL')
            ->setParameter('user', $user)
            ->getQuery()
            ->getArrayResult();

        // Filter and sort in PHP: keep only overdue rows, order by due date ASC
        // (null lastAt = never interacted → always overdue, sorted first).
        $cadenceContactIds = [];
        /** @var array<int, \DateTimeImmutable|null> $lastAtMap */
        $lastAtMap = [];

        /** @var list<array{id: int, lastAt: \DateTimeImmutable|null, dueDate: \DateTimeImmutable|null}> $overdueRows */
        $overdueRows = [];
        foreach ($cadenceRows as $row) {
            $lastAt = $row['lastAt']; // DateTimeImmutable|null — already hydrated by Doctrine
            $cadenceDays = (int) $row['cadenceDays'];

            if (null === $lastAt) {
                $dueDate = null; // never interacted → always overdue, sorts first
            } else {
                $dueDate = $lastAt->modify("+{$cadenceDays} days");
                if ($dueDate >= $today) {
                    continue; // not yet overdue
                }
            }

            $overdueRows[] = ['id' => (int) $row['contactId'], 'lastAt' => $row['lastAt'], 'dueDate' => $dueDate];
        }

        usort($overdueRows, static function (array $a, array $b): int {
            if (null === $a['dueDate'] && null === $b['dueDate']) {
                return 0;
            }
            if (null === $a['dueDate']) {
                return -1;
            }
            if (null === $b['dueDate']) {
                return 1;
            }

            return $a['dueDate'] <=> $b['dueDate'];
        });

        foreach ($overdueRows as $row) {
            $cadenceContactIds[] = $row['id'];
            $lastAtMap[$row['id']] = $row['lastAt']; // DateTimeImmutable|null
        }

        // ── Step 2: Task-overdue contact IDs ──────────────────────────────────────
        $taskOverdueIds = $this->contactTaskRepository->findOverdueContactIds($user);
        $taskOverdueSet = array_flip($taskOverdueIds);

        // ── Step 3: Merge (cadence-first ordering, task-only appended at end) ─────
        $allIds = array_values(array_unique(array_merge($cadenceContactIds, $taskOverdueIds)));
        $totalItems = \count($allIds);

        $this->logger->info('needs_attention_count={count}', ['count' => $totalItems]);

        if (0 === $totalItems) {
            return new TraversablePaginator(new \ArrayIterator([]), $page, $itemsPerPage, 0);
        }

        // ── Step 4: PHP-level pagination ──────────────────────────────────────────
        // Note: $totalItems is computed before pagination. If a contact is deleted
        // concurrently between Step 1 and Step 5, the paginator may report a count
        // of N while returning N-1 items on the last page. This is acceptable for a
        // read-heavy, non-critical listing endpoint at typical scale.
        $offset = ($page - 1) * $itemsPerPage;
        $pageIds = \array_slice($allIds, $offset, $itemsPerPage);

        if ([] === $pageIds) {
            return new TraversablePaginator(new \ArrayIterator([]), $page, $itemsPerPage, $totalItems);
        }

        // ── Step 5: Load contacts in a single IN(...) query (no N+1) ─────────────
        /** @var Contact[] $contacts */
        $contacts = $this->em->createQueryBuilder()
            ->select('c')
            ->from(Contact::class, 'c')
            ->where('c.id IN (:ids)')
            ->andWhere('c.user = :user')
            ->setParameter('ids', $pageIds)
            ->setParameter('user', $user)
            ->getQuery()
            ->getResult();

        $contactMap = [];
        foreach ($contacts as $contact) {
            $id = $contact->getId();
            if (null !== $id) {
                $contactMap[$id] = $contact;
            }
        }

        // ── Step 6: Build DTOs preserving the merged order ────────────────────────
        $results = [];
        foreach ($pageIds as $contactId) {
            if (!isset($contactMap[$contactId])) {
                continue;
            }
            $lastAt = $lastAtMap[$contactId] ?? null; // DateTimeImmutable|null
            $results[] = $this->toDto(
                $contactMap[$contactId],
                $lastAt,
                $today,
                isset($taskOverdueSet[$contactId]),
            );
        }

        // Cap $totalItems to the number of contacts that actually loaded. If contacts were
        // deleted concurrently between Step 1 and Step 5, the original count is stale.
        // Using min() prevents the paginator from reporting a total that exceeds reality.
        $totalItems = min($totalItems, $totalItems - (\count($pageIds) - \count($results)));

        return new TraversablePaginator(
            new \ArrayIterator($results),
            $page,
            $itemsPerPage,
            $totalItems,
        );
    }

    private function toDto(
        Contact $contact,
        ?\DateTimeImmutable $lastTimestamp,
        \DateTimeImmutable $today,
        bool $hasOverdueTask,
    ): NeedsAttentionContactDto {
        $cadenceDays = $contact->getCadenceDays() ?? 0;

        if (null === $lastTimestamp) {
            // Never interacted: treat as maximally overdue (full cadence period).
            $overdueDays = $cadenceDays;
        } else {
            $daysSinceLast = (int) $today->diff($lastTimestamp)->days;
            $overdueDays = max(0, $daysSinceLast - $cadenceDays);
        }

        return new NeedsAttentionContactDto(
            contact: $contact,
            lastInteractionAt: $lastTimestamp,
            overdueDays: $overdueDays,
            hasOverdueTask: $hasOverdueTask,
        );
    }
}
