<?php

namespace Ari\Repository;

use Ari\Entity\TokenStorage;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<TokenStorage>
 */
class TokenStorageRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, TokenStorage::class);
    }
}
