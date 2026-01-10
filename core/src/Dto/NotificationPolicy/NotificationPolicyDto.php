<?php

namespace App\Dto\NotificationPolicy;

use ApiPlatform\Metadata\ApiProperty;
use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Get;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;

#[ApiResource(
    operations: [
        new Get(uriTemplate: '/notification-policies/{id}'),
    ],
)]
class NotificationPolicyDto
{
    #[ApiProperty(identifier: true)]
    #[Groups(['notification_policy:read'])]
    public ?int $id = null;

    #[Assert\NotBlank]
    #[Groups(['notification_policy:read'])]
    public ?string $name = null;

    /**
     * @var array<string, mixed>|null
     */
    #[Assert\NotNull]
    #[Assert\Collection(
        fields: [
            'type' => new Assert\Choice(choices: ['group', 'contact', 'all']),
            'ids' => new Assert\Optional([new Assert\All([new Assert\NotBlank()])]),
        ],
        allowMissingFields: true,
    )]
    #[Groups(['notification_policy:read'])]
    public ?array $targets = null;

    #[Assert\Callback]
    public function validateTargets(\Symfony\Component\Validator\Context\ExecutionContextInterface $context): void
    {
        if (!isset($this->targets['type'])) {
            return;
        }

        $type = $this->targets['type'];
        if ('all' !== $type) {
            if (!isset($this->targets['ids']) || [] === $this->targets['ids']) {
                $context->buildViolation('This value should not be blank.')
                    ->atPath('targets[ids]')
                    ->addViolation();
            }
        }
    }

    /**
     * @var array<string>|null
     */
    #[Assert\NotNull]
    #[Assert\All([new Assert\NotBlank()])]
    #[Groups(['notification_policy:read'])]
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
                'channels' => new Assert\All([new Assert\NotBlank()]),
            ],
            allowMissingFields: false,
        ),
    ])]
    #[Groups(['notification_policy:read'])]
    public ?array $schedule = null;
}
