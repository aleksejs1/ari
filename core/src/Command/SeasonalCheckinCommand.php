<?php

declare(strict_types=1);

namespace Ari\Command;

use Ari\Service\SeasonalCheckinService;
use Psr\Log\LoggerInterface;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;

#[AsCommand(
    name: 'playbooks:seasonal-checkin',
    description: 'Creates a seasonal check-in notification for users with active playbooks who have not been reminded in the last 90 days.',
)]
final class SeasonalCheckinCommand extends Command
{
    public function __construct(
        private readonly SeasonalCheckinService $checkinService,
        private readonly LoggerInterface $logger,
    ) {
        parent::__construct();
    }

    #[\Override]
    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $count = $this->checkinService->generateForAllActiveUsers();

        $this->logger->info('seasonal_checkins_generated', ['count' => $count]);
        $output->writeln(sprintf('Created %d seasonal check-in notification(s).', $count));

        return Command::SUCCESS;
    }
}
