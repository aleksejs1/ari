<?php

namespace Ari\Command;

use Ari\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;

#[AsCommand(
    name: 'ari:user:demote',
    description: 'Demotes an ADMIN user to regular user',
)]
class UserDemoteCommand extends Command
{
    public function __construct(
        private readonly EntityManagerInterface $entityManager,
    ) {
        parent::__construct();
    }

    #[\Override]
    protected function configure(): void
    {
        $this
            ->addArgument('uuid', InputArgument::REQUIRED, 'The UUID of the user to demote');
    }

    #[\Override]
    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $io = new SymfonyStyle($input, $output);
        $uuid = $input->getArgument('uuid');

        $user = $this->entityManager->getRepository(User::class)->findOneBy(['uuid' => $uuid]);

        if ($user === null) {
            $io->error(sprintf('User with UUID "%s" not found.', $uuid));

            return Command::FAILURE;
        }

        $roles = $user->getRoles();
        if (!in_array('ROLE_ADMIN', $roles, true)) {
            $io->note(sprintf('User "%s" is not an admin.', $uuid));

            return Command::SUCCESS;
        }

        $roles = array_filter($roles, fn($role) => $role !== 'ROLE_ADMIN');
        $user->setRoles(array_values($roles));

        $this->entityManager->flush();

        $io->success(sprintf('User "%s" has been demoted.', $uuid));

        return Command::SUCCESS;
    }
}
