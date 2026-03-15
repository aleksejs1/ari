<?php

declare(strict_types=1);

namespace Ari\State;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProviderInterface;
use Ari\ApiResource\ContactDisplayOptions;
use Ari\Entity\User;
use Ari\Repository\ContactDisplayOptionsRepository;
use Ari\Security\ApiKeyToken;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\Security\Core\Exception\AccessDeniedException;

/**
 * @implements ProviderInterface<ContactDisplayOptions>
 */
final readonly class ContactDisplayOptionsProvider implements ProviderInterface
{
    public function __construct(
        private Security $security,
        private ContactDisplayOptionsRepository $repository,
    ) {
    }

    /**
     * @param array<string, mixed> $uriVariables
     * @param array<string, mixed> $context
     */
    #[\Override]
    public function provide(Operation $operation, array $uriVariables = [], array $context = []): ContactDisplayOptions
    {
        $user = $this->security->getUser();

        if (!$user instanceof User) {
            throw new AccessDeniedException('Authentication required.');
        }

        // Enforce contacts:read scope when the request is authenticated via an API key.
        $token = $this->security->getToken();
        if ($token instanceof ApiKeyToken && !$token->hasScope('contacts:read')) {
            throw new AccessDeniedException('API key missing required scope: contacts:read');
        }

        return new ContactDisplayOptions(
            id: 'current',
            nameLocales: $this->repository->getDistinctNameLocales($user),
            phoneTypes: $this->repository->getDistinctPhoneTypes($user),
            emailTypes: $this->repository->getDistinctEmailTypes($user),
            dateTexts: $this->repository->getDistinctDateTexts($user),
        );
    }
}
