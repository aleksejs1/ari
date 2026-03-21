<?php

declare(strict_types=1);

namespace Ari\Command;

use Doctrine\DBAL\Connection;
use Psr\Log\LoggerInterface;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Output\OutputInterface;

/**
 * Counts messages in the Messenger dead-letter queue (DLQ) and logs a warning
 * when the count exceeds a configurable threshold.
 *
 * Run on a cron schedule (e.g. hourly) so stuck messages are detected promptly:
 *
 *   0 * * * * php bin/console messenger:dlq-monitor
 *
 * The command always exits with SUCCESS so cron logs are not filled with errors;
 * the alert is surfaced via the warning log that any log aggregator can pick up.
 */
#[AsCommand(
    name: 'messenger:dlq-monitor',
    description: 'Warn when the Messenger dead-letter queue exceeds the configured threshold.',
)]
final class DlqMonitorCommand extends Command
{
    private const DEFAULT_THRESHOLD = 10;
    private const DLQ_QUEUE_NAME = 'failed';

    public function __construct(
        private readonly Connection $connection,
        private readonly LoggerInterface $logger,
    ) {
        parent::__construct();
    }

    #[\Override]
    protected function configure(): void
    {
        $this->addOption(
            'threshold',
            't',
            InputOption::VALUE_REQUIRED,
            'Alert when DLQ message count exceeds this value.',
            self::DEFAULT_THRESHOLD,
        );
    }

    #[\Override]
    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $threshold = (int) $input->getOption('threshold');

        $count = (int) $this->connection->fetchOne(
            'SELECT COUNT(*) FROM messenger_messages WHERE queue_name = :queue',
            ['queue' => self::DLQ_QUEUE_NAME],
        );

        $output->writeln(sprintf('DLQ message count: %d (threshold: %d)', $count, $threshold));

        if ($count > $threshold) {
            $this->logger->warning('messenger_dlq_threshold_exceeded', [
                'dlq_count' => $count,
                'threshold' => $threshold,
                'queue' => self::DLQ_QUEUE_NAME,
            ]);
            $output->writeln(sprintf(
                '<comment>WARNING: DLQ has %d messages — exceeds threshold of %d. Run `messenger:failed:show` to inspect.</comment>',
                $count,
                $threshold,
            ));
        } else {
            $this->logger->info('messenger_dlq_ok', [
                'dlq_count' => $count,
                'threshold' => $threshold,
            ]);
        }

        return Command::SUCCESS;
    }
}
