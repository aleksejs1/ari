<?php

namespace App\Command;

use App\Service\NotificationProcessingService;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;

#[AsCommand(
    name: 'app:process-notifications',
    description: 'Process all active notification subscriptions and send notifications if criteria met.',
)]
class ProcessNotificationsCommand extends Command
{
    public function __construct(
        private readonly NotificationProcessingService $notificationService,
    ) {
        parent::__construct();
    }

    #[\Override]
    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $io = new SymfonyStyle($input, $output);

        try {
            $this->notificationService->processAll($io);
        } catch (\Throwable $e) {
            $io->error('An error occurred while processing notifications: ' . $e->getMessage());

            return Command::FAILURE;
        }

        return Command::SUCCESS;
    }
}
