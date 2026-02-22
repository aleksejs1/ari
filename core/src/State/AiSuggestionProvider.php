<?php

namespace Ari\State;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProviderInterface;
use Ari\Entity\AiSuggestion;
use Ari\Entity\User;
use Ari\Service\Ai\AiSuggestionService;
use Symfony\Bundle\SecurityBundle\Security;

/**
 * Provides pending AiSuggestion records filtered by entityType + entityId.
 *
 * Requires query parameters:
 *   - entityType (e.g. "contact_name")
 *   - entityId   (integer)
 *
 * Returns an empty array when either filter is missing or the current user
 * is not authenticated.
 *
 * @implements ProviderInterface<AiSuggestion>
 */
final class AiSuggestionProvider implements ProviderInterface
{
    public function __construct(
        private readonly AiSuggestionService $aiSuggestionService,
        private readonly Security $security,
    ) {
    }

    /**
     * @return list<AiSuggestion>
     */
    #[\Override]
    public function provide(Operation $operation, array $uriVariables = [], array $context = []): array
    {
        $user = $this->security->getUser();
        if (!$user instanceof User) {
            return [];
        }

        $filters = $context['filters'] ?? [];
        $entityType = isset($filters['entityType']) && \is_string($filters['entityType'])
            ? $filters['entityType']
            : null;
        $entityId = isset($filters['entityId'])
            ? (int) $filters['entityId']
            : null;

        if (null === $entityType || null === $entityId || $entityId <= 0) {
            return [];
        }

        return $this->aiSuggestionService->findPendingByEntity($user, $entityType, $entityId);
    }
}
