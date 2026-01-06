<?php

namespace App\Repository;

use App\Entity\NotificationQueue;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<NotificationQueue>
 */
class NotificationQueueRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, NotificationQueue::class);
    }

    /**
     * @return NotificationQueue[]
     */
    public function findPendingItems(int $limit = 50): array
    {
        return $this->createQueryBuilder('n')
            ->andWhere('n.status = :status')
            ->setParameter('status', 'pending')
            ->andWhere('n.scheduledAt <= :now')
            ->setParameter('now', new \DateTimeImmutable())
            ->orderBy('n.scheduledAt', 'ASC')
            ->setMaxResults($limit)
            ->getQuery()
            ->getResult();
    }
}
