<?php

namespace App\EventSubscriber;

use App\Entity\AuditLog;
use App\Entity\User;
use App\Security\TenantAwareInterface;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\ORM\Event\OnFlushEventArgs;
use Doctrine\ORM\Event\PostPersistEventArgs;
use Doctrine\ORM\Event\PostRemoveEventArgs;
use Doctrine\ORM\Event\PostUpdateEventArgs;
use Symfony\Bundle\SecurityBundle\Security;

class AuditLogSubscriber
{
    /** @var array<string, AuditLog> */
    private array $insertedEntities = [];

    public function __construct(
        private Security $security,
    ) {
    }

    public function onFlush(OnFlushEventArgs $args): void
    {
        $em = $args->getObjectManager();
        $uow = $em->getUnitOfWork();

        foreach ($uow->getScheduledEntityInsertions() as $entity) {
            if ($this->shouldLog($entity)) {
                /** @var TenantAwareInterface $entity */
                $auditLog = $this->logChange(
                    $em,
                    $entity,
                    'INSERT',
                    null,
                    null,
                    $this->getEntitySnapshot($em, $entity)
                );
                $this->insertedEntities[spl_object_hash($entity)] = $auditLog;
            }
        }

        foreach ($uow->getScheduledEntityUpdates() as $entity) {
            if ($this->shouldLog($entity)) {
                assert($entity instanceof TenantAwareInterface);
                $changeSet = $uow->getEntityChangeSet($entity);
                $filteredChangeSet = $this->filterChangeSet($changeSet, $entity);

                if ($filteredChangeSet !== []) {
                    $this->logChange($em, $entity, 'UPDATE', $filteredChangeSet);
                }
            }
        }

        foreach ($uow->getScheduledEntityDeletions() as $entity) {
            if ($this->shouldLog($entity)) {
                assert($entity instanceof TenantAwareInterface);
                $this->logChange(
                    $em,
                    $entity,
                    'REMOVE',
                    null,
                    $this->getEntitySnapshot($em, $entity),
                    null
                );
            }
        }
    }

    public function postPersist(PostPersistEventArgs $args): void
    {
        $entity = $args->getObject();
        $hash = spl_object_hash($entity);

        if (isset($this->insertedEntities[$hash])) {
            $auditLog = $this->insertedEntities[$hash];

            if (method_exists($entity, 'getId')) {
                $entityId = $entity->getId();
                $auditLog->setEntityId($entityId);

                // Update snapshotAfter with ID if it exists
                $snapshotAfter = $auditLog->getSnapshotAfter();
                if (null !== $snapshotAfter && array_key_exists('id', $snapshotAfter)) {
                    $snapshotAfter['id'] = $entityId;
                    $auditLog->setSnapshotAfter($snapshotAfter);
                }

                // If the AuditLog was already persisted (inserted in DB),
                // we need to update it manually as it's too late for the unit of work to pick it up for a new insert.
                if (null !== $auditLog->getId()) {
                    $em = $args->getObjectManager();

                    // Also check for owner ID if it wasn't set (e.g. cascaded persist)
                    $ownerEntityId = $auditLog->getOwnerEntityId();
                    if (null === $ownerEntityId && null !== $auditLog->getOwnerEntityType()) {
                        if (method_exists($entity, 'getContact')) {
                            $contact = $entity->getContact();
                            if (is_object($contact) && method_exists($contact, 'getId')) {
                                $ownerEntityId = $contact->getId();
                                $auditLog->setOwnerEntityId($ownerEntityId);
                            }
                        }
                    }

                    $em->getConnection()->executeStatement(
                        'UPDATE audit_log SET entity_id = ?, owner_entity_id = ?, snapshot_after = ? WHERE id = ?',
                        [
                            $entityId,
                            $ownerEntityId,
                            json_encode($auditLog->getSnapshotAfter()),
                            $auditLog->getId(),
                        ]
                    );
                }
            }

            unset($this->insertedEntities[$hash]);
        }
    }

    public function postUpdate(PostUpdateEventArgs $args): void
    {
        // Handled in onFlush
    }

    public function postRemove(PostRemoveEventArgs $args): void
    {
        // Handled in onFlush
    }

    private function shouldLog(object $entity): bool
    {
        if ($entity instanceof AuditLog) {
            return false;
        }

        return $entity instanceof TenantAwareInterface;
    }

    /**
     * @param array<string, mixed>|null $changes
     * @param array<string, mixed>|null $snapshotBefore
     * @param array<string, mixed>|null $snapshotAfter
     */
    private function logChange(
        EntityManagerInterface $em,
        TenantAwareInterface $entity,
        string $action,
        ?array $changes,
        ?array $snapshotBefore = null,
        ?array $snapshotAfter = null,
    ): AuditLog {
        $auditLog = $this->createAuditLogEntity($entity, $action, $changes, $snapshotBefore, $snapshotAfter);

        $em->persist($auditLog);
        $uow = $em->getUnitOfWork();
        $uow->computeChangeSet($em->getClassMetadata(AuditLog::class), $auditLog);

        return $auditLog;
    }

    /**
     * @param array<string, mixed>|null $changes
     * @param array<string, mixed>|null $snapshotBefore
     * @param array<string, mixed>|null $snapshotAfter
     */
    private function createAuditLogEntity(
        TenantAwareInterface $entity,
        string $action,
        ?array $changes,
        ?array $snapshotBefore = null,
        ?array $snapshotAfter = null,
    ): AuditLog {
        $auditLog = new AuditLog();
        $auditLog->setEntityType(get_class($entity));

        // Set tenant from the entity being audited
        $auditLog->setTenant($entity->getTenant());

        $entityId = null;
        if (method_exists($entity, 'getId')) {
            $entityId = $entity->getId();
        }
        $auditLog->setEntityId($entityId);

        if (method_exists($entity, 'getContact')) {
            $contact = $entity->getContact();
            if (is_object($contact) && method_exists($contact, 'getId')) {
                $auditLog->setOwnerEntityType(get_class($contact));
                $auditLog->setOwnerEntityId($contact->getId());
            }
        }

        $auditLog->setAction($action);
        $auditLog->setChanges($changes);
        $auditLog->setSnapshotBefore($snapshotBefore);
        $auditLog->setSnapshotAfter($snapshotAfter);

        $user = $this->security->getUser();

        if ($user instanceof User) {
            $auditLog->setUser($user);
        } elseif (null !== $entity->getTenant()) {
            // Fallback to tenant if no user in security context (e.g. CLI or background task)
            $auditLog->setUser($entity->getTenant());
        }

        return $auditLog;
    }

    /**
     * @return array<string, mixed>
     */
    private function getEntitySnapshot(EntityManagerInterface $em, object $entity): array
    {
        $metadata = $em->getClassMetadata(get_class($entity));
        $snapshot = [];

        foreach ($metadata->getFieldNames() as $fieldName) {
            $value = $metadata->getFieldValue($entity, $fieldName);

            if (
                $entity instanceof \App\Entity\ContactDate
                && 'date' === $fieldName
                && $value instanceof \DateTimeInterface
            ) {
                // For ContactDate, we only care about the date part (Y-m-d)
                $snapshot[$fieldName] = $value->format('Y-m-d');
            } else {
                $snapshot[$fieldName] = $value;
            }
        }

        foreach ($metadata->getAssociationNames() as $assocName) {
            if ($metadata->isSingleValuedAssociation($assocName)) {
                $associatedEntity = $metadata->getFieldValue($entity, $assocName);
                if (is_object($associatedEntity) && method_exists($associatedEntity, 'getId')) {
                    $snapshot[$assocName] = $associatedEntity->getId();
                }
            }
        }

        return $snapshot;
    }

    /**
     * @param array<string, mixed> $changeSet
     *
     * @return array<string, mixed>
     */
    private function filterChangeSet(array $changeSet, ?object $entity = null): array
    {
        foreach ($changeSet as $field => $values) {
            [$old, $new] = $values;

            if ($old instanceof \DateTimeInterface && $new instanceof \DateTimeInterface) {
                if ($entity instanceof \App\Entity\ContactDate && 'date' === $field) {
                    // For ContactDate, ignore time changes
                    if ($old->format('Y-m-d') === $new->format('Y-m-d')) {
                        unset($changeSet[$field]);
                    }
                } else {
                    // Compare timestamps to ignore timezone differences (e.g. UTC vs +00:00)
                    if ($old->format('U') === $new->format('U')) {
                        unset($changeSet[$field]);
                    }
                }
            }
        }

        return $changeSet;
    }
}
