<?php

namespace Ari\Repository;

use Ari\Entity\ContactDate;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<ContactDate>
 */
class ContactDateRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, ContactDate::class);
    }

    /**
     * @return ContactDate[]
     */
    public function findMatchingDates(\DateTimeInterface $date): array
    {
        return $this->createQueryBuilder('cd')
            ->where('MONTH(cd.date) = :month')
            ->andWhere('DAY(cd.date) = :day')
            ->setParameter('month', (int) $date->format('m'))
            ->setParameter('day', (int) $date->format('d'))
            ->getQuery()
            ->getResult();
    }

    /**
     * @return string[]
     */
    public function getDistinctValues(string $field): array
    {
        if (1 !== preg_match('/^[a-zA-Z_][a-zA-Z0-9_]*$/', $field)) {
            throw new \InvalidArgumentException("Invalid field name for getDistinctValues: '$field'");
        }

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
