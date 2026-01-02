<?php

namespace App\Dto;

class ContactBiographyDto
{
    public function __construct(
        public readonly string $value = '',
        public readonly string $type = '',
    ) {
    }
}
