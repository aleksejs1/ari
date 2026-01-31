<?php

namespace Ari\State;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProcessorInterface;
use Ari\Security\TenantAwareInterface;
use Symfony\Component\DependencyInjection\Attribute\Autowire;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;

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
            
            if (null === $token) {
                throw new \Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException('No authentication token found. Cannot set owner.');
            }

            $user = $token->getUser();
            
            if (!$user instanceof \Ari\Entity\User) {
                // Determine what type of user we got for debugging
                $type = is_object($user) ? get_class($user) : gettype($user);
                throw new \Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException(sprintf('Logged in user must be an instance of Ari\Entity\User (got %s). Cannot set owner.', $type));
            }

            $data->setTenant($user);
            if (method_exists($data, 'setUser')) {
                $data->setUser($user);
            }
        }

        return $this->persistProcessor->process($data, $operation, $uriVariables, $context);
    }
}
