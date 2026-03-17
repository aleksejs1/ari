<?php

namespace Ari\State;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\Pagination\TraversablePaginator;
use ApiPlatform\State\ProviderInterface;
use Ari\Dto\NeedsAttentionContactDto;
use Ari\Entity\Contact;
use Ari\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\ORM\Tools\Pagination\Paginator;
use Psr\Log\LoggerInterface;
use Symfony\Bundle\SecurityBundle\Security;

/**
 * State provider for GET /api/contacts/needs-attention.
 *
 * Returns contacts with cadence configured whose last interaction is overdue,
 * ordered by urgency (never-interacted contacts first, then most overdue first).
 *
 * The query runs at request time — no pre-computed columns, no background job.
 * At typical scale (< 10k contacts per user) this runs in < 50ms.
 *
 * @implements ProviderInterface<object>
 */
final class NeedsAttentionProvider implements ProviderInterface
{
    public function __construct(
        private readonly EntityManagerInterface $em,
        private readonly Security $security,
        private readonly LoggerInterface $logger,
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

        $offset = ($page - 1) * $itemsPerPage;

        // GROUP BY + HAVING to find contacts whose last interaction + cadence_days is before today.
        // MAX(ci.timestamp) is selected as a scalar (lastAt) to avoid an N+1 query when computing overdueDays.
        $dueDateExpr = "DATE_ADD(MAX(ci.timestamp), c.cadenceDays, 'day')";

        $qb = $this->em->createQueryBuilder()
            ->select("c, MAX(ci.timestamp) AS lastAt")
            ->from(Contact::class, 'c')
            ->leftJoin(
                'c.contactInteractions',
                'ci',
            )
            ->where('c.user = :user')
            ->andWhere('c.cadenceDays IS NOT NULL')
            ->groupBy('c.id')
            ->having(
                "MAX(ci.timestamp) IS NULL OR $dueDateExpr < CURRENT_DATE()"
            )
            ->orderBy('CASE WHEN MAX(ci.timestamp) IS NULL THEN 0 ELSE 1 END', 'ASC')
            ->addOrderBy($dueDateExpr, 'ASC')
            ->setParameter('user', $user)
            ->setFirstResult($offset)
            ->setMaxResults($itemsPerPage);

        $doctrinePaginator = new Paginator($qb, fetchJoinCollection: false);
        $totalItems = $doctrinePaginator->count();

        $today = new \DateTimeImmutable('today');
        $results = [];

        foreach ($doctrinePaginator as $row) {
            \assert(is_array($row));
            $contact = $row[0];
            \assert($contact instanceof Contact);
            $lastAt = isset($row['lastAt']) ? new \DateTimeImmutable($row['lastAt']) : null;
            $results[] = $this->toDto($contact, $lastAt, $today);
        }

        $this->logger->info('needs_attention_count={count}', ['count' => $totalItems]);

        return new TraversablePaginator(
            new \ArrayIterator($results),
            $page,
            $itemsPerPage,
            $totalItems,
        );
    }

    private function toDto(Contact $contact, ?\DateTimeImmutable $lastTimestamp, \DateTimeImmutable $today): NeedsAttentionContactDto
    {
        $cadenceDays = $contact->getCadenceDays() ?? 0;

        if ($lastTimestamp === null) {
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
        );
    }
}
