<?php

declare(strict_types=1);

namespace Ari\Dto;

use Ari\Entity\ContactTask;
use Symfony\Component\Serializer\Attribute\Groups;
use Symfony\Component\Validator\Constraints as Assert;

/**
 * Input DTO for PATCH /api/contact_tasks/{id}.
 *
 * Replaces direct entity deserialization, eliminating the UnitOfWork::getOriginalEntityData() hack
 * and enabling declarative validation before the processor runs.
 */
final class ContactTaskUpdateInput
{
    #[Groups(['contact_task:update'])]
    #[Assert\Choice(choices: ContactTask::STATUSES)]
    public ?string $status = null;

    #[Groups(['contact_task:update'])]
    #[Assert\When(
        expression: "this.status === 'snoozed'",
        constraints: [
            new Assert\NotNull(message: 'snoozedUntil is required when status is snoozed.'),
            new Assert\GreaterThan('today', message: 'snoozedUntil must be a future date.'),
        ],
    )]
    public ?\DateTimeImmutable $snoozedUntil = null;
}
