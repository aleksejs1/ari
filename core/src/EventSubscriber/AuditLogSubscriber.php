<?php

namespace App\EventSubscriber;

use App\Entity\AuditLog;
use App\Entity\User;
use App\Security\TenantAwareInterface;
use Doctrine\Common\EventSubscriber;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\ORM\Event\OnFlushEventArgs;
use Doctrine\ORM\Event\PostPersistEventArgs;
use Doctrine\ORM\Event\PostRemoveEventArgs;
use Doctrine\ORM\Event\PostUpdateEventArgs;
use Doctrine\ORM\Events;
use Doctrine\Persistence\ObjectManager;
use Symfony\Bundle\SecurityBundle\Security;
use Psr\Log\LoggerInterface;

class AuditLogSubscriber
{
    /** @var array<string, AuditLog> */
    private array $insertedEntities = [];

    public function __construct(
        private Security $security
    ) {
    }

    public function onFlush(OnFlushEventArgs $args): void
    {
        $em = $args->getObjectManager();
        $uow = $em->getUnitOfWork();

        foreach ($uow->getScheduledEntityInsertions() as $entity) {
            if ($this->shouldLog($entity)) {
                /** @var TenantAwareInterface $entity */
                $auditLog = $this->logChange($em, $entity, 'INSERT', null);
                $this->insertedEntities[spl_object_hash($entity)] = $auditLog;
            }
        }

        foreach ($uow->getScheduledEntityUpdates() as $entity) {
            if ($this->shouldLog($entity)) {
                /** @var TenantAwareInterface $entity */
                $this->logChange($em, $entity, 'UPDATE', $uow->getEntityChangeSet($entity));
            }
        }

        foreach ($uow->getScheduledEntityDeletions() as $entity) {
            if ($this->shouldLog($entity)) {
                /** @var TenantAwareInterface $entity */
                $this->logChange($em, $entity, 'REMOVE', null);
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

                // If the AuditLog was already persisted (inserted in DB),
                // we need to update it manually as it's too late for the unit of work to pick it up for a new insert.
                if ($auditLog->getId() !== null) {
                    $em = $args->getObjectManager();
                    $em->getConnection()->executeStatement(
                        'UPDATE audit_log SET entity_id = ? WHERE id = ?',
                        [$entityId, $auditLog->getId()]
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
     * @param EntityManagerInterface $em
     * @param TenantAwareInterface $entity
     * @param array<string, mixed>|null $changes
     * @return AuditLog
     */
    private function logChange(
        EntityManagerInterface $em,
        TenantAwareInterface $entity,
        string $action,
        ?array $changes
    ): AuditLog {
        $auditLog = $this->createAuditLogEntity($entity, $action, $changes);

        $em->persist($auditLog);
        $uow = $em->getUnitOfWork();
        $uow->computeChangeSet($em->getClassMetadata(AuditLog::class), $auditLog);

        return $auditLog;
    }

    /**
     * @param TenantAwareInterface $entity
     * @param string $action
     * @param array<string, mixed>|null $changes
     * @return AuditLog
     */
    private function createAuditLogEntity(
        TenantAwareInterface $entity,
        string $action,
        ?array $changes
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

        $auditLog->setAction($action);
        $auditLog->setChanges($changes);

        $user = $this->security->getUser();

        if ($user instanceof User) {
            $auditLog->setUser($user);
        } elseif ($entity->getTenant() !== null) {
            // Fallback to tenant if no user in security context (e.g. CLI or background task)
            $auditLog->setUser($entity->getTenant());
        }

        return $auditLog;
    }
}
