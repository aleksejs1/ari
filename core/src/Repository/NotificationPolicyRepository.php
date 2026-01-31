<?php

namespace Ari\Repository;

use Ari\Entity\NotificationPolicy;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<NotificationPolicy>
 */
class NotificationPolicyRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, NotificationPolicy::class);
    }
}
