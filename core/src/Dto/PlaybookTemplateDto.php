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
#[GetCollection(
    uriTemplate: '/playbook_templates',
    name: 'playbook_templates_list',
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
