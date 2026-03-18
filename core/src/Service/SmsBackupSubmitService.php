<?php

namespace Ari\Service;

use Ari\Dto\SmsBackupImportOptions;
use Ari\Entity\SmsBackupImportBatch;
use Ari\Entity\User;
use Ari\Exception\SmsBackupParseException;
use Ari\Message\ImportSmsBackupMessage;
use Ari\ValueObject\ParsedRecord;
use Doctrine\ORM\EntityManagerInterface;
use Psr\Log\LoggerInterface;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\Messenger\MessageBusInterface;

/**
 * Orchestrates the controller-side of a phone backup import:
 * parses uploaded files synchronously (bounded by the 10 MB per-file limit),
 * persists parsed records to a SmsBackupImportBatch row, then dispatches a
 * lightweight ImportSmsBackupMessage (carrying only the batch ID) for async processing.
 *
 * Note: XML parsing remains synchronous to avoid requiring shared file storage between
 * HTTP workers and Messenger workers. Parsing a 10 MB file typically completes in under
 * a second due to XMLReader streaming; the heavy database work (creating contacts and
 * interactions) is deferred to the async handler.
 *
 * This service is the single dependency the controller needs,
 * keeping the controller free from Dto and Message layer imports.
 */
class SmsBackupSubmitService
{
    private const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB

    public function __construct(
        private readonly SmsBackupParserService $parser,
        private readonly EntityManagerInterface $entityManager,
        private readonly MessageBusInterface $bus,
        private readonly LoggerInterface $logger,
    ) {
    }

    /**
     * Parse the uploaded files, validate the size limit, persist a batch record,
     * and dispatch an async import message.
     *
     * @param UploadedFile[] $files
     *
     * @throws SmsBackupParseException  on invalid XML or unrecognised root element
     * @throws \InvalidArgumentException on oversized file or invalid option value
     */
    public function submit(
        array $files,
        User $user,
        string $unknownNumbers = 'skip',
        string $nameConflict = 'keep',
        bool $skipAlphanumeric = true,
        string $duplicateStrategy = 'skip',
    ): void {
        $options = new SmsBackupImportOptions(
            unknownNumbers: $unknownNumbers,
            nameConflict: $nameConflict,
            skipAlphanumeric: $skipAlphanumeric,
            duplicateStrategy: $duplicateStrategy,
        );

        $allRecords = [];

        foreach ($files as $file) {
            $fileSize = $file->getSize();
            if (!is_int($fileSize) || $fileSize > self::MAX_FILE_SIZE_BYTES) {
                throw new \InvalidArgumentException(
                    sprintf('File "%s" exceeds the 10 MB size limit.', $file->getClientOriginalName())
                );
            }

            $parsed = $this->parser->parse($file->getPathname());
            $allRecords = array_merge($allRecords, $parsed);
        }

        $smsCount = count(array_filter($allRecords, static fn(ParsedRecord $r): bool => ParsedRecord::TYPE_SMS === $r->type));
        $callCount = count($allRecords) - $smsCount;
        $tenantId = (int) $user->getId();

        $this->logger->info('sms_backup_import_started', [
            'event' => 'sms_backup_import_started',
            'tenant_id' => $tenantId,
            'records_parsed' => count($allRecords),
            'sms_count' => $smsCount,
            'call_count' => $callCount,
        ]);

        $records = array_map(
            static fn(ParsedRecord $r): array => [
                'type' => $r->type,
                'phoneNumber' => $r->phoneNumber,
                'normalizedPhone' => $r->normalizedPhone,
                'contactName' => $r->contactName,
                'date' => $r->date->format(\DateTimeInterface::ATOM),
                'direction' => $r->direction,
                'durationSeconds' => $r->durationSeconds,
            ],
            $allRecords
        );

        $batch = new SmsBackupImportBatch(
            tenantId: $tenantId,
            records: $records,
            unknownNumbers: $options->unknownNumbers,
            nameConflict: $options->nameConflict,
            skipAlphanumeric: $options->skipAlphanumeric,
            duplicateStrategy: $options->duplicateStrategy,
        );

        $this->entityManager->persist($batch);
        $this->entityManager->flush();

        $batchId = $batch->getId();
        if (null === $batchId) {
            throw new \RuntimeException('Failed to persist SmsBackupImportBatch: ID is null after flush.');
        }

        $this->bus->dispatch(new ImportSmsBackupMessage(
            batchId: $batchId,
            tenantId: $tenantId,
        ));
    }
}
