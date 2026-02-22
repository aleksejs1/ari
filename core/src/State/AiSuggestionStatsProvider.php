<?php

namespace Ari\State;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProviderInterface;
use Ari\ApiResource\AiSuggestionStats;
use Ari\Entity\User;
use Ari\Service\Ai\AiSuggestionService;
use Symfony\Bundle\SecurityBundle\Security;

/**
 * @implements ProviderInterface<AiSuggestionStats>
 */
final class AiSuggestionStatsProvider implements ProviderInterface
{
    public function __construct(
        private readonly AiSuggestionService $aiSuggestionService,
        private readonly Security $security,
    ) {
    }

    #[\Override]
    public function provide(Operation $operation, array $uriVariables = [], array $context = []): AiSuggestionStats
    {
        $user = $this->security->getUser();
        if (!$user instanceof User) {
            return new AiSuggestionStats();
        }

        $stats = $this->aiSuggestionService->getStats($user);

        return new AiSuggestionStats(
            pending: $stats['pending'],
            accepted: $stats['accepted'],
            dismissed: $stats['dismissed'],
            error: $stats['error'],
            skipped: $stats['skipped'],
            tokensPrompt: $stats['tokensPrompt'],
            tokensCompletion: $stats['tokensCompletion'],
        );
    }
}
