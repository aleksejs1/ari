<?php

declare(strict_types=1);

namespace Ari\Repository;

use Ari\Entity\TaskReflection;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<TaskReflection>
 */
class TaskReflectionRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, TaskReflection::class);
    }
}
