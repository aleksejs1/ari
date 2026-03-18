<?php

namespace Ari\Command;

use Ari\Entity\SmsBackupImportBatch;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;

/**
 * Deletes stale SmsBackupImportBatch rows to prevent unbounded table growth.
 *
 * Two retention windows:
 *   - done / failed  → kept for 7 days (useful for debugging)
 *   - pending / processing → kept for 24 hours (stuck batches: Messenger worker was lost)
 *
 * Schedule via cron or Symfony Scheduler, e.g. daily at 02:00.
 */
#[AsCommand(
    name: 'ari:cleanup:sms-import-batches',
    description: 'Delete stale SMS backup import batch records from the database',
)]
class CleanupSmsBackupImportBatchesCommand extends Command
{
    public function __construct(
        private readonly EntityManagerInterface $entityManager,
    ) {
        parent::__construct();
    }

    #[\Override]
    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $io = new SymfonyStyle($input, $output);
        $now = new \DateTimeImmutable();

        $deletedTerminal = (int) $this->entityManager
            ->createQuery(
                'DELETE FROM ' . SmsBackupImportBatch::class . ' b
                 WHERE b.status IN (:terminalStatuses)
                 AND b.createdAt < :terminalCutoff'
            )
            ->setParameter('terminalStatuses', [SmsBackupImportBatch::STATUS_DONE, SmsBackupImportBatch::STATUS_FAILED])
            ->setParameter('terminalCutoff', $now->modify('-7 days'))
            ->execute();

        $deletedStuck = (int) $this->entityManager
            ->createQuery(
                'DELETE FROM ' . SmsBackupImportBatch::class . ' b
                 WHERE b.status IN (:stuckStatuses)
                 AND b.createdAt < :stuckCutoff'
            )
            ->setParameter('stuckStatuses', [SmsBackupImportBatch::STATUS_PENDING, SmsBackupImportBatch::STATUS_PROCESSING])
            ->setParameter('stuckCutoff', $now->modify('-24 hours'))
            ->execute();

        $total = $deletedTerminal + $deletedStuck;

        if ($total > 0) {
            $io->success(sprintf(
                'Deleted %d SMS import batch(es): %d terminal (done/failed >7d), %d stuck (pending/processing >24h).',
                $total,
                $deletedTerminal,
                $deletedStuck,
            ));
        } else {
            $io->info('No stale SMS import batches found.');
        }

        return Command::SUCCESS;
    }
}
