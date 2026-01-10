<?php

declare(strict_types=1);

namespace App\Dto;

use Symfony\Component\Security\Core\Validator\Constraints as SecurityAssert;
use Symfony\Component\Validator\Constraints as Assert;

final class ChangePasswordDto
{
    #[Assert\NotBlank]
    public ?string $currentPassword = null;

    #[Assert\NotBlank]
    #[Assert\Length(min: 8)]
    public ?string $newPassword = null;
}
