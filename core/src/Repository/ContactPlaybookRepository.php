<?php

declare(strict_types=1);

namespace Ari\Repository;

use Ari\Entity\Contact;
use Ari\Entity\ContactPlaybook;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<ContactPlaybook>
 */
class ContactPlaybookRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, ContactPlaybook::class);
    }

    public function findActiveForContact(Contact $contact): ?ContactPlaybook
    {
        return $this->findOneBy(['contact' => $contact, 'status' => ContactPlaybook::STATUS_ACTIVE]);
    }

    public function findActiveOrPausedForContact(Contact $contact): ?ContactPlaybook
    {
        return $this->findOneBy(['contact' => $contact, 'status' => [ContactPlaybook::STATUS_ACTIVE, ContactPlaybook::STATUS_PAUSED]]);
    }

    /**
     * Returns IDs of users who have at least one active playbook.
     * Used by SeasonalCheckinCommand (Phase 3b).
     *
     * @return list<int>
     */
    public function findUserIdsWithActivePlaybooks(): array
    {
        /** @var list<array{tenantId: int}> $rows */
        $rows = $this->createQueryBuilder('cp')
            ->select('IDENTITY(cp.tenant) AS tenantId')
            ->where('cp.status = :status')
            ->setParameter('status', ContactPlaybook::STATUS_ACTIVE)
            ->distinct()
            ->getQuery()
            ->getArrayResult();

        return array_map(static fn (array $row): int => $row['tenantId'], $rows);
    }
}
