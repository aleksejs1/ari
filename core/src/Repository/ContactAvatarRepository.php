<?php

namespace Ari\Repository;

use Ari\Entity\ContactAvatar;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<ContactAvatar>
 */
class ContactAvatarRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, ContactAvatar::class);
    }
}
