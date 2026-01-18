<?php

namespace App\Command;

use App\Service\Demo\DemoAccountService;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;

#[AsCommand(
    name: 'app:generate-demo-account',
    description: 'Generates a demo account with 70 contacts and complex relationships.',
)]
class GenerateDemoAccountCommand extends Command
{
    public function __construct(
        private DemoAccountService $demoAccountService,
    ) {
        parent::__construct();
    }

    #[\Override]
    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $io = new SymfonyStyle($input, $output);

        $io->title('Generating Demo Account...');

        try {
            $user = $this->demoAccountService->generateDemoAccount();
            $io->success('Demo account generated successfully!');
            $io->info('User UUID: ' . (string) $user->getUuid());
            $io->info('Password: demo');

            return Command::SUCCESS;
        } catch (\Exception $e) {
            $io->error('Error generating demo account: ' . $e->getMessage());

            return Command::FAILURE;
        }
    }
}
