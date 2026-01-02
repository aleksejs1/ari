<?php

namespace App\Dto;

class ContactEmailDto
{
    public function __construct(
        public readonly string $value = '',
        public readonly string $type = '',
    ) {
    }
}
