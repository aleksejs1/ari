<?php

declare(strict_types=1);

namespace Ari\State;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProcessorInterface;
use Ari\Dto\ChangePasswordDto;
use Ari\Entity\User;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\DependencyInjection\Attribute\Autowire;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

/**
 * @implements ProcessorInterface<ChangePasswordDto, User>
 */
final readonly class UserPasswordChangeProcessor implements ProcessorInterface
{
    /**
     * @param ProcessorInterface<User, User> $persistProcessor
     */
    public function __construct(
        #[Autowire(service: 'api_platform.doctrine.orm.state.persist_processor')]
        private ProcessorInterface $persistProcessor,
        private UserPasswordHasherInterface $passwordHasher,
        private Security $security,
    ) {}

    /**
     * @param ChangePasswordDto $data
     */
    #[\Override]
    public function process(mixed $data, Operation $operation, array $uriVariables = [], array $context = []): User
    {
        $user = $context['previous_data'] ?? $this->security->getUser();

        if (!$user instanceof User) {
            throw new \LogicException('Current user not found.');
        }

        if (null === $data->currentPassword || !$this->passwordHasher->isPasswordValid($user, $data->currentPassword)) {
            throw new BadRequestHttpException('Invalid current password.');
        }

        if (null === $data->newPassword) {
            throw new BadRequestHttpException('New password cannot be empty.');
        }

        $hashedPassword = $this->passwordHasher->hashPassword(
            $user,
            $data->newPassword,
        );
        $user->setPassword($hashedPassword);

        return $this->persistProcessor->process($user, $operation, $uriVariables, $context);
    }
}
