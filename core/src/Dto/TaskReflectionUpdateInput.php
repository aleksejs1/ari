<?php

declare(strict_types=1);

namespace Ari\Dto;

use Symfony\Component\Serializer\Attribute\Groups;
use Symfony\Component\Validator\Constraints as Assert;

/**
 * Input DTO for PATCH /api/task_reflections/{id}.
 * Eliminates the UnitOfWork::getOriginalEntityData() hack in TaskReflectionProcessor.
 */
final class TaskReflectionUpdateInput
{
    #[Groups(['task_reflection:update'])]
    #[Assert\Length(max: 10000)]
    public ?string $answer = null;
}
