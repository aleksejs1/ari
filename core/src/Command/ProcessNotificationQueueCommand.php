<?php

namespace Ari\Command;

use Ari\Service\Notification\NotificationProcessor;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;

#[AsCommand(
    name: 'ari:notification:process',
    description: 'Process pending notification queue items',
)]
class ProcessNotificationQueueCommand extends Command
{
    public function __construct(
        private readonly NotificationProcessor $notificationProcessor,
    ) {
        parent::__construct();
    }

    #[\Override]
    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $io = new SymfonyStyle($input, $output);

        $processed = $this->notificationProcessor->process();

        if ($processed > 0) {
            $io->success(sprintf('Processed %d notification(s).', $processed));
        } else {
            $io->info('No pending notifications found.');
        }

        return Command::SUCCESS;
    }
}
