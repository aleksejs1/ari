<?php

namespace Ari\Repository;

use Ari\Entity\ContactAddress;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<ContactAddress>
 */
class ContactAddressRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, ContactAddress::class);
    }

    /**
     * @return string[]
     */
    public function getDistinctValues(string $field): array
    {
        return array_column(
            $this->createQueryBuilder('e')
                ->select("DISTINCT(e.$field)")
                ->where("e.$field IS NOT NULL")
                ->getQuery()
                ->getScalarResult(),
            '1',
        );
    }
}
