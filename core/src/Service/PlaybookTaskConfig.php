<?php

declare(strict_types=1);

namespace Ari\Service;

/**
 * Immutable value object describing one task series within a preset.
 */
final readonly class PlaybookTaskConfig
{
    public function __construct(
        public string $type,
        public bool $isOffline,
        public int $frequencyDays,
        public ?string $question,
    ) {
    }
}
