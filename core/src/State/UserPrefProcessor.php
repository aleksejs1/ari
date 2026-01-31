<?php

namespace Ari\State;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProcessorInterface;
use Ari\Entity\User;
use Ari\Entity\UserPref;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\DependencyInjection\Attribute\Autowire;

/**
 * @implements ProcessorInterface<UserPref, UserPref>
 */
class UserPrefProcessor implements ProcessorInterface
{
    /**
     * @param ProcessorInterface<UserPref, UserPref> $persistProcessor
     */
    public function __construct(
        #[Autowire(service: 'api_platform.doctrine.orm.state.persist_processor')]
        private readonly ProcessorInterface $persistProcessor,
        private readonly Security $security,
    ) {
    }

    /**
     * @psalm-suppress MethodSignatureMismatch
     */
    #[\Override]
    public function process(mixed $data, Operation $operation, array $uriVariables = [], array $context = []): mixed
    {
        if ($data instanceof UserPref) {
            $user = $this->security->getUser();
            if ($user instanceof User) {
                if (null === $data->getUser()) {
                    $data->setUser($user);
                }
                if (null === $data->getTenant()) {
                    $data->setTenant($user);
                }
            }
        }

        return $this->persistProcessor->process($data, $operation, $uriVariables, $context);
    }
}
