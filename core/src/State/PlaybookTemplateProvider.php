<?php

declare(strict_types=1);

namespace Ari\State;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProviderInterface;
use Ari\Dto\PlaybookTemplateDto;
use Ari\Service\PlaybookTemplateRegistry;

/**
 * Serves GET /api/playbook_templates.
 *
 * @implements ProviderInterface<PlaybookTemplateDto>
 */
final readonly class PlaybookTemplateProvider implements ProviderInterface
{
    public function __construct(
        private PlaybookTemplateRegistry $registry,
    ) {
    }

    /**
     * @return list<PlaybookTemplateDto>
     */
    #[\Override]
    public function provide(Operation $operation, array $uriVariables = [], array $context = []): iterable
    {
        return array_map(
            static fn ($config) => new PlaybookTemplateDto(
                preset: $config->preset,
                goal: $config->goal,
                title: $config->title,
                frequencyDays: $config->frequencyDays,
                taskTypes: $config->getTaskTypes(),
            ),
            $this->registry->findAll(),
        );
    }
}
