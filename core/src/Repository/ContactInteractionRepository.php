<?php

declare(strict_types=1);

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
     * Returns deduplication keys for a set of contacts without full ORM hydration.
     * Keys are formatted as "{contactId}|{type}|{unixTimestamp}".
     *
     * Uses DQL array hydration instead of object hydration to avoid instantiating
     * potentially thousands of ContactInteraction objects and their lazy-load proxies.
     *
     * @param list<int> $contactIds
     *
     * @return array<string, true>
     */
    public function findDeduplicationKeysByContactIds(array $contactIds): array
    {
        if ([] === $contactIds) {
            return [];
        }

        /** @var list<array{contactId: int|string, type: string, timestamp: \DateTimeImmutable|string}> $rows */
        $rows = $this->createQueryBuilder('ci')
            ->select('IDENTITY(ci.contact) AS contactId, ci.type AS type, ci.timestamp AS timestamp')
            ->where('ci.contact IN (:contactIds)')
            ->setParameter('contactIds', $contactIds)
            ->getQuery()
            ->getArrayResult();

        $keys = [];
        foreach ($rows as $row) {
            $ts = $row['timestamp'] instanceof \DateTimeInterface
                ? $row['timestamp']->getTimestamp()
                : (new \DateTimeImmutable((string) $row['timestamp']))->getTimestamp();
            $keys[$row['contactId'] . '|' . $row['type'] . '|' . $ts] = true;
        }

        return $keys;
    }

    /**
     * Returns all interactions for a set of contacts (full ORM hydration).
     * Use findDeduplicationKeysByContactIds() instead when only dedup keys are needed.
     *
     * @param list<int> $contactIds
     *
     * @return ContactInteraction[]
     */
    public function findByContactIds(array $contactIds): array
    {
        if ([] === $contactIds) {
            return [];
        }

        return $this->createQueryBuilder('ci')
            ->where('ci.contact IN (:contactIds)')
            ->setParameter('contactIds', $contactIds)
            ->getQuery()
            ->getResult();
    }

    /**
     * Counts interactions for a contact filtered by initiator ('me' or 'them') within a time window.
     * Used by ReciprocityService to compute the reciprocity ratio.
     */
    public function countByInitiator(Contact $contact, string $initiator, \DateTimeImmutable $since): int
    {
        return (int) $this->createQueryBuilder('ci')
            ->select('COUNT(ci.id)')
            ->where('ci.contact = :contact')
            ->andWhere('ci.initiator = :initiator')
            ->andWhere('ci.timestamp >= :since')
            ->setParameter('contact', $contact)
            ->setParameter('initiator', $initiator)
            ->setParameter('since', $since)
            ->getQuery()
            ->getSingleScalarResult();
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

}
