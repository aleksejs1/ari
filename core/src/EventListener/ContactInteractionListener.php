<?php

declare(strict_types=1);

namespace Ari\EventListener;

use Ari\Entity\Contact;
use Ari\Entity\ContactInteraction;
use Doctrine\ORM\Event\PostFlushEventArgs;
use Doctrine\ORM\Event\PrePersistEventArgs;
use Symfony\Contracts\Service\ResetInterface;

/**
 * Keeps Contact::$lastInteractionAt in sync with the most recent ContactInteraction timestamp.
 *
 * Strategy:
 *   - prePersist: collect (contactId → maxTimestamp) for newly-persisted interactions.
 *   - postFlush:  execute DQL UPDATE for each collected contact (only if the new timestamp
 *                 is later than the current stored value). DQL UPDATE bypasses the UnitOfWork
 *                 so it does not trigger a second flush.
 *
 * This approach handles batch imports (SmsBackupImportService) correctly: multiple interactions
 * for the same contact are batched into a single DQL update using the highest timestamp seen.
 *
 * Implements ResetInterface so that Symfony Messenger workers can reset per-message state
 * between requests (prevents $pendingUpdates from leaking across messages).
 *
 * Known limitation: if a worker process is killed between prePersist and postFlush, the
 * pending updates are lost and lastInteractionAt will not be updated for those interactions.
 * The ContactInteraction rows are already committed, so the field can be repaired by
 * re-running the backfill UPDATE from Version20260321000000.
 */
final class ContactInteractionListener implements ResetInterface
{
    /** @var array<int, \DateTimeImmutable> contactId → max pending timestamp */
    private array $pendingUpdates = [];

    #[\Override]
    public function reset(): void
    {
        $this->pendingUpdates = [];
    }

    public function prePersist(PrePersistEventArgs $args): void
    {
        $entity = $args->getObject();
        if (!$entity instanceof ContactInteraction) {
            return;
        }

        $contact = $entity->getContact();
        $timestamp = $entity->getTimestamp();
        if (null === $contact || null === $timestamp) {
            return;
        }

        $id = $contact->getId();
        if (null === $id) {
            // Contact not yet persisted — cannot update lastInteractionAt without an ID.
            return;
        }

        if (!isset($this->pendingUpdates[$id]) || $timestamp > $this->pendingUpdates[$id]) {
            $this->pendingUpdates[$id] = $timestamp;
        }
    }

    public function postFlush(PostFlushEventArgs $args): void
    {
        if ([] === $this->pendingUpdates) {
            return;
        }

        // Swap out pending list before executing to prevent re-entrant loops.
        $updates = $this->pendingUpdates;
        $this->pendingUpdates = [];

        $em = $args->getObjectManager();
        foreach ($updates as $contactId => $timestamp) {
            // Only advance lastInteractionAt — never go backwards (handles out-of-order imports).
            $em->createQuery(
                'UPDATE ' . Contact::class . ' c
                 SET c.lastInteractionAt = :ts
                 WHERE c.id = :id
                   AND (c.lastInteractionAt IS NULL OR c.lastInteractionAt < :ts)',
            )
                ->setParameter('ts', $timestamp)
                ->setParameter('id', $contactId)
                ->execute();
        }
    }
}
