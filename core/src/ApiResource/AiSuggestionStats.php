<?php

namespace Ari\ApiResource;

use ApiPlatform\Metadata\ApiProperty;
use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Get;
use Ari\State\AiSuggestionStatsProvider;
use Symfony\Component\Serializer\Attribute\Groups;

/**
 * Singleton resource — one stats object per authenticated user.
 * Used by the frontend to poll progress during batch analysis.
 */
#[ApiResource(
    shortName: 'AiSuggestionStats',
    operations: [
        new Get(
            uriTemplate: '/ai_suggestions/stats',
            provider: AiSuggestionStatsProvider::class,
            normalizationContext: ['groups' => ['ai_suggestion_stats:read']],
            security: "is_granted('ROLE_USER')",
            name: 'ai_suggestions_stats',
        ),
    ],
)]
final class AiSuggestionStats
{
    public function __construct(
        #[ApiProperty(identifier: true)]
        #[Groups(['ai_suggestion_stats:read'])]
        public string $id = 'stats',
        #[Groups(['ai_suggestion_stats:read'])]
        public int $pending = 0,
        #[Groups(['ai_suggestion_stats:read'])]
        public int $accepted = 0,
        #[Groups(['ai_suggestion_stats:read'])]
        public int $dismissed = 0,
        #[Groups(['ai_suggestion_stats:read'])]
        public int $error = 0,
        #[Groups(['ai_suggestion_stats:read'])]
        public int $skipped = 0,
        #[Groups(['ai_suggestion_stats:read'])]
        public int $tokensPrompt = 0,
        #[Groups(['ai_suggestion_stats:read'])]
        public int $tokensCompletion = 0,
    ) {
    }
}
