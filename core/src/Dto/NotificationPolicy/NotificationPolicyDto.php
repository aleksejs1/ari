<?php

namespace App\Dto\NotificationPolicy;

use Symfony\Component\Validator\Constraints as Assert;

class NotificationPolicyDto
{
    #[Assert\NotBlank]
    public ?string $name = null;

    /**
     * @var array<string, mixed>|null
     */
    #[Assert\NotNull]
    #[Assert\Collection(
        fields: [
            'type' => new Assert\Choice(choices: ['group', 'contact']),
            'ids' => new Assert\All([new Assert\NotBlank()])
        ],
        allowMissingFields: false
    )]
    public ?array $targets = null;

    /**
     * @var array<string>|null
     */
    #[Assert\NotNull]
    #[Assert\All([new Assert\NotBlank()])]
    public ?array $eventTypes = null;

    /**
     * @var array<int, array<string, mixed>>|null
     */
    #[Assert\NotNull]
    #[Assert\All([
        new Assert\Collection(
            fields: [
                'offsetDays' => new Assert\Type('integer'),
                'time' => new Assert\Regex('/^\d{2}:\d{2}$/'),
                'channels' => new Assert\All([new Assert\NotBlank()])
            ],
            allowMissingFields: false
        )
    ])]
    public ?array $schedule = null;
}
