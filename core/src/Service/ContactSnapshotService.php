<?php

namespace Ari\Service;

use Ari\Entity\AuditLog;
use Ari\Entity\Contact;
use Ari\Repository\AuditLogRepository;

class ContactSnapshotService
{
    /** @var list<string> */
    private const CHILD_COLLECTION_KEYS = [
        'contactNames',
        'contactPhoneNumbers',
        'contactDates',
        'contactEmailAddresses',
        'contactAddresses',
        'contactOrganizations',
        'contactBiographies',
        'contactInteractions',
        'contactRelations',
    ];

    /** @var array<string, string> */
    private const ENTITY_TYPE_TO_COLLECTION = [
        'Ari\Entity\ContactName' => 'contactNames',
        'Ari\Entity\ContactPhoneNumber' => 'contactPhoneNumbers',
        'Ari\Entity\ContactDate' => 'contactDates',
        'Ari\Entity\ContactEmailAdress' => 'contactEmailAddresses',
        'Ari\Entity\ContactAddress' => 'contactAddresses',
        'Ari\Entity\ContactOrganization' => 'contactOrganizations',
        'Ari\Entity\ContactBiography' => 'contactBiographies',
        'Ari\Entity\ContactInteraction' => 'contactInteractions',
        'Ari\Entity\ContactRelation' => 'contactRelations',
    ];

    public function __construct(
        private readonly AuditLogRepository $auditLogRepository,
    ) {
    }

    /**
     * Reconstruct the full contact state at a specific audit log entry.
     *
     * This is an O(n) forward-replay: all audit log entries from the very first
     * INSERT up to targetLogId are loaded and applied in sequence. For contacts
     * with a long edit history (hundreds of entries), this can be slow.
     *
     * Performance path (not yet implemented): store a materialized snapshot
     * checkpoint every N entries (e.g. every 100) and replay only from the
     * nearest checkpoint. This would require a new `AuditLog.checkpoint` column
     * or a dedicated checkpoint table.
     *
     * Snapshot format versions written by AuditLogSubscriber::getEntitySnapshot():
     *   - Version 1 (no _schema_version key): UPDATE logs store only a changes delta.
     *   - Version 2 (_schema_version: 2): UPDATE logs store the full snapshotAfter.
     *     The replayLogs() method handles both formats transparently.
     *
     * @return array<string, mixed>|null null if targetLogId doesn't belong to this contact
     */
    public function getSnapshotAtLog(int|string $contactId, int $targetLogId): ?array
    {
        $logs = $this->auditLogRepository->findTimelineLogsUpTo($contactId, $targetLogId);

        if ([] === $logs) {
            return null;
        }

        return $this->replayLogs($logs);
    }

    /**
     * @param list<AuditLog> $logs sorted chronologically (ASC)
     *
     * @return array<string, mixed>
     */
    private function replayLogs(array $logs): array
    {
        /** @var array<string, mixed>|null $contact */
        $contact = null;

        /** @var array<string, array<string, array<string, mixed>>> $collections entityType => {entityId => snapshot} */
        $collections = [];

        foreach ($logs as $log) {
            $entityType = $log->getEntityType();
            $entityId = $log->getEntityId();
            $action = $log->getAction();

            if (null === $entityType || null === $action) {
                continue;
            }

            $isContact = Contact::class === $entityType;

            switch ($action) {
                case 'INSERT':
                    $snapshot = $log->getSnapshotAfter();
                    if (null === $snapshot) {
                        break;
                    }
                    if ($isContact) {
                        $contact = $snapshot;
                    } elseif (null !== $entityId) {
                        $collections[$entityType][$entityId] = $snapshot;
                    }
                    break;

                case 'UPDATE':
                    $snapshotAfter = $log->getSnapshotAfter();
                    if (null !== $snapshotAfter) {
                        // New format: full snapshot available
                        if ($isContact) {
                            $contact = $snapshotAfter;
                        } elseif (null !== $entityId) {
                            $collections[$entityType][$entityId] = $snapshotAfter;
                        }
                    } else {
                        // Old format: apply changes delta
                        $changes = $log->getChanges();
                        if (null !== $changes) {
                            if ($isContact && null !== $contact) {
                                $contact = $this->applyChanges($contact, $changes);
                            } elseif (null !== $entityId && isset($collections[$entityType][$entityId])) {
                                $collections[$entityType][$entityId] = $this->applyChanges(
                                    $collections[$entityType][$entityId],
                                    $changes,
                                );
                            }
                        }
                    }
                    break;

                case 'REMOVE':
                    if ($isContact) {
                        $contact = null;
                    } elseif (null !== $entityId) {
                        unset($collections[$entityType][$entityId]);
                    }
                    break;
            }
        }

        return $this->buildResult($contact, $collections);
    }

    /**
     * Apply a changes delta to an entity snapshot.
     *
     * @param array<string, mixed>            $snapshot
     * @param array<string, array{0: mixed, 1: mixed}> $changes format: {field: [old, new]}
     *
     * @return array<string, mixed>
     */
    private function applyChanges(array $snapshot, array $changes): array
    {
        foreach ($changes as $field => $values) {
            if (in_array($field, self::SYSTEM_FIELDS, true)) {
                continue;
            }
            if (is_array($values) && 2 === count($values)) {
                $snapshot[$field] = $values[1]; // new value
            }
        }

        return $snapshot;
    }

    /** @var list<string> */
    private const SYSTEM_FIELDS = ['user', 'tenant', '_schema_version'];

    /**
     * @param array<string, mixed>|null                              $contact
     * @param array<string, array<string, array<string, mixed>>> $collections
     *
     * @return array<string, mixed>
     */
    private function buildResult(?array $contact, array $collections): array
    {
        $result = [
            'contact' => null !== $contact ? $this->stripSystemFields($contact) : null,
        ];

        foreach (self::CHILD_COLLECTION_KEYS as $key) {
            $result[$key] = [];
        }

        foreach (self::ENTITY_TYPE_TO_COLLECTION as $entityType => $collectionKey) {
            if (isset($collections[$entityType])) {
                $result[$collectionKey] = array_values(array_map(
                    $this->stripSystemFields(...),
                    $collections[$entityType],
                ));
            }
        }

        return $result;
    }

    /**
     * @param array<string, mixed> $snapshot
     *
     * @return array<string, mixed>
     */
    private function stripSystemFields(array $snapshot): array
    {
        foreach (self::SYSTEM_FIELDS as $field) {
            unset($snapshot[$field]);
        }

        return $snapshot;
    }
}
