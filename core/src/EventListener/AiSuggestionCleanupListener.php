<?php

namespace Ari\EventListener;

use Ari\Entity\ContactName;
use Doctrine\Bundle\DoctrineBundle\Attribute\AsEntityListener;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\ORM\Event\PreRemoveEventArgs;
use Doctrine\ORM\Events;

/**
 * Deletes orphaned AiSuggestion records when a ContactName is removed.
 *
 * AiSuggestion.entityId is not a foreign key (to support multiple entity types),
 * so cascade deletes are not available at the DB level. This listener handles it.
 *
 * NOTE: Uses preRemove (not postRemove) because Doctrine ORM 3 nulls the entity ID
 * before dispatching postRemove, making getId() unreliable in that hook.
 */
#[AsEntityListener(event: Events::preRemove, method: 'preRemove', entity: ContactName::class)]
final class AiSuggestionCleanupListener
{
    public function __construct(
        private readonly EntityManagerInterface $entityManager,
    ) {
    }

    public function preRemove(ContactName $contactName, PreRemoveEventArgs $_event): void
    {
        $id = $contactName->getId();
        if (null === $id) {
            return;
        }

        $this->entityManager
            ->createQuery('DELETE FROM Ari\Entity\AiSuggestion a WHERE a.entityType = :type AND a.entityId = :id')
            ->setParameter('type', 'contact_name')
            ->setParameter('id', $id)
            ->execute();
    }
}
