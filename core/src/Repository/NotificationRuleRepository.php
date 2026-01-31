<?php

namespace Ari\Repository;

use Ari\Entity\NotificationRule;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<NotificationRule>
 */
class NotificationRuleRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, NotificationRule::class);
    }

    /**
     * @return NotificationRule[]
     */
    public function findMatchingRules(string $eventType, int $offsetDays): array
    {
        return $this->createQueryBuilder('nr')
            ->join('nr.policy', 'p')
            ->addSelect('p')
            ->where('nr.eventType = :eventType')
            ->andWhere('nr.offsetDays = :offsetDays')
            ->setParameter('eventType', $eventType)
            ->setParameter('offsetDays', $offsetDays)
            ->getQuery()
            ->getResult();
    }
}
