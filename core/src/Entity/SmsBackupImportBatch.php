<?php

namespace Ari\Entity;

use Ari\Repository\SmsBackupImportBatchRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

/**
 * Stores parsed SMS/call records between the HTTP upload request and the async Messenger handler.
 * Keeping records here (not in the message payload) prevents oversized messages in the queue broker.
 * The status field provides idempotency: the handler skips batches already marked STATUS_DONE.
 */
#[ORM\Entity(repositoryClass: SmsBackupImportBatchRepository::class)]
#[ORM\Table(name: 'sms_backup_import_batch')]
#[ORM\Index(columns: ['tenant_id', 'status'], name: 'idx_sms_backup_import_batch_tenant_status')]
#[ORM\Index(columns: ['created_at'], name: 'idx_sms_backup_import_batch_created_at')]
class SmsBackupImportBatch
{
    public const STATUS_PENDING = 'pending';
    public const STATUS_PROCESSING = 'processing';
    public const STATUS_DONE = 'done';
    public const STATUS_FAILED = 'failed';

    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column]
    private int $tenantId;

    /** @var list<array{type: string, phoneNumber: string, normalizedPhone: string, contactName: string, date: string, direction: string, durationSeconds: int|null}> */
    #[ORM\Column(type: Types::JSON)]
    private array $records;

    #[ORM\Column(length: 20)]
    private string $status = self::STATUS_PENDING;

    #[ORM\Column(length: 20)]
    private string $unknownNumbers;

    #[ORM\Column(length: 20)]
    private string $nameConflict;

    #[ORM\Column]
    private bool $skipAlphanumeric;

    #[ORM\Column(length: 20)]
    private string $duplicateStrategy;

    #[ORM\Column(type: Types::DATETIME_IMMUTABLE)]
    private \DateTimeImmutable $createdAt;

    /**
     * @param list<array{type: string, phoneNumber: string, normalizedPhone: string, contactName: string, date: string, direction: string, durationSeconds: int|null}> $records
     */
    public function __construct(
        int $tenantId,
        array $records,
        string $unknownNumbers,
        string $nameConflict,
        bool $skipAlphanumeric,
        string $duplicateStrategy,
    ) {
        $this->tenantId = $tenantId;
        $this->records = $records;
        $this->unknownNumbers = $unknownNumbers;
        $this->nameConflict = $nameConflict;
        $this->skipAlphanumeric = $skipAlphanumeric;
        $this->duplicateStrategy = $duplicateStrategy;
        $this->createdAt = new \DateTimeImmutable();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getTenantId(): int
    {
        return $this->tenantId;
    }

    /**
     * @return list<array{type: string, phoneNumber: string, normalizedPhone: string, contactName: string, date: string, direction: string, durationSeconds: int|null}>
     */
    public function getRecords(): array
    {
        return $this->records;
    }

    public function getStatus(): string
    {
        return $this->status;
    }

    public function setStatus(string $status): void
    {
        $this->status = $status;
    }

    public function getUnknownNumbers(): string
    {
        return $this->unknownNumbers;
    }

    public function getNameConflict(): string
    {
        return $this->nameConflict;
    }

    public function isSkipAlphanumeric(): bool
    {
        return $this->skipAlphanumeric;
    }

    public function getDuplicateStrategy(): string
    {
        return $this->duplicateStrategy;
    }

    public function getCreatedAt(): \DateTimeImmutable
    {
        return $this->createdAt;
    }
}
