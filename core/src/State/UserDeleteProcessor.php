<?php

declare(strict_types=1);

namespace App\State;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProcessorInterface;
use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\DependencyInjection\Attribute\Autowire;
use Symfony\Bundle\SecurityBundle\Security;

/**
 * @implements ProcessorInterface<User, void>
 */
final readonly class UserDeleteProcessor implements ProcessorInterface
{
    /**
     * @param ProcessorInterface<User, void> $removeProcessor
     */
    public function __construct(
        #[Autowire(service: 'api_platform.doctrine.orm.state.remove_processor')]
        private ProcessorInterface $removeProcessor,
        private EntityManagerInterface $entityManager,
        private Security $security,
    ) {
    }

    /**
     * @param User|null $data
     */
    #[\Override]
    public function process(mixed $data, Operation $operation, array $uriVariables = [], array $context = []): void
    {
        $user = $data ?? $this->security->getUser();

        if (!$user instanceof User) {
            return;
        }

        // TokenStorage doesn't have orphanRemoval: true on the User entity.
        // We must manually remove them or they will stay as "zombie" tokens.
        foreach ($user->getTokenStorages() as $tokenStorage) {
            $this->entityManager->remove($tokenStorage);
        }

        $this->removeProcessor->process($user, $operation, $uriVariables, $context);
    }
}
