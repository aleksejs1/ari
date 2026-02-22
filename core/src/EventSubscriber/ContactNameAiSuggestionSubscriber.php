<?php

namespace Ari\EventSubscriber;

use Ari\Entity\ContactName;
use Ari\Service\Ai\AiSuggestionService;
use Doctrine\Bundle\DoctrineBundle\Attribute\AsDoctrineListener;
use Doctrine\ORM\Event\OnFlushEventArgs;
use Doctrine\ORM\Event\PostFlushEventArgs;
use Doctrine\ORM\Events;

/**
 * Listens to Doctrine flush events and dispatches AI suggestion generation
 * tasks for newly created or modified ContactName entities.
 *
 * Dispatches in postFlush (not postPersist) to guarantee that ContactName
 * has been committed to the DB before the worker reads it.
 */
#[AsDoctrineListener(event: Events::onFlush)]
#[AsDoctrineListener(event: Events::postFlush)]
final class ContactNameAiSuggestionSubscriber
{
    /** @var list<ContactName> */
    private array $pendingContactNames = [];

    public function __construct(
        private readonly AiSuggestionService $aiSuggestionService,
    ) {
    }

    public function onFlush(OnFlushEventArgs $args): void
    {
        $em = $args->getObjectManager();
        $uow = $em->getUnitOfWork();

        foreach ($uow->getScheduledEntityInsertions() as $entity) {
            if ($entity instanceof ContactName) {
                $this->pendingContactNames[] = $entity;
            }
        }

        foreach ($uow->getScheduledEntityUpdates() as $entity) {
            if ($entity instanceof ContactName) {
                $changeset = $uow->getEntityChangeSet($entity);
                if (isset($changeset['given']) || isset($changeset['family'])) {
                    $this->pendingContactNames[] = $entity;
                }
            }
        }
    }

    public function postFlush(PostFlushEventArgs $_args): void
    {
        if ([] === $this->pendingContactNames) {
            return;
        }

        $names = $this->pendingContactNames;
        $this->pendingContactNames = [];

        foreach ($names as $name) {
            $this->aiSuggestionService->maybeDispatch($name);
        }
    }
}
