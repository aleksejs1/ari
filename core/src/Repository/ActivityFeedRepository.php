<?php

declare(strict_types=1);

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

    /**
     * Returns the createdAt timestamp of the most recent seasonal_checkin ActivityFeed entry
     * for the given user, or null if none has ever been created.
     *
     * Used by SeasonalCheckinService to determine whether a new check-in notification is due.
     */
    public function findLastSeasonalCheckinForUser(int $userId): ?\DateTimeInterface
    {
        /** @var ActivityFeed|null $entry */
        $entry = $this->createQueryBuilder('af')
            ->where('af.userId = :userId')
            ->andWhere('af.eventType = :type')
            ->setParameter('userId', $userId)
            ->setParameter('type', 'seasonal_checkin')
            ->orderBy('af.createdAt', 'DESC')
            ->setMaxResults(1)
            ->getQuery()
            ->getOneOrNullResult();

        return $entry?->getCreatedAt();
    }
}
