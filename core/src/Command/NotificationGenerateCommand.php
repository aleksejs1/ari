<?php

namespace Ari\Command;

use Ari\Service\QueueGeneratorService;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;

#[AsCommand(
    name: 'ari:notifications:generate',
    description: 'Generates notification queue items based on rules and events',
)]
class NotificationGenerateCommand extends Command
{
    public function __construct(
        private QueueGeneratorService $queueGeneratorService,
    ) {
        parent::__construct();
    }

    #[\Override]
    protected function configure(): void
    {
        $this
            ->addOption('date', null, InputOption::VALUE_OPTIONAL, 'Execution date (Y-m-d)', 'today')
        ;
    }

    #[\Override]
    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $io = new SymfonyStyle($input, $output);
        $dateStr = $input->getOption('date');

        if (!is_string($dateStr)) {
            $io->error('Date option must be a string.');

            return Command::FAILURE;
        }

        try {
            $executionDate = new \DateTime($dateStr);
        } catch (\Exception $e) {
            $io->error(sprintf('Invalid date format: %s', $dateStr));

            return Command::FAILURE;
        }

        $io->info(sprintf('Generating notifications for date: %s', $executionDate->format('Y-m-d')));

        try {
            $count = $this->queueGeneratorService->generate($executionDate);
            $io->success(sprintf('Generated %d notification queue items.', $count));
        } catch (\Exception $e) {
            $io->error(sprintf('Error generating notifications: %s', $e->getMessage()));

            return Command::FAILURE;
        }

        return Command::SUCCESS;
    }
}
