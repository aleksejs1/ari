<?php

declare(strict_types=1);

namespace Ari\Dto;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\GetCollection;
use Ari\State\PlaybookTemplateProvider;

#[ApiResource(
    security: "is_granted('ROLE_USER')",
    provider: PlaybookTemplateProvider::class,
)]
// Templates are loaded from a static PHP config file; they change only on deploy.
// Browser-level caching (private, 1 h) avoids redundant API calls during a session.
#[GetCollection(
    uriTemplate: '/playbook_templates',
    name: 'playbook_templates_list',
    cacheHeaders: ['max_age' => 3600, 'vary' => ['Accept', 'Authorization']],
)]
final class PlaybookTemplateDto
{
    /**
     * @param list<string> $taskTypes
     */
    public function __construct(
        public readonly string $preset,
        public readonly string $goal,
        public readonly string $title,
        public readonly int $frequencyDays,
        public readonly array $taskTypes,
    ) {
    }
}
