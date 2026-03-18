<?php

declare(strict_types=1);

namespace Ari\Service;

/**
 * Immutable value object describing a playbook preset template.
 *
 * @param list<PlaybookTaskConfig> $tasks
 */
final readonly class PlaybookTemplateConfig
{
    /**
     * @param list<PlaybookTaskConfig> $tasks
     */
    public function __construct(
        public string $preset,
        public string $goal,
        public string $title,
        public int $frequencyDays,
        public array $tasks,
    ) {
    }

    /** @return list<string> */
    public function getTaskTypes(): array
    {
        return array_map(static fn (PlaybookTaskConfig $t): string => $t->type, $this->tasks);
    }
}
