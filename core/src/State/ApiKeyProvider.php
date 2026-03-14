<?php

namespace Ari\State;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\Pagination\TraversablePaginator;
use ApiPlatform\State\ProviderInterface;
use Ari\Entity\ApiKey;
use Ari\Entity\User;
use Ari\Repository\ApiKeyRepository;
use Symfony\Bundle\SecurityBundle\Security;

/**
 * @implements ProviderInterface<ApiKey>
 */
final class ApiKeyProvider implements ProviderInterface
{
    public function __construct(
        private readonly ApiKeyRepository $apiKeyRepository,
        private readonly Security $security,
    ) {
    }

    #[\Override]
    public function provide(Operation $operation, array $uriVariables = [], array $context = []): object|array|null
    {
        $user = $this->security->getUser();
        if (!$user instanceof User) {
            return null;
        }

        // Single item
        if (isset($uriVariables['id'])) {
            return $this->apiKeyRepository->find($uriVariables['id']);
        }

        // Collection
        $page = (int) ($context['filters']['page'] ?? 1);
        $itemsPerPage = 30;
        if (isset($context['filters']['itemsPerPage'])) {
            $itemsPerPage = min((int) $context['filters']['itemsPerPage'], 100);
        }
        $offset = ($page - 1) * $itemsPerPage;

        $total = $this->apiKeyRepository->countByTenant($user);
        $items = $this->apiKeyRepository->findByTenant($user, $itemsPerPage, $offset);

        return new TraversablePaginator(
            new \ArrayIterator($items),
            $page,
            $itemsPerPage,
            $total,
        );
    }
}
