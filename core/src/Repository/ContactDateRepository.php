<?php

namespace App\Repository;

use App\Entity\ContactDate;
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
        $entityManager = $this->getEntityManager();
        $rsm = new \Doctrine\ORM\Query\ResultSetMappingBuilder($entityManager);
        $rsm->addRootEntityFromClassMetadata(ContactDate::class, 'cd');

        $sql = 'SELECT ' . $rsm->generateSelectClause() . ' FROM contact_date cd ' .
               'WHERE MONTH(cd.date) = :month AND DAY(cd.date) = :day';

        $query = $entityManager->createNativeQuery($sql, $rsm);
        $query->setParameter('month', $date->format('m'));
        $query->setParameter('day', $date->format('d'));

        return $query->getResult();
    }
}
