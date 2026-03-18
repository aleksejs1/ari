<?php

namespace Ari\MessageHandler;

use Ari\Dto\SmsBackupImportOptions;
use Ari\Entity\SmsBackupImportBatch;
use Ari\Message\ImportSmsBackupMessage;
use Ari\Repository\SmsBackupImportBatchRepository;
use Ari\Repository\UserRepository;
use Ari\Service\ActivityManager;
use Ari\Service\SmsBackupImportService;
use Doctrine\ORM\EntityManagerInterface;
use Psr\Log\LoggerInterface;
use Symfony\Component\Messenger\Attribute\AsMessageHandler;

#[AsMessageHandler]
final class ImportSmsBackupMessageHandler
{
    public function __construct(
        private readonly EntityManagerInterface $entityManager,
        private readonly UserRepository $userRepository,
        private readonly SmsBackupImportBatchRepository $batchRepository,
        private readonly SmsBackupImportService $importService,
        private readonly ActivityManager $activityManager,
        private readonly LoggerInterface $logger,
    ) {
    }

    public function __invoke(ImportSmsBackupMessage $message): void
    {
        // Restore Doctrine TenantFilter so all ORM queries are scoped to this tenant.
        $this->entityManager->getFilters()
            ->enable('tenant')
            ->setParameter('currentTenant', (string) $message->tenantId);

        $batch = $this->batchRepository->find($message->batchId);
        if (null === $batch) {
            $this->logger->warning('sms_backup_import_batch_not_found', [
                'event' => 'sms_backup_import_batch_not_found',
                'batch_id' => $message->batchId,
                'tenant_id' => $message->tenantId,
            ]);

            return;
        }

        // Cross-tenant guard: ensure the batch belongs to the requesting tenant.
        if ($batch->getTenantId() !== $message->tenantId) {
            $this->logger->error('sms_backup_import_tenant_mismatch', [
                'event' => 'sms_backup_import_tenant_mismatch',
                'batch_id' => $message->batchId,
                'batch_tenant_id' => $batch->getTenantId(),
                'message_tenant_id' => $message->tenantId,
            ]);

            return;
        }

        // Idempotency: skip if already successfully processed.
        // On redelivery after a crash mid-processing, the batch is re-processed — this is safe
        // because buildPhoneMap re-reads the DB (contacts created in the first attempt are found),
        // and the deduplication set catches any interactions already written.
        if (SmsBackupImportBatch::STATUS_DONE === $batch->getStatus()) {
            $this->logger->info('sms_backup_import_skipped_already_done', [
                'event' => 'sms_backup_import_skipped_already_done',
                'batch_id' => $message->batchId,
                'tenant_id' => $message->tenantId,
            ]);

            return;
        }

        $user = $this->userRepository->find($message->tenantId);
        if (null === $user) {
            $this->logger->warning('sms_backup_import_user_not_found', [
                'event' => 'sms_backup_import_user_not_found',
                'tenant_id' => $message->tenantId,
            ]);

            return;
        }

        $batch->setStatus(SmsBackupImportBatch::STATUS_PROCESSING);
        $this->entityManager->flush();

        $startedAt = microtime(true);

        $options = new SmsBackupImportOptions(
            unknownNumbers: $batch->getUnknownNumbers(),
            nameConflict: $batch->getNameConflict(),
            skipAlphanumeric: $batch->isSkipAlphanumeric(),
            duplicateStrategy: $batch->getDuplicateStrategy(),
        );

        try {
            $result = $this->importService->import($batch->getRecords(), $options, $user);
        } catch (\Throwable $e) {
            $this->logger->warning('sms_backup_import_failed', [
                'event' => 'sms_backup_import_failed',
                'tenant_id' => $message->tenantId,
                'batch_id' => $message->batchId,
                'error' => $e->getMessage(),
            ]);

            $batch->setStatus(SmsBackupImportBatch::STATUS_FAILED);
            $this->entityManager->flush();

            $userId = $user->getId();
            if (null !== $userId) {
                $this->activityManager->createActivity(
                    userId: $userId,
                    eventType: 'sms_backup_import_failed',
                    title: 'Phone Backup Import Failed',
                    message: 'An error occurred while processing your phone backup.',
                    tenant: $user,
                );
            }

            return;
        }

        $batch->setStatus(SmsBackupImportBatch::STATUS_DONE);
        $this->entityManager->flush();

        $durationMs = intval(round((microtime(true) - $startedAt) * 1000.0));

        $this->logger->info('sms_backup_import_complete', [
            'event' => 'sms_backup_import_complete',
            'tenant_id' => $message->tenantId,
            'batch_id' => $message->batchId,
            'calls_imported' => $result->callsImported,
            'sms_threads_imported' => $result->smsThreadsImported,
            'contacts_created' => $result->contactsCreated,
            'records_skipped' => $result->recordsSkipped,
            'duration_ms' => $durationMs,
        ]);

        $userId = $user->getId();
        if (null === $userId) {
            return;
        }

        $summaryParts = [];
        if ($result->callsImported > 0) {
            $summaryParts[] = sprintf('%d call%s', $result->callsImported, $result->callsImported > 1 ? 's' : '');
        }
        if ($result->smsThreadsImported > 0) {
            $summaryParts[] = sprintf('%d message thread%s', $result->smsThreadsImported, $result->smsThreadsImported > 1 ? 's' : '');
        }
        if ($result->contactsCreated > 0) {
            $summaryParts[] = sprintf('%d new contact%s created', $result->contactsCreated, $result->contactsCreated > 1 ? 's' : '');
        }

        $summary = [] !== $summaryParts
            ? 'Imported: ' . implode(', ', $summaryParts) . '.'
            : 'No new records were imported.';

        if ($result->recordsSkipped > 0) {
            $summary .= sprintf(' %d record%s skipped.', $result->recordsSkipped, $result->recordsSkipped > 1 ? 's' : '');
        }

        $this->activityManager->createActivity(
            userId: $userId,
            eventType: 'sms_backup_import_complete',
            title: 'Phone Backup Import Complete',
            message: $summary,
            tenant: $user,
        );
    }
}
