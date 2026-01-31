<?php

declare(strict_types=1);

namespace Ari\State;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProviderInterface;
use Ari\Entity\User;
use Symfony\Bundle\SecurityBundle\Security;

/**
 * @implements ProviderInterface<User>
 */
final readonly class CurrentUserProvider implements ProviderInterface
{
    public function __construct(
        private Security $security,
    ) {
    }

    #[\Override]
    public function provide(Operation $operation, array $uriVariables = [], array $context = []): ?User
    {
        $user = $this->security->getUser();

        if (!$user instanceof User) {
            return null;
        }

        return $user;
    }
}
