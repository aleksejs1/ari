<?php

namespace Ari\Command;

use Ari\Service\E2e\E2eSeedService;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;

#[AsCommand(
    name: 'ari:e2e:seed',
    description: 'Seed database with E2E test data (only available when E2E_MODE=1)',
)]
class E2eSeedCommand extends Command
{
    public function __construct(
        private readonly E2eSeedService $seedService,
    ) {
        parent::__construct();
    }

    #[\Override]
    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        if ('1' !== ($_ENV['E2E_MODE'] ?? '')) {
            $output->writeln('<error>E2E mode is not enabled. Set E2E_MODE=1.</error>');

            return Command::FAILURE;
        }

        $output->writeln('Seeding E2E test data...');

        $this->seedService->seed();

        $output->writeln('<info>E2E seed complete.</info>');
        $output->writeln('  User A: e2e-user / e2e-password');
        $output->writeln('  User B: e2e-user-b / e2e-password');
        $output->writeln('  Admin:  e2e-admin / e2e-password');

        return Command::SUCCESS;
    }
}
