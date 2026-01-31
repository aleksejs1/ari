<?php

namespace Ari\EventSubscriber;

use Ari\Entity\AuditLog;
use Ari\Entity\User;
use Ari\Security\TenantAwareInterface;
use Doctrine\Common\Util\ClassUtils;
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
                    $this->getEntitySnapshot($em, $entity),
                );
                $this->insertedEntities[spl_object_hash($entity)] = $auditLog;
            }
        }

        foreach ($uow->getScheduledEntityUpdates() as $entity) {
            if ($this->shouldLog($entity)) {
                assert($entity instanceof TenantAwareInterface);
                $changeSet = $uow->getEntityChangeSet($entity);
                $filteredChangeSet = $this->filterChangeSet($changeSet, $entity);

                if ([] !== $filteredChangeSet) {
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
                    null,
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
                    $ownerEntityType = $auditLog->getOwnerEntityType();

                    // If owner ID is missing, try to resolve it again
                    if (null === $ownerEntityId) {
                        if (method_exists($entity, 'getContact')) {
                            $contact = $entity->getContact();
                            if (is_object($contact) && method_exists($contact, 'getId')) {
                                $ownerEntityId = $contact->getId();
                                if (null !== $ownerEntityId) {
                                    $auditLog->setOwnerEntityId($ownerEntityId);
                                    if (null === $ownerEntityType) {
                                        $ownerEntityType = ClassUtils::getClass($contact);
                                        $auditLog->setOwnerEntityType($ownerEntityType);
                                    }
                                }
                            }
                        }
                    }

                    $em->getConnection()->executeStatement(
                        'UPDATE audit_log SET entity_id = ?, owner_entity_id = ?, ' .
                        'owner_entity_type = ?, snapshot_after = ? WHERE id = ?',
                        [
                            $entityId,
                            $ownerEntityId,
                            $ownerEntityType,
                            json_encode($this->maskSensitiveData($auditLog->getSnapshotAfter())),
                            $auditLog->getId(),
                        ],
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
        if ($entity instanceof AuditLog || $entity instanceof \Ari\Entity\ContactAvatar) {
            return false;
        }

        return $entity instanceof TenantAwareInterface;
    }

    private const SENSITIVE_FIELDS = ['refreshToken', 'password', 'token', 'thumbnailData'];

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
        $auditLog = $this->createAuditLogEntity(
            $entity,
            $action,
            $this->maskSensitiveData($changes),
            $this->maskSensitiveData($snapshotBefore),
            $this->maskSensitiveData($snapshotAfter),
        );

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
        $auditLog->setEntityType(ClassUtils::getClass($entity));

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
                $auditLog->setOwnerEntityType(ClassUtils::getClass($contact));
                $auditLog->setOwnerEntityId($contact->getId());
            }
        }

        $auditLog->setAction($action);
        $auditLog->setChanges($changes); // Already masked in logChange
        $auditLog->setSnapshotBefore($snapshotBefore); // Already masked in logChange
        $auditLog->setSnapshotAfter($snapshotAfter); // Already masked in logChange

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
        $metadata = $em->getClassMetadata($entity::class);
        $snapshot = [];

        foreach ($metadata->getFieldNames() as $fieldName) {
            $value = $metadata->getFieldValue($entity, $fieldName);

            if (
                $entity instanceof \Ari\Entity\ContactDate
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
                if ($entity instanceof \Ari\Entity\ContactDate && 'date' === $field) {
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

    /**
     * @param array<string, mixed>|null $data
     *
     * @return array<string, mixed>|null
     */
    private function maskSensitiveData(?array $data): ?array
    {
        if (null === $data) {
            return null;
        }

        foreach ($data as $key => $value) {
            if (in_array($key, self::SENSITIVE_FIELDS, true)) {
                if (is_string($value)) {
                    $length = strlen($value);
                    if ($length <= 10) {
                        $data[$key] = '********';
                    } else {
                        $data[$key] = substr($value, 0, 6) . '********' . substr($value, -4);
                    }
                } elseif (is_array($value)) {
                    // Handle change sets [old, new]
                    foreach ($value as $k => $v) {
                        if (is_string($v)) {
                            $len = strlen($v);
                            if ($len <= 10) {
                                $value[$k] = '********';
                            } else {
                                $value[$k] = substr($v, 0, 6) . '********' . substr($v, -4);
                            }
                        } else {
                            $value[$k] = '********';
                        }
                    }
                    $data[$key] = $value;
                } else {
                    $data[$key] = '********';
                }
            }
        }

        return $data;
    }
}
