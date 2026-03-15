<?php

namespace Ari\Command;

use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;

#[AsCommand(
    name: 'ari:cleanup:expired-tokens',
    description: 'Delete expired refresh tokens from the database',
)]
class CleanupExpiredTokensCommand extends Command
{
    public function __construct(
        private readonly EntityManagerInterface $entityManager,
    ) {
        parent::__construct();
    }

    #[\Override]
    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $io = new SymfonyStyle($input, $output);

        $deleted = (int) $this->entityManager
            ->createQuery('DELETE FROM Ari\Entity\RefreshToken rt WHERE rt.valid < :now')
            ->setParameter('now', new \DateTimeImmutable())
            ->execute();

        if ($deleted > 0) {
            $io->success(sprintf('Deleted %d expired refresh token(s).', $deleted));
        } else {
            $io->info('No expired tokens found.');
        }

        return Command::SUCCESS;
    }
}
