<?php

namespace App\State;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProcessorInterface;
use App\Security\TenantAwareInterface;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;
use Symfony\Component\DependencyInjection\Attribute\Autowire;

/**
 * @implements ProcessorInterface<mixed, mixed>
 */
class UserOwnerProcessor implements ProcessorInterface
{
    /**
     * @param ProcessorInterface<mixed, mixed> $persistProcessor
     * @param ProcessorInterface<mixed, mixed> $removeProcessor
     */
    public function __construct(
        #[Autowire(service: 'api_platform.doctrine.orm.state.persist_processor')]
        private ProcessorInterface $persistProcessor,
        #[Autowire(service: 'api_platform.doctrine.orm.state.remove_processor')]
        private ProcessorInterface $removeProcessor,
        private TokenStorageInterface $tokenStorage,
    ) {
    }

    #[\Override]
    public function process(mixed $data, Operation $operation, array $uriVariables = [], array $context = []): mixed
    {
        if ($operation instanceof \ApiPlatform\Metadata\Delete) {
            return $this->removeProcessor->process($data, $operation, $uriVariables, $context);
        }

        if ($data instanceof TenantAwareInterface && null === $data->getTenant()) {
            $token = $this->tokenStorage->getToken();
            $user = $token?->getUser();
            if ($user instanceof \App\Entity\User) {
                if (method_exists($data, 'setTenant')) {
                    $data->setTenant($user);
                }
                if (method_exists($data, 'setUser')) {
                    $data->setUser($user);
                }
            }
        }

        return $this->persistProcessor->process($data, $operation, $uriVariables, $context);
    }
}
