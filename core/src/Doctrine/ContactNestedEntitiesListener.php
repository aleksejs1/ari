<?php

namespace Ari\Doctrine;

use Ari\Entity\Contact;
use Ari\Entity\ContactDate;
use Ari\Entity\ContactName;
use Doctrine\Bundle\DoctrineBundle\Attribute\AsDoctrineListener;
use Doctrine\ORM\Event\PrePersistEventArgs;
use Doctrine\ORM\Events;

#[AsDoctrineListener(event: Events::prePersist, priority: 500)]
class ContactNestedEntitiesListener
{
    public function prePersist(PrePersistEventArgs $args): void
    {
        $entity = $args->getObject();

        // When a ContactName or ContactDate is being persisted,
        // ensure it's properly added to the Contact's collection
        if ($entity instanceof ContactName) {
            $contact = $entity->getContact();
            if (null !== $contact && !$contact->getContactNames()->contains($entity)) {
                $contact->addContactName($entity);
            }
        } elseif ($entity instanceof ContactDate) {
            $contact = $entity->getContact();
            if (null !== $contact && !$contact->getContactDates()->contains($entity)) {
                $contact->addContactDate($entity);
            }
        }
    }
}
