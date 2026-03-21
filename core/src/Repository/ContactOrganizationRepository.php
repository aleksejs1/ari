<?php

namespace Ari\Repository;

use Ari\Entity\ContactOrganization;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<ContactOrganization>
 */
class ContactOrganizationRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, ContactOrganization::class);
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
