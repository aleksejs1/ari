<?php

namespace Ari\Repository;

use Ari\Entity\Contact;
use Ari\Entity\ContactInteraction;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<ContactInteraction>
 */
class ContactInteractionRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, ContactInteraction::class);
    }

    /**
     * Returns the N most recent interactions for a contact, ordered newest first.
     * Used when embedding interactions into the contact:read response.
     *
     * @return ContactInteraction[]
     */
    public function findByContactForEmbed(Contact $contact, int $limit = 200): array
    {
        return $this->createQueryBuilder('ci')
            ->where('ci.contact = :contact')
            ->setParameter('contact', $contact)
            ->orderBy('ci.timestamp', 'DESC')
            ->setMaxResults($limit)
            ->getQuery()
            ->getResult();
    }

}
