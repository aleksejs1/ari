<?php

namespace Ari\EventListener;

use Ari\Entity\ContactName;
use Doctrine\Bundle\DoctrineBundle\Attribute\AsEntityListener;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\ORM\Event\PostRemoveEventArgs;
use Doctrine\ORM\Events;

/**
 * Deletes orphaned AiSuggestion records when a ContactName is removed.
 *
 * AiSuggestion.entityId is not a foreign key (to support multiple entity types),
 * so cascade deletes are not available at the DB level. This listener handles it.
 */
#[AsEntityListener(event: Events::postRemove, method: 'postRemove', entity: ContactName::class)]
final class AiSuggestionCleanupListener
{
    public function __construct(
        private readonly EntityManagerInterface $entityManager,
    ) {
    }

    public function postRemove(ContactName $contactName, PostRemoveEventArgs $_event): void
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
