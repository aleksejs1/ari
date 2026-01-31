<?php

namespace Ari\Dto;

use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\Validator\Constraints as Assert;

class AvatarUploadInput
{
    #[Assert\NotBlank]
    #[Assert\Image(
        maxSize: '5M',
        mimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
    )]
    public ?UploadedFile $file = null;
}
