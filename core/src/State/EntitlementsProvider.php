<?php

namespace Ari\State;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProviderInterface;
use Ari\ApiResource\Entitlements;
use Ari\Entity\User;
use Ari\Service\Entitlement\EntitlementServiceInterface;
use Symfony\Bundle\SecurityBundle\Security;

/**
 * @implements ProviderInterface<Entitlements>
 */
final readonly class EntitlementsProvider implements ProviderInterface
{
    public function __construct(
        private EntitlementServiceInterface $entitlementService,
        private Security $security,
    ) {}

    /**
     * @param array<string, mixed> $uriVariables
     * @param array<string, mixed> $context
     */
    #[\Override]
    public function provide(Operation $operation, array $uriVariables = [], array $context = []): Entitlements
    {
        $user = $this->security->getUser();
        if (!$user instanceof User) {
            // Security attribute on the operation already guards against this,
            // but be explicit for static analysis.
            throw new \LogicException('Authenticated User entity required.');
        }

        $snapshot = $this->entitlementService->getSnapshot($user);

        $resource = new Entitlements();
        $resource->planId = $snapshot->planId;
        $resource->isAdminOverride = $snapshot->isAdminOverride;
        $resource->quotas = $snapshot->quotas;
        $resource->features = $snapshot->features;

        return $resource;
    }
}
