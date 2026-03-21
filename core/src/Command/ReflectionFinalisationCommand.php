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
    name: 'playbooks:finalise-reflections',
    description: 'Mark awaiting_reflection tasks as completed once their reflection window has passed.',
)]
final class ReflectionFinalisationCommand extends Command
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
        $count = $this->playbookService->finaliseOverdueReflections();

        $this->logger->info('reflections_finalised', ['count' => $count]);
        $output->writeln(sprintf('Finalised %d overdue reflections.', $count));

        return Command::SUCCESS;
    }
}
