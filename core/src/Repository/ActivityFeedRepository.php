<?php

namespace Ari\Repository;

use Ari\Entity\ActivityFeed;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<ActivityFeed>
 *
 * @method ActivityFeed|null find($id, $lockMode = null, $lockVersion = null)
 * @method ActivityFeed|null findOneBy(array<string, mixed> $criteria, array<string, mixed> $orderBy = null)
 * @method ActivityFeed[]    findAll()
 *                                                                                                                                       // phpcs:ignore Generic.Files.LineLength
 * @method ActivityFeed[]    findBy(array<string, mixed> $criteria, array<string, mixed> $orderBy = null, $limit = null, $offset = null)
 */
class ActivityFeedRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, ActivityFeed::class);
    }
}
