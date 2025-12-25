<?php

namespace App\State;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProcessorInterface;
use App\Security\OwnershipAwareInterface;
use Symfony\Bundle\SecurityBundle\Security;

use Symfony\Component\DependencyInjection\Attribute\Autowire;

class UserOwnerProcessor implements ProcessorInterface
{
    public function __construct(
        #[Autowire(service: 'api_platform.doctrine.orm.state.persist_processor')]
        private ProcessorInterface $persistProcessor,
        private Security $security
    ) {
    }

    public function process(mixed $data, Operation $operation, array $uriVariables = [], array $context = []): mixed
    {
        if ($data instanceof OwnershipAwareInterface && null === $data->getOwner()) {
            $user = $this->security->getUser();
            if ($user && method_exists($data, 'setUser')) {
                $data->setUser($user);
            }
        }

        return $this->persistProcessor->process($data, $operation, $uriVariables, $context);
    }
}
