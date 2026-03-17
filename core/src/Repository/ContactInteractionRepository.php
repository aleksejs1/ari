<?php

namespace Ari\Repository;

use Ari\Entity\Contact;
use Ari\Entity\ContactInteraction;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<ContactInteraction>
 */
class ContactInteractionRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, ContactInteraction::class);
    }

    /**
     * Returns the N most recent interactions for a contact, ordered newest first.
     * Used when embedding interactions into the contact:read response.
     *
     * @return ContactInteraction[]
     */
    public function findByContactForEmbed(Contact $contact, int $limit = 200): array
    {
        return $this->createQueryBuilder('ci')
            ->where('ci.contact = :contact')
            ->setParameter('contact', $contact)
            ->orderBy('ci.timestamp', 'DESC')
            ->setMaxResults($limit)
            ->getQuery()
            ->getResult();
    }

    /**
     * Returns the most recent interaction timestamp per contact for all contacts
     * belonging to the given tenant (user ID).
     *
     * Used by NeedsAttentionProvider to compute overdue contacts at query time
     * without a pre-computed column.
     *
     * @return array<int, \DateTimeImmutable|null> contactId → last interaction timestamp (or null if none)
     */
    public function findLastInteractionDatesByTenant(int $tenantId): array
    {
        $rows = $this->createQueryBuilder('ci')
            ->select('IDENTITY(ci.contact) AS contactId, MAX(ci.timestamp) AS lastAt')
            ->join('ci.contact', 'c')
            ->where('c.user = :tenantId')
            ->setParameter('tenantId', $tenantId)
            ->groupBy('ci.contact')
            ->getQuery()
            ->getResult();

        $map = [];
        foreach ($rows as $row) {
            $map[(int) $row['contactId']] = $row['lastAt'] !== null
                ? new \DateTimeImmutable($row['lastAt'])
                : null;
        }

        return $map;
    }
}
