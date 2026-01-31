<?php

namespace Ari\Dto;

class ContactBiographyDto
{
    public function __construct(
        public readonly string $value = '',
        public readonly string $type = '',
    ) {
    }
}
