<?php

declare(strict_types=1);

namespace Ari\Command;

use Ari\Service\ContactPlaybookLifecycleService;
use Psr\Log\LoggerInterface;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;

#[AsCommand(
    name: 'playbooks:generate-overdue',
    description: 'Generate missing tasks for active playbooks (gap-fill for inactive users).',
)]
final class OverdueTaskGeneratorCommand extends Command
{
    public function __construct(
        private readonly ContactPlaybookLifecycleService $playbookService,
        private readonly LoggerInterface $logger,
    ) {
        parent::__construct();
    }

    #[\Override]
    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $checked = $this->playbookService->generateMissingTasksForAllActive();

        $this->logger->info('overdue_tasks_generated', ['playbooks_checked' => $checked]);
        $output->writeln(sprintf('Checked %d active playbooks for missing tasks.', $checked));

        return Command::SUCCESS;
    }
}
