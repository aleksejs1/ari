<?php

namespace Ari\Repository;

use Ari\Entity\SmsBackupImportBatch;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<SmsBackupImportBatch>
 */
class SmsBackupImportBatchRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, SmsBackupImportBatch::class);
    }
}
