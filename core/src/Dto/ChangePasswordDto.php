<?php

declare(strict_types=1);

namespace App\Dto;

use Symfony\Component\Validator\Constraints as Assert;

final class ChangePasswordDto
{
    #[Assert\NotBlank]
    public ?string $currentPassword = null;

    #[Assert\NotBlank]
    #[Assert\Length(min: 6)]
    public ?string $newPassword = null;
}
